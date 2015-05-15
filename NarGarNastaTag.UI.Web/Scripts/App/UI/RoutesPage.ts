/// <reference path="../declarations/jquery.d.ts" />
/// <reference path="../declarations/jquery.mobile.d.ts" />
/// <reference path="../declarations/q.d.ts" />
/// <reference path="../Commuter.ts" />
/// <reference path="../UrlHelper.ts" />
/// <reference path="../Logger.ts" />

var CommuterController = require('../Commuter');
var Logger = require('../Logger');
var UrlHelper = require('../UrlHelper');
var Q = require('Q');

class RoutesPage {
    private commuterController;
    private routeQueue = [];
    private numberOfRoutesToCheck = -1;
    private numberOfRoutesChecked = 0;
    private routesFound = false;

    load() {
        var that = this;

        this.commuterController = new CommuterController();
        $.mobile.loading('show', {
            text: 'Laddar kommande avgångar...',
            textVisible: false,
            theme: 'a',
            html: ""
        });

        this.getFavouriteRoutes(function(reason: string, foundRoutes: boolean) {
            if (!foundRoutes && (that.numberOfRoutesChecked === that.numberOfRoutesToCheck || that.numberOfRoutesToCheck === -1)) {
                var currentTime = new Date().getHours();
                if (currentTime >= 22 || currentTime <= 5)
                    $('#noRoutesFoundPopup .nighttimeInfo').show();
                $('#noRoutesFoundPopup').popup('open');
                reason && (new Logger()).inform(reason);
            }
            $.mobile.loading('hide');
        });
    }

    getFavouriteRoutes(callback: Function) {
        var that = this;
        var url = decodeURIComponent(window.location.href);
        var match = RegExp('from\\/[\\d\\,\\wåäöÅÄÖ]+').exec(url);
        var fromId = match && match[0].replace('from/', '');
        match = RegExp('to\\/[\\d\\,\\wåäöÅÄÖ]+').exec(url);
        var toId = match && match[0].replace('to/', '');

        that.commuterController.scrapeStationRoutes(fromId, function(ctx) {
            if (!ctx.data || ctx.data.length === 0) {
                callback("No results for query.", false);
                return;
            }
            that.numberOfRoutesToCheck = (ctx.data.length) || 1;
            for (; that.numberOfRoutesChecked < that.numberOfRoutesToCheck; that.numberOfRoutesChecked++) {
                var queryUri: string = ctx.data.Url || ctx.data[that.numberOfRoutesChecked].Url;
                var routeInfo: string = UrlHelper.getQueryStringParameterByName(queryUri, 'train');
                var date: string = routeInfo.split(',')[0];
                var formattedTrainNo: string = routeInfo.split(',')[1];
                var route: any = { index: that.numberOfRoutesChecked, routeDate: date, trainNo: formattedTrainNo, fromStationId: fromId, toStationId: toId };
                that.routeQueue.push(route);
            }
            var $templateElement = $('#routeItemTemplate').clone();
            $('#routes')
                .html('')
                .append($templateElement);
            that.queryRoutes($templateElement, function(foundRoutes) {
                callback && callback('', foundRoutes);
            });
        });
    }

    queryRoutes($templateElement: JQuery, callback: Function) {
        var that = this;
        if (!that.routeQueue || that.routeQueue.length === 0) {
            callback && callback(that.routesFound);
            return;
        }
        return that.routeQueue.map(that.queryRoute.bind(that)).map(function(query: any) {
            return function() {
                var noop = $.noop;
                return query.then(function(data, noop) {
                    that.routesFound = true;
                    callback && callback(that.routesFound);
                    that.displayRoute(data, $templateElement, callback);
                });

            }
        }).reduce(Q.when, Q);
    }

    queryRoute(routeToQuery: any) {
        $.support.cors = true;
        var that = this;
        return Q($.ajax({
            url: that.commuterController.getApiUrl() + '/query/date/' + routeToQuery.routeDate + '/route/' + parseInt(routeToQuery.trainNo) + '/from/' + routeToQuery.fromStationId + '/to/' + routeToQuery.toStationId,
            type: "GET",
            dataType: "json",
            cache: false,
            timeout: 5000
        }));
    }

