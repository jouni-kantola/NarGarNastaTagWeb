/// <reference path="../declarations/jquery.d.ts" />
/// <reference path="../declarations/jquery.mobile.d.ts" />
/// <reference path="../Commuter.ts" />
/// <reference path="../Logger.ts" />

var commuterController = require('../Commuter');
var Route = require('../Route');
var Logger = require('../Logger');

module Commuter.UI {

    var route: Interfaces.IRoute;    
    export module FavoritesPage {

        var stations = [];

        export function load() {
            showFavourites();
            route = new Route();
        }

        function showFavourites() {
            var $favouriteTemplateTag = $('#favouriteItemTemplate').clone();
            var $favouritesTag = $('#favourites');
            $favouritesTag
                .html('')
                .append($favouriteTemplateTag);
            $.each(commuterController.getRoutes(), function () {
                var $newFavourite = $favouriteTemplateTag.clone();
                $newFavourite
                    .prop('id', this.routeId)
                    .prop('fromStationCode', this.from.id)
                    .on('tap', function (event) {
                        event.preventDefault();
                        commuterController.remove($(this).prop('fromStationCode'), $(this).prop('id'), showFavourites);
                    });
                $newFavourite.find('.ui-btn-text').text(this.from.name + ' – ' + this.to.name);
                $newFavourite
                    .appendTo($favouritesTag)
                    .show();
            });
        }

        function getStations() {
            if (stations.length > 0) return;
            commuterController.scrapeStations(function (context) {
                try {
                    $.each(context.data, function () {
                        if (this && !stations) {
                            stations = [];
                            stations.push(this);
                        }
                        else if (this)
                            stations.push(this);
                    });
                } catch (ex) {
                    var logger = new Logger();
                    logger.log("No access established to Trafikverket.", ex);
                }
            });
        }

        export function loading() {
            getStations();
            $('#saveRouteButton').on('tap', function (event) {
                event.preventDefault();
                saveRoute();
            });
            $('.searchStations').on('input', function () {
                var $searchBox = $(this);
                var $stationList = $searchBox.closest('.searchFields').find('.stations');
                delay(() => {
                    $stationList.html('');
                    var searchText = $searchBox.val().toUpperCase();
                    if (searchText.length < 2) {
                        $stationList.hide();
                        return;
                    };
                    var items = [];
                    $.each(stations, function () {
                        if (this.Name.toUpperCase().indexOf(searchText) === 0) {
                            var stationSelector = getStationSelector(this.Id, this.Name);
                            items.push(stationSelector);
                        }
                    });
                    if (items.length > 0) {
                        $stationList
                            .append(items.join(''))
                            .listview('refresh')
                            .trigger('create');
                        $stationList
                            .find('.ui-icon-shadow').text('');
                        $stationList
                            .find(".ui-btn-inner").on('tap', function (event) {
                                confirmSelection($(this));
                                toggleSaveRouteButton();
                            });
                        $stationList
                            .show();
                    } else {
                        $stationList.fadeOut('fast');
                    }
                }, 300)
            }).on('keyup', function (event) {
                if (event.which !== 13) return;
                var $searchBox = $(this);
                var $stationList = $searchBox.closest('.searchFields').find('.stations');
                if ($stationList.children().length > 0) {
                    var stationName = $($stationList.find('label')[0]).text();
                    var stationId = $($stationList.find("input[type='checkbox']")).prop('name');
                    var $container = $searchBox.closest('.searchFields');
                    $container.find('.searchStations').val(stationName);
                    setRoute($container, stationName, stationId);
                    toggleSaveRouteButton();
                }
                $stationList
                    .fadeOut('slow')
                    .html('');
            });
        }

        var delay = (function(){
           var timer: number = 0;
            return function (callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        })();

        function getStationSelector(value, text) {
            var id = commuterController.idGenerator.getId();
            return '<li><input id="' + id + '" type="checkbox" name="' + value + '"/><label for="' + id + '">' + text + '</label></li>';
        }

        function confirmSelection(sender) {
            var $parent = $(sender).closest('div');
            var stationName = $parent.find('label').text();
            var stationId = $parent.find("input[type='checkbox']").prop('name');
            var $container = $parent.closest('.searchFields');
            $container.find('.searchStations').val(stationName);
            setRoute($container, stationName, stationId);
            var $stationList = $parent.closest('.stations');
            $stationList
                .fadeOut('slow')
                .html('');
        }

        function setRoute($container: JQuery, stationName: string, stationId: string) {
            if ($container.hasClass('fromStation')) {
                route.from.name = stationName;
                route.from.id = stationId;
            } else {
                route.to.name = stationName;
                route.to.id = stationId;
            }
        }

        function toggleSaveRouteButton() {
            if (route.from.id && route.to.id)
                $('#saveRouteButton').show();
        }
        function saveRoute() {
            if (route.from.id === route.to.id) {
                $('#cannotSaveEqualToAndFromRoute').popup('open');
            } else {
                commuterController.add(route.from.name, route.from.id, route.to.name, route.to.id, showFavourites);
            }
            route = new Route();
            $('.searchStations').val('');
            $('#saveRouteButton').hide();
        }
    }
}