/// <reference path="../declarations/jquery.d.ts" />
/// <reference path="../declarations/jquery.mobile.d.ts" />
/// <reference path="../declarations/q.chain.d.ts" />
/// <reference path="../commuter.ts" />
/// <reference path="../UrlHelper.ts" />
/// <reference path="../Logger.ts" />
var commuterController;
(function ($, controller) {
    $(document).bind('pageinit', function () {
    });
})(jQuery, commuterController || (commuterController = new Commuter.Trains.CommuterController()));

var RoutesPage = function () {
    this.routeQueue = [];
    this.numberOfRoutesToCheck = -1;
    this.numberOfRoutesChecked = 0;
    this.routesFound = false;
    var that = this;

    this.load = function () {
        $.mobile.loading('show', {
            text: 'Laddar kommande avgångar...',
            textVisible: false,
            theme: 'a',
            html: ""
        });

        this.getFavouriteRoutes(function (reason, foundRoutes) {
            if (!foundRoutes && (that.numberOfRoutesChecked === that.numberOfRoutesToCheck || that.numberOfRoutesToCheck === -1)) {
                var currentTime = new Date().getHours();
                if (currentTime >= 22 || currentTime <= 5)
                    $('#noRoutesFoundPopup .nighttimeInfo').show();
                $('#noRoutesFoundPopup').popup('open');
                reason && (new Commuter.Trains.Common.Logger()).inform(reason);
            }
            $.mobile.loading('hide');
        });
    };

    this.getFavouriteRoutes = function (callback) {
        var url = decodeURIComponent(window.location.href);
        var match = RegExp('from\\/[\\d\\,\\wåäöÅÄÖ]+').exec(url);
        var fromId = match && match[0].replace('from/', '');
        match = RegExp('to\\/[\\d\\,\\wåäöÅÄÖ]+').exec(url);
        var toId = match && match[0].replace('to/', '');

        commuterController.scrapeStationRoutes(fromId, function (ctx) {
            if (!ctx.data || ctx.data.length === 0) {
                callback("No results for query.", false);
                return;
            }
            that.numberOfRoutesToCheck = (ctx.data.length) || 1;
            for (; that.numberOfRoutesChecked < that.numberOfRoutesToCheck; that.numberOfRoutesChecked++) {
                var queryUri = ctx.data.Url || ctx.data[that.numberOfRoutesChecked].Url;
                var routeInfo = Commuter.Trains.Common.UrlHelper.getQueryStringParameterByName(queryUri, 'train');
                var date = routeInfo.split(',')[0];
                var formattedTrainNo = routeInfo.split(',')[1];
                var route = { index: that.numberOfRoutesChecked, routeDate: date, trainNo: formattedTrainNo, fromStationId: fromId, toStationId: toId };
                that.routeQueue.push(route);
            }
            var $templateElement = $('#routeItemTemplate').clone();
            $('#routes').html('').append($templateElement);
            that.queryRoutes($templateElement, function (foundRoutes) {
                callback && callback('', foundRoutes);
            });
        });
    };

    this.queryRoutes = function ($templateElement, callback) {
        var _this = this;
        if (!that.routeQueue || that.routeQueue.length === 0) {
            callback && callback(that.routesFound);
            return;
        }
        var tasks = [];
        that.routeQueue.forEach(function (value) {
            tasks.push(_this.queryRoute(value, $templateElement, callback));
        });
        Q.chain(tasks);
    };

    this.queryRoute = function (routeToQuery, $templateElement, callback) {
        return function (deferred) {
            $.support.cors = true;
            $.ajax({
                url: commuterController.apiUrl + '/query/date/' + routeToQuery.routeDate + '/route/' + parseInt(routeToQuery.trainNo) + '/from/' + routeToQuery.fromStationId + '/to/' + routeToQuery.toStationId,
                type: "GET",
                dataType: "json",
                cache: false,
                success: function (data) {
                    deferred.resolve(function () {
                        that.routesFound = true;
                        callback && callback(that.routesFound);
                        that.displayRoute(data, $templateElement, callback);
                    });
                },
                error: function () {
                    deferred.reject(function () {
                    });
                },
                timeout: 5000
            });
        };
    };

    this.displayRoute = function (data, $templateElement) {
        if (!data || data.length <= 0)
            return;
        var route = data[0];
        var $newElement = $templateElement.clone();
        $newElement.prop("id", commuterController.idGenerator.getId());
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
        $routeInfoLinkTag.prop('href', routeLink.replace('route=', 'route=' + route.StartDate + ',' + route.RouteNo + '&no=').replace('http://' + window.location.host, ''));

        var $routesPlaceHolder = $('#routes');
        $routesPlaceHolder.append($newElement);

        $newElement.fadeIn('slow');

        var $routesPlaceHolder = $('#routes');
    };
};