    displayRoute(data: any, $templateElement: JQuery, callback: Function) {
        if (!data || data.length <= 0) return;
        var route = data[0];
        var $newElement = $templateElement.clone();
        $newElement.prop("id", this.commuterController.idGenerator.getId());
        var routeCount = $('.route').length;
        var oddOrEven = (routeCount % 2 === 0) ? 'even' : 'odd';
        $newElement.addClass(oddOrEven);
        var $trainNumberTag = $newElement.find('.trainNo');
        $trainNumberTag.text(route.RouteNo);
        var $fromTag = $newElement.find('.fromStation');
        $fromTag.text(route.FromStation.StationName);
        var $toTag = $newElement.find('.toStation');
        $toTag.text(route.ToStation.StationName);
        var $departureTag = $newElement.find('.departure');
        if (route.FromStation.UpdatedDeparture) {
            $departureTag.text(route.FromStation.UpdatedDeparture);
            if (route.FromStation.ScheduledDeparture) {
                var scheduledDepartureTag = $newElement.find('.scheduledDeparture');
                scheduledDepartureTag.text(route.FromStation.ScheduledDeparture);
                var departureDelayedTag = $newElement.find('.departureDelayed');
                departureDelayedTag.removeClass('hide');
            }
        } else {
            $departureTag.text(route.FromStation.ScheduledDeparture);
        }
        var $notesTag = $newElement.find('.notes');
        var notes = [];
        route.FromStation.IsCancelled && notes.push('ställts in');
        var $arrivalTag = $newElement.find('.arrival');
        if (route.FromStation.IsCancelled) {
            $arrivalTag.text('');
        } else {
            var arrival = route.ToStation.UpdatedArrival || route.ToStation.ScheduledArrival;
            if (arrival) {
                if (route.ToStation.UpdatedArrival && route.ToStation.ScheduledArrival) {
                    var scheduledArrivalTag = $newElement.find('.scheduledArrival');
                    scheduledArrivalTag.text(route.ToStation.ScheduledArrival);
                    var arrivalDelayedTag = $newElement.find('.arrivalDelayed');
                    arrivalDelayedTag.removeClass('hide');
                }
            } else {
                arrival = route.ToStation.UpdatedDeparture || route.ToStation.ScheduledDeparture;
            }
            $arrivalTag.text(arrival);
            var $departureTrackTag = $newElement.find('.departureTrack');
            $departureTrackTag.text(route.FromStation.Track);
            var $arrivalTrackTag = $newElement.find('.arrivalTrack');
            $arrivalTrackTag.text(route.ToStation.Track);
        }
        if (!route.FromStation.IsCancelled) {
            route.FromStation.UpdatedDeparture ? notes.push('uppdaterad avgångstid') : notes.push('avgångstid enligt tidtabell');
            route.FromStation.TrackChanged && notes.push('uppdaterat avgångsspår');
            route.ToStation.TrackChanged && notes.push('uppdaterat ankomstspår');
            !route.ToStation.ScheduledArrival && notes.push('uppskattad ankomstid');
            route.ToStation.UpdatedArrival && notes.push('uppdaterad ankomstid');
        }
        $notesTag.text('Tåget har ' + notes.join(', ') + '.');
        if (!route.TrainOperator)
            $newElement.find('.hasTrainOperator').hide();
        else {
            var $trainOperatorTag = $newElement.find('.trainOperator');
            $trainOperatorTag.text(route.TrainOperator);
        }
        var $routeInfoLinkTag = $newElement.find('.routeInfo');
        var routeLink = $routeInfoLinkTag.prop('href');
        $routeInfoLinkTag.prop('href', routeLink
            .replace('route=', 'route=' + route.StartDate + ',' + route.RouteNo + '&no=')
            .replace('http://' + window.location.host, ''));

        var $routesPlaceHolder = $('#routes');
        $routesPlaceHolder.append($newElement);

        $newElement.fadeIn('slow');

        var $routesPlaceHolder = $('#routes');
    }

    clearQueue() {
        this.routeQueue = null;
    }
}

var routesPage = new RoutesPage();
$('#routesPage').bind('pageshow', function() {
    routesPage.load();
});
$('#routesPage').bind("pagehide", function() {
    routesPage.clearQueue();
});