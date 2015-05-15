/// <reference path="../declarations/jquery.d.ts" />
/// <reference path="../commuter.ts" />
/// <reference path="../UrlHelper.ts" />
/// <reference path="../Logger.ts" />

var CommuterController = require('../Commuter');
var UrlHelper = require('../UrlHelper');
var Logger = require('../Logger');

class TrainPage {
    private commuterController;

    constructor() {
        this.commuterController = new CommuterController();
    }

    load() {
        $.mobile.loading('show', {
            text: 'Laddar hållplatser...',
            textVisible: false,
            theme: 'a',
            html: ""
        });
        this.getStops(function() {
            $.mobile.loading('hide');
        });
    }

    getStops(callback: Function) {
        var that = this;
        var routeInfo: string = UrlHelper.getQueryStringParameterByName(window.location.href, 'route');
        var date: string = routeInfo.split(',')[0];
        var trainNo: string = routeInfo.split(',')[1];
        var numberOfStations: number = -1;
        var server: number = that.commuterController.idGenerator.getRandomRangedInteger(5, 6);
        that.commuterController.queryRemote('http://www' + server.toString() + '.trafikverket.se/Trafikinformation/WebPage/TrafficSituationTrain.aspx?train=' + date + ',' + trainNo,
            '//table[@id="Trafficsituationtraincomponent_TrafficSituationDataGrid"]/tr',
            function(context) {
                if (!context.data.query.results) return;
                if (!context.data.query.results.tr) return;
                context.data.query.results.tr.shift();
                var displayedHeader = false;
                $.each(context.data.query.results.tr, function() {
                    var $newElement = $("#stopOnRouteItemTemplate").clone();
                    $newElement.prop('id', that.commuterController.idGenerator.getId());
                    numberOfStations++;
                    if (numberOfStations % 2 !== 0)
                        $newElement.addClass('alternate');

                    var $stopName = $newElement.find('.stopName');
                    var $stopArrival = $newElement.find('.stopArrival');
                    var $stopDeparture = $newElement.find('.stopDeparture');
                    var $stopTrack = $newElement.find('.stopTrack');
                    var $comment = $newElement.find('.comment');

                    try {
                        if (typeof this.td[0].div === 'undefined') {
                            return;
                        }
                        else {
                            $stopName.text(this.td[0].div.a.content);
                        }

                        if (typeof this.td[1].p !== 'undefined') {
                            $stopArrival.text('');
                        }
                        else if (typeof this.td[1].div[2] !== 'undefined') {
                            if (typeof this.td[1].div[2].em !== 'undefined') {
                                if (typeof this.td[1].div[2].em.strong !== 'undefined')
                                    $stopArrival.text(this.td[1].div[2].em.strong);
                                else
                                    $stopArrival.text(this.td[1].div[2].em);
                            }
                            else if (typeof this.td[1].div[2].i !== 'undefined') {
                                $stopArrival.text(this.td[1].div[2].i);
                            }
                        }
                        else if (typeof this.td[1].div !== 'undefined') {
                            $stopArrival.text(this.td[1].div.p);
                        }

                        if (typeof this.td[2].p !== 'undefined') {
                            $stopDeparture.text('');
                        }
                        else if (typeof this.td[2].div[2] !== 'undefined') {
                            if (typeof this.td[2].div[2].em !== 'undefined') {
                                if (typeof this.td[2].div[2].em.strong !== 'undefined')
                                    $stopDeparture.text(this.td[2].div[2].em.strong);
                                else
                                    $stopDeparture.text(this.td[2].div[2].em);
                            }
                            else if (typeof this.td[2].div[2].i !== 'undefined') {
                                $stopDeparture.text(this.td[2].div[2].i);
                            }
                        }
                        else if (typeof this.td[2].div !== 'undefined') {
                            $stopDeparture.text(this.td[2].div.p);
                        }

                        if (typeof this.td[3].div !== 'undefined') {
                            $stopTrack.text(this.td[3].div.p);
                        }

                        $('#stopsOnRoute').append($newElement);
                        if (!displayedHeader) {
                            $('#stopsOnRoute .stopOnRouteHeader').toggle();
                            displayedHeader = true;
                        }
                        $newElement.fadeIn('slow');
                        callback();
                    }
                    catch (ex) {
                        var logger = new Logger();
                        logger.dump({ message: "Error when showing detailed train info", error: ex, source: this });
                    }
                });
            });
    }
}

$('#trainPage').bind('pageshow', function() {
    (new TrainPage()).load();
});