/// <reference path="../declarations/jquery.d.ts" />
/// <reference path="../declarations/jquery.mobile.d.ts" />
/// <reference path="../Interfaces.ts" />
/// <reference path="../Commuter.ts" />
/// <reference path="../Logger.ts" />

import CommuterController = require('../Commuter');
import Route = require('../Route');
import Logger = require('../Logger');

class FavoritesPage {
    private route: Interfaces.IRoute;
    private commuterController;
    private stations = [];

    constructor() {
        this.commuterController = new CommuterController();
        this.route = new Route();
    }

    load() {
        this.showFavourites();
    }

    showFavourites() {
        var that = this;
        var $favouriteTemplateTag = $('#favouriteItemTemplate').clone();
        var $favouritesTag = $('#favourites');
        $favouritesTag
            .html('')
            .append($favouriteTemplateTag);
        $.each(that.commuterController.getRoutes(), function() {
            var $newFavourite = $favouriteTemplateTag.clone();
            $newFavourite
                .prop('id', this.routeId)
                .prop('fromStationCode', this.from.id)
                .on('tap', function(event) {
                    event.preventDefault();
                    that.commuterController.remove($(this).prop('fromStationCode'), $(this).prop('id'), that.showFavourites);
                });
            $newFavourite.find('.ui-btn-text').text(this.from.name + ' – ' + this.to.name);
            $newFavourite
                .appendTo($favouritesTag)
                .show();
        });
    }

    getStations() {
        var that = this;
        if (this.stations.length > 0) return;
        this.commuterController.scrapeStations(function(context) {
            try {
                $.each(context.data, function() {
                    if (this && !that.stations) {
                        that.stations = [];
                        that.stations.push(this);
                    }
                    else if (this)
                        that.stations.push(this);
                });
            } catch (ex) {
                var logger = new Logger();
                logger.log("No access established to Trafikverket.", ex);
            }
        });
    }

    loading() {
        var that = this;
        this.getStations();
        $('#saveRouteButton').on('tap', function(event) {
            event.preventDefault();
            that.saveRoute();
        });
        $('.searchStations').on('input', function() {
            var delay = (function() {
                var timer: number = 0;
                return function(callback, ms) {
                    clearTimeout(timer);
                    timer = setTimeout(callback, ms);
                };
            })();

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
                $.each(that.stations, function() {
                    if (this.Name.toUpperCase().indexOf(searchText) === 0) {
                        var stationSelector = that.getStationSelector(this.Id, this.Name);
                        items.push(stationSelector);
                    }
                });
                if (items.length > 0) {
                    $stationList
                        .append(items.join(''))
                        .listview('refresh')
                        .trigger('create');that
                    $stationList
                        .find('.ui-icon-shadow').text('');
                    $stationList
                        .find(".ui-btn-inner").on('tap', function(event) {
                            that.confirmSelection($(this));
                            that.toggleSaveRouteButton();
                        });
                    $stationList
                        .show();
                } else {
                    $stationList.fadeOut('fast');
                }
            }, 300)
        }).on('keyup', function(event) {
            if (event.which !== 13) return;
            var $searchBox = $(this);
            var $stationList = $searchBox.closest('.searchFields').find('.stations');
            if ($stationList.children().length > 0) {
                var stationName = $($stationList.find('label')[0]).text();
                var stationId = $($stationList.find("input[type='checkbox']")).prop('name');
                var $container = $searchBox.closest('.searchFields');
                $container.find('.searchStations').val(stationName);
                that.setRoute($container, stationName, stationId);
                that.toggleSaveRouteButton();
            }
            $stationList
                .fadeOut('slow')
                .html('');
        });
    }

    getStationSelector(value, text) {
        var id = this.commuterController.idGenerator.getId();
        return '<li><input id="' + id + '" type="checkbox" name="' + value + '"/><label for="' + id + '">' + text + '</label></li>';
    }

    confirmSelection(sender) {
        var $parent = $(sender).closest('div');
        var stationName = $parent.find('label').text();
        var stationId = $parent.find("input[type='checkbox']").prop('name');
        var $container = $parent.closest('.searchFields');
        $container.find('.searchStations').val(stationName);
        this.setRoute($container, stationName, stationId);
        var $stationList = $parent.closest('.stations');
        $stationList
            .fadeOut('slow')
            .html('');
    }

    setRoute($container: JQuery, stationName: string, stationId: string) {
        if ($container.hasClass('fromStation')) {
            this.route.from.name = stationName;
            this.route.from.id = stationId;
        } else {
            this.route.to.name = stationName;
            this.route.to.id = stationId;
        }
    }

    toggleSaveRouteButton() {
        if (this.route.from.id && this.route.to.id)
            $('#saveRouteButton').show();
    }

    saveRoute() {
        if (this.route.from.id === this.route.to.id) {
            $('#cannotSaveEqualToAndFromRoute').popup('open');
        } else {
            this.commuterController.add(this.route.from.name, this.route.from.id, this.route.to.name, this.route.to.id, this.showFavourites);
        }
        this.route = new Route();
        $('.searchStations').val('');
        $('#saveRouteButton').hide();
    }
}

var favoritesPage = new FavoritesPage();
$('#favouritesPage').bind('pageinit', function() {
    favoritesPage.loading();
});

$('#favouritesPage').bind('pageshow', function() {
    favoritesPage.load();
});