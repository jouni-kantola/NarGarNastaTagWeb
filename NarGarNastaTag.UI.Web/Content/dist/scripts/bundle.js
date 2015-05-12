/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "Content/dist";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../declarations/jquery.d.ts" />
	/// <reference path="../Commuter.ts" />
	var CommuterController = __webpack_require__(8);
	var homePage = __webpack_require__(2);
	var favoritesPage = __webpack_require__(3);
	//var routesPage = require('./RoutesPage');
	var trainPage = __webpack_require__(4);
	var Loader;
	(function (Loader) {
	    $(document).bind('pageinit', function () {
	        $('.nt-version').text('v1.22');
	        $('.copyright').text('\u00a9 Jouni Kantola 2012');
	    });
	    (new homePage()).load();
	})(Loader || (Loader = {}));
	//# sourceMappingURL=Loader.js.map

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="declarations/javascript.global.functions.d.ts" />
	var Commuter;
	(function (Commuter) {
	    var Common;
	    (function (Common) {
	        var UrlHelper = (function () {
	            function UrlHelper() {
	            }
	            UrlHelper.getQueryStringParameterByName = function (url, name) {
	                var match = RegExp('[?&]' + name + '=([^&]*)').exec(url);
	                return match && match[1].replace(/\+/g, ' ');
	            };
	            return UrlHelper;
	        })();
	        Common.UrlHelper = UrlHelper;
	    })(Common = Commuter.Common || (Commuter.Common = {}));
	})(Commuter || (Commuter = {}));
	//# sourceMappingURL=UrlHelper.js.map

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../declarations/jquery.d.ts" />
	/// <reference path="../Commuter.ts" />
	/// <reference path="../UrlHelper.ts" />
	/// <reference path="../Logger.ts" />
	var commuterController = __webpack_require__(8);
	var Interfaces = __webpack_require__(5);
	var Commuter;
	(function (Commuter) {
	    var UI;
	    (function (UI) {
	        var HomePage;
	        (function (HomePage) {
	            function load() {
	                getFavouriteRoutes();
	                $('.switchOrder').on('tap', function (event) {
	                    event.preventDefault();
	                    switchRoute(this);
	                });
	            }
	            HomePage.load = load;
	            function getFavouriteRoutes() {
	                var routes = commuterController.getRoutes();
	                var $templateElement = $("#favouriteRouteItemTemplate").clone();
	                $('#favouriteRoutes').html('').append($templateElement);
	                $.each(routes, function () {
	                    var $newElement = $templateElement.clone();
	                    var $routeLink = $newElement.find('.routes');
	                    var href = $routeLink.prop('href');
	                    $routeLink.prop('href', href.replace('fromId', this.from.id).replace('toId', this.to.id).replace('http://' + window.location.host, ''));
	                    var $fromTag = $newElement.find('.from');
	                    $fromTag.text(this.from.name);
	                    var $toTag = $newElement.find('.to');
	                    $toTag.text(this.to.name);
	                    $newElement.appendTo($('#favouriteRoutes')).fadeIn('slow');
	                });
	            }
	            function switchRoute(sender) {
	                var $parent = $(sender).parent();
	                var $from = $parent.find('span.from');
	                var fromText = $from.text();
	                var $to = $parent.find('span.to');
	                var toText = $to.text();
	                $from.text(toText);
	                $to.text(fromText);
	                var $routes = $parent.find('a.routes');
	                var url = decodeURIComponent($routes.prop('href'));
	                var match = RegExp('from\\/[\\d\\,\\wåäöÅÄÖ]+').exec(url);
	                var fromId = match && match[0].replace('from/', '');
	                match = RegExp('to\\/[\\d\\,\\wåäöÅÄÖ]+').exec(url);
	                var toId = match && match[0].replace('to/', '');
	                $routes.prop('href', url.replace('from/' + fromId, 'from/' + toId).replace('to/' + toId, 'to/' + fromId).replace('http://' + window.location.host, ''));
	            }
	        })(HomePage = UI.HomePage || (UI.HomePage = {}));
	    })(UI = Commuter.UI || (Commuter.UI = {}));
	})(Commuter || (Commuter = {}));
	//# sourceMappingURL=HomePage.js.map

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../declarations/jquery.d.ts" />
	/// <reference path="../declarations/jquery.mobile.d.ts" />
	/// <reference path="../Commuter.ts" />
	/// <reference path="../Logger.ts" />
	var commuterController = __webpack_require__(8);
	var Route = __webpack_require__(7);
	var Logger = __webpack_require__(9);
	var Commuter;
	(function (Commuter) {
	    var UI;
	    (function (UI) {
	        var route;
	        var FavoritesPage;
	        (function (FavoritesPage) {
	            var stations = [];
	            function load() {
	                showFavourites();
	                route = new Route();
	            }
	            FavoritesPage.load = load;
	            function showFavourites() {
	                var $favouriteTemplateTag = $('#favouriteItemTemplate').clone();
	                var $favouritesTag = $('#favourites');
	                $favouritesTag.html('').append($favouriteTemplateTag);
	                $.each(commuterController.getRoutes(), function () {
	                    var $newFavourite = $favouriteTemplateTag.clone();
	                    $newFavourite.prop('id', this.routeId).prop('fromStationCode', this.from.id).on('tap', function (event) {
	                        event.preventDefault();
	                        commuterController.remove($(this).prop('fromStationCode'), $(this).prop('id'), showFavourites);
	                    });
	                    $newFavourite.find('.ui-btn-text').text(this.from.name + ' – ' + this.to.name);
	                    $newFavourite.appendTo($favouritesTag).show();
	                });
	            }
	            function getStations() {
	                if (stations.length > 0)
	                    return;
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
	                    }
	                    catch (ex) {
	                        var logger = new Logger();
	                        logger.log("No access established to Trafikverket.", ex);
	                    }
	                });
	            }
	            function loading() {
	                getStations();
	                $('#saveRouteButton').on('tap', function (event) {
	                    event.preventDefault();
	                    saveRoute();
	                });
	                $('.searchStations').on('input', function () {
	                    var $searchBox = $(this);
	                    var $stationList = $searchBox.closest('.searchFields').find('.stations');
	                    delay(function () {
	                        $stationList.html('');
	                        var searchText = $searchBox.val().toUpperCase();
	                        if (searchText.length < 2) {
	                            $stationList.hide();
	                            return;
	                        }
	                        ;
	                        var items = [];
	                        $.each(stations, function () {
	                            if (this.Name.toUpperCase().indexOf(searchText) === 0) {
	                                var stationSelector = getStationSelector(this.Id, this.Name);
	                                items.push(stationSelector);
	                            }
	                        });
	                        if (items.length > 0) {
	                            $stationList.append(items.join('')).listview('refresh').trigger('create');
	                            $stationList.find('.ui-icon-shadow').text('');
	                            $stationList.find(".ui-btn-inner").on('tap', function (event) {
	                                confirmSelection($(this));
	                                toggleSaveRouteButton();
	                            });
	                            $stationList.show();
	                        }
	                        else {
	                            $stationList.fadeOut('fast');
	                        }
	                    }, 300);
	                }).on('keyup', function (event) {
	                    if (event.which !== 13)
	                        return;
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
	                    $stationList.fadeOut('slow').html('');
	                });
	            }
	            FavoritesPage.loading = loading;
	            var delay = (function () {
	                var timer = 0;
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
	                $stationList.fadeOut('slow').html('');
	            }
	            function setRoute($container, stationName, stationId) {
	                if ($container.hasClass('fromStation')) {
	                    route.from.name = stationName;
	                    route.from.id = stationId;
	                }
	                else {
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
	                }
	                else {
	                    commuterController.add(route.from.name, route.from.id, route.to.name, route.to.id, showFavourites);
	                }
	                route = new Route();
	                $('.searchStations').val('');
	                $('#saveRouteButton').hide();
	            }
	        })(FavoritesPage = UI.FavoritesPage || (UI.FavoritesPage = {}));
	    })(UI = Commuter.UI || (Commuter.UI = {}));
	})(Commuter || (Commuter = {}));
	//# sourceMappingURL=FavoritesPage.js.map

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../declarations/jquery.d.ts" />
	/// <reference path="../commuter.ts" />
	/// <reference path="../UrlHelper.ts" />
	/// <reference path="../Logger.ts" />
	var commuterController = __webpack_require__(8);
	var UrlHelper = __webpack_require__(1);
	var Logger = __webpack_require__(9);
	var Commuter;
	(function (Commuter) {
	    var UI;
	    (function (UI) {
	        var TrainPage;
	        (function (TrainPage) {
	            function load() {
	                $.mobile.loading('show', {
	                    text: 'Laddar hållplatser...',
	                    textVisible: false,
	                    theme: 'a',
	                    html: ""
	                });
	                getStops(function () {
	                    $.mobile.loading('hide');
	                });
	            }
	            TrainPage.load = load;
	            function getStops(callback) {
	                var routeInfo = UrlHelper.getQueryStringParameterByName(window.location.href, 'route');
	                var date = routeInfo.split(',')[0];
	                var trainNo = routeInfo.split(',')[1];
	                var numberOfStations = -1;
	                var server = commuterController.idGenerator.getRandomRangedInteger(5, 6);
	                commuterController.queryRemote('http://www' + server.toString() + '.trafikverket.se/Trafikinformation/WebPage/TrafficSituationTrain.aspx?train=' + date + ',' + trainNo, '//table[@id="Trafficsituationtraincomponent_TrafficSituationDataGrid"]/tr', function (context) {
	                    if (!context.data.query.results)
	                        return;
	                    if (!context.data.query.results.tr)
	                        return;
	                    context.data.query.results.tr.shift();
	                    var displayedHeader = false;
	                    $.each(context.data.query.results.tr, function () {
	                        var $newElement = $("#stopOnRouteItemTemplate").clone();
	                        $newElement.prop('id', commuterController.idGenerator.getId());
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
	        })(TrainPage = UI.TrainPage || (UI.TrainPage = {}));
	    })(UI = Commuter.UI || (Commuter.UI = {}));
	})(Commuter || (Commuter = {}));
	//# sourceMappingURL=TrainPage.js.map

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	//# sourceMappingURL=Interfaces.js.map

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="declarations/jquery.d.ts" />
	/// <reference path="declarations/javascript.global.functions.d.ts" />
	/// <reference path="Interfaces.ts" />
	/// <reference path="CookieStore.ts" />
	/// <reference path="CookieStoreConfiguration.ts" />
	/// <reference path="RouteToJsonParser.ts" />
	/// <reference path="IdRandomizer.ts" />
	/// <reference path="StationRoutes.ts" />
	/// <reference path="RouteCollection.ts" />
	/// <reference path="YqlQueryExecutor.ts" />
	/// <reference path="Logger.ts" />
	var IdRandomizer = __webpack_require__(11);
	var RouteToJsonParser = __webpack_require__(12);
	var CookieStoreConfiguration = __webpack_require__(13);
	var CookieStore = __webpack_require__(10);
	var RouteCollection = __webpack_require__(14);
	var YqlQueryExecutor = __webpack_require__(15);
	var Commuter;
	(function (Commuter) {
	    var Common;
	    (function (Common) {
	        var IoC = (function () {
	            function IoC() {
	            }
	            IoC.register = function (interfaceType, type) {
	                if (!IoC.container)
	                    IoC.container = [];
	                IoC.container.push({ _interfaceType: interfaceType, _type: type });
	                return type;
	            };
	            IoC.resolve = function (interfaceType) {
	                for (var i = 0; i < IoC.container.length; i++) {
	                    if (IoC.container[i]._interfaceType === interfaceType)
	                        return IoC.container[i]._type;
	                }
	                throw new Error(interfaceType + ' is not registred.');
	            };
	            IoC.setup = function () {
	                var idGenerator = IoC.register("IGenerateId", new Common.IdRandomizer());
	                var parser = IoC.register("IParseRoutes", new RouteToJsonParser(JSON));
	                //var routes: Entities.StationRoutes[] = IoC.register("IStationRoutes", new Entities.StationRoutes[]);
	                var routes = IoC.register("IStationRoutes", []);
	                var configuration = IoC.register("IConfigureCookieStore", new CookieStoreConfiguration('NT_FAVOURITE_ROUTES', 365, parser));
	                var repository = IoC.register("IRouteRepository", new CookieStore(configuration, parser));
	                var routeCollection = IoC.register("IKnowFavouriteRoutes", new RouteCollection(repository, routes));
	                var remoteQueryExecutor = IoC.register("IQueryRemoteRoutes", new YqlQueryExecutor());
	            };
	            return IoC;
	        })();
	        Common.IoC = IoC;
	    })(Common = Commuter.Common || (Commuter.Common = {}));
	})(Commuter || (Commuter = {}));
	//# sourceMappingURL=IoC.js.map

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="interfaces.ts" />
	var Commuter;
	(function (Commuter) {
	    var Entities;
	    (function (Entities) {
	        var Route = (function () {
	            function Route() {
	                this.from = { name: '', id: '' };
	                this.to = { name: '', id: '' };
	            }
	            return Route;
	        })();
	        Entities.Route = Route;
	    })(Entities = Commuter.Entities || (Commuter.Entities = {}));
	})(Commuter || (Commuter = {}));
	//# sourceMappingURL=Route.js.map

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="declarations/jquery.d.ts" />
	/// <reference path="declarations/javascript.global.functions.d.ts" />
	/// <reference path="Interfaces.ts" />
	/// <reference path="IoC.ts" />
	/// <reference path="Route.ts" />
	/// <reference path="Logger.ts" />
	var Interfaces = __webpack_require__(5);
	var IoC = __webpack_require__(6);
	var Route = __webpack_require__(7);
	var Commuter;
	(function (Commuter) {
	    var Common;
	    (function (Common) {
	        var CommuterController = (function () {
	            function CommuterController() {
	                Common.IoC.setup();
	                this.repository = Common.IoC.resolve("IRouteRepository");
	                this.idGenerator = Common.IoC.resolve("IGenerateId");
	                this.routeHandler = Common.IoC.resolve("IKnowFavouriteRoutes");
	                this.remoteQueryExecutor = Common.IoC.resolve("IQueryRemoteRoutes");
	                this.apiUrl = window['apiUrl'];
	            }
	            CommuterController.prototype.add = function (fromName, fromId, toName, toId, callback) {
	                var route = new Route();
	                route.routeId = this.idGenerator.getId();
	                route.from.id = fromId.toUpperCase();
	                route.from.name = fromName;
	                route.to.id = toId.toUpperCase();
	                route.to.name = toName;
	                route.to.id = toId;
	                var that = this;
	                this.routeHandler.add(route, function () {
	                    that.repository.saveAll(that.routeHandler.favouriteRoutes);
	                    callback && callback();
	                });
	            };
	            CommuterController.prototype.remove = function (fromId, routeId, callback) {
	                var that = this;
	                this.routeHandler.remove(routeId, fromId, function () {
	                    that.repository.saveAll(that.routeHandler.favouriteRoutes);
	                    callback && callback();
	                });
	            };
	            CommuterController.prototype.getRoutes = function () {
	                var routes = [];
	                this.routeHandler.cache(this.repository.readAll());
	                if (!this.routeHandler.favouriteRoutes || this.routeHandler.favouriteRoutes.length === 0)
	                    return routes;
	                try {
	                    this.routeHandler.favouriteRoutes.forEach(function (route) {
	                        route.to.forEach(function (toStation) {
	                            var displayRoute = new Route();
	                            displayRoute.routeId = toStation.routeId;
	                            displayRoute.to.id = toStation.id;
	                            displayRoute.to.name = toStation.name;
	                            displayRoute.from.id = route.from.id;
	                            displayRoute.from.name = route.from.name;
	                            routes.push(displayRoute);
	                        });
	                    });
	                }
	                catch (ex) {
	                    this.repository.remove();
	                }
	                return routes;
	            };
	            CommuterController.prototype.queryRemote = function (url, xpath, callback) {
	                if (!url || !xpath)
	                    return;
	                this.remoteQueryExecutor.query($, url, xpath, function (data) {
	                    var context = { data: data, url: url, xpath: xpath };
	                    callback && callback(context);
	                });
	            };
	            CommuterController.prototype.scrapeStations = function (callback) {
	                this.doAjax(this.apiUrl + '/query/stations', function (data) {
	                    var context = { data: data };
	                    callback && callback(context);
	                });
	            };
	            CommuterController.prototype.scrapeStationRoutes = function (stationId, callback) {
	                this.doAjax(this.apiUrl + '/query/station/' + stationId, function (data) {
	                    var context = { data: data };
	                    callback && callback(context);
	                });
	            };
	            CommuterController.prototype.doAjax = function (url, callback) {
	                $.support.cors = true;
	                $.ajax({
	                    url: url,
	                    type: "GET",
	                    dataType: "json",
	                    cache: false,
	                    success: function (data) {
	                        callback(data);
	                    }
	                });
	            };
	            return CommuterController;
	        })();
	        Common.CommuterController = CommuterController;
	    })(Common = Commuter.Common || (Commuter.Common = {}));
	})(Commuter || (Commuter = {}));
	//# sourceMappingURL=Commuter.js.map

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="declarations/javascript.global.functions.d.ts" />
	var Commuter;
	(function (Commuter) {
	    var Common;
	    (function (Common) {
	        var Logger = (function () {
	            function Logger() {
	            }
	            Logger.prototype.log = function (errorText, exception) {
	                if (window.console && console.log)
	                    console.log({ clearText: errorText, error: exception });
	            };
	            Logger.prototype.inform = function (message) {
	                if (window.console && console.log)
	                    console.log({ clearText: message });
	            };
	            Logger.prototype.dump = function (anyObject) {
	                if (window.console && console.log)
	                    console.log(anyObject);
	            };
	            return Logger;
	        })();
	        Common.Logger = Logger;
	    })(Common = Commuter.Common || (Commuter.Common = {}));
	})(Commuter || (Commuter = {}));
	//# sourceMappingURL=Logger.js.map

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="declarations/javascript.global.functions.d.ts" />
	/// <reference path="declarations/jquery.d.ts" />
	/// <reference path="Interfaces.ts" />
	var Commuter;
	(function (Commuter) {
	    var Command;
	    (function (Command) {
	        var CookieStore = (function () {
	            function CookieStore(configuration, parser) {
	                this.configuration = configuration;
	                this.parser = parser;
	            }
	            CookieStore.prototype.saveAll = function (routes) {
	                var cookieText = this.parser.serialize(routes);
	                var expiryDate = new Date();
	                expiryDate.setDate(expiryDate.getDate() + this.configuration.expiryInDays);
	                var formattedValue = escape(cookieText) + ((this.configuration.expiryInDays === null) ? '' : '; expires=' + expiryDate.toUTCString());
	                document.cookie = this.configuration.cookieName + "=" + formattedValue;
	            };
	            CookieStore.prototype.readAll = function () {
	                var browserCookies = document.cookie.split(';');
	                for (var i = 0; i < browserCookies.length; i++) {
	                    var x = browserCookies[i].substr(0, browserCookies[i].indexOf('='));
	                    var y = browserCookies[i].substr(browserCookies[i].indexOf('=') + 1);
	                    x = x.replace(/^\s+|\s+$/g, '');
	                    if (x === this.configuration.cookieName) {
	                        var cookie = unescape(y);
	                        if (cookie)
	                            return this.parser.deserialize(cookie);
	                        else
	                            return undefined;
	                    }
	                }
	            };
	            CookieStore.prototype.remove = function () {
	                var expiryDate = new Date();
	                expiryDate.setDate(expiryDate.getDate() - 1);
	                var formattedValue = '; expires=' + expiryDate.toUTCString();
	                document.cookie = this.configuration.cookieName + "=" + formattedValue;
	            };
	            return CookieStore;
	        })();
	        Command.CookieStore = CookieStore;
	    })(Command = Commuter.Command || (Commuter.Command = {}));
	})(Commuter || (Commuter = {}));
	//# sourceMappingURL=CookieStore.js.map

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="Interfaces.ts" />
	var Commuter;
	(function (Commuter) {
	    var Common;
	    (function (Common) {
	        var IdRandomizer = (function () {
	            function IdRandomizer() {
	            }
	            IdRandomizer.prototype.getId = function () {
	                var partOne = new Date().getTime();
	                var partTwo = 1 + Math.floor((Math.random() * 32767));
	                var partThree = 1 + Math.floor((Math.random() * 32767));
	                return partOne + '-' + partTwo + '-' + partThree;
	            };
	            IdRandomizer.prototype.getRandomRangedInteger = function (minimum, maximum) {
	                return Math.floor(Math.random() * (1 + maximum - minimum)) + minimum;
	            };
	            return IdRandomizer;
	        })();
	        Common.IdRandomizer = IdRandomizer;
	    })(Common = Commuter.Common || (Commuter.Common = {}));
	})(Commuter || (Commuter = {}));
	//# sourceMappingURL=IdRandomizer.js.map

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="declarations/javascript.global.functions.d.ts" />
	/// <reference path="declarations/jquery.d.ts" />
	/// <reference path="Interfaces.ts" />
	/// <reference path="Logger.ts" />
	var Logger = __webpack_require__(9);
	var Commuter;
	(function (Commuter) {
	    var Command;
	    (function (Command) {
	        var RouteToJsonParser = (function () {
	            function RouteToJsonParser(parser) {
	                this.parser = parser;
	            }
	            RouteToJsonParser.prototype.serialize = function (routes) {
	                if (routes)
	                    return this.parser.stringify(routes);
	                return '';
	            };
	            RouteToJsonParser.prototype.deserialize = function (stringifiedRoutes) {
	                try {
	                    var routes = JSON.parse(stringifiedRoutes);
	                    return routes;
	                }
	                catch (ex) {
	                    var log = new Logger();
	                    log.log('Cannot deserialize routes.', ex);
	                }
	            };
	            return RouteToJsonParser;
	        })();
	        Command.RouteToJsonParser = RouteToJsonParser;
	    })(Command = Commuter.Command || (Commuter.Command = {}));
	})(Commuter || (Commuter = {}));
	//# sourceMappingURL=RouteToJsonParser.js.map

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="declarations/javascript.global.functions.d.ts" />
	/// <reference path="declarations/jquery.d.ts" />
	/// <reference path="Interfaces.ts" />
	var Commuter;
	(function (Commuter) {
	    var Command;
	    (function (Command) {
	        var CookieStoreConfiguration = (function () {
	            function CookieStoreConfiguration(cookieName, expiryInDays, mapper) {
	                this.cookieName = cookieName;
	                this.expiryInDays = expiryInDays;
	                this.mapper = mapper;
	            }
	            return CookieStoreConfiguration;
	        })();
	        Command.CookieStoreConfiguration = CookieStoreConfiguration;
	    })(Command = Commuter.Command || (Commuter.Command = {}));
	})(Commuter || (Commuter = {}));
	//# sourceMappingURL=CookieStoreConfiguration.js.map

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="Interfaces.ts" />
	/// <reference path="StationRoutes.ts" />
	var StationRoutes = __webpack_require__(16);
	var Commuter;
	(function (Commuter) {
	    var Entities;
	    (function (Entities) {
	        var RouteCollection = (function () {
	            function RouteCollection(repository, favouriteRoutes) {
	                this.repository = repository;
	                this.favouriteRoutes = favouriteRoutes;
	            }
	            RouteCollection.prototype.cache = function (routes) {
	                this.favouriteRoutes = routes;
	            };
	            RouteCollection.prototype.add = function (route, callback) {
	                var fromStationCode = route.from.id.toUpperCase();
	                var toStationCode = route.to.id.toUpperCase();
	                var containsFromStation;
	                var fromStationIndex;
	                var needsUpdate;
	                if (this.favouriteRoutes) {
	                    for (var i = this.favouriteRoutes.length - 1; i >= 0; i--) {
	                        if (this.favouriteRoutes[i].from.id.toUpperCase() === fromStationCode) {
	                            containsFromStation = true;
	                            fromStationIndex = i;
	                            break;
	                        }
	                    }
	                }
	                if (!containsFromStation) {
	                    var newRoute = new Entities.StationRoutes();
	                    newRoute.from.name = route.from.name;
	                    newRoute.from.id = route.from.id;
	                    newRoute.to[0].routeId = route.routeId;
	                    newRoute.to[0].name = route.to.name;
	                    newRoute.to[0].id = toStationCode;
	                    if (!this.favouriteRoutes)
	                        this.favouriteRoutes = [];
	                    this.favouriteRoutes.push(newRoute);
	                    needsUpdate = true;
	                }
	                else {
	                    for (var i = this.favouriteRoutes[fromStationIndex].to.length - 1; i >= 0; i--) {
	                        var oldToStationCode = this.favouriteRoutes[fromStationIndex].to[i].id.toUpperCase();
	                        if (oldToStationCode === toStationCode)
	                            return;
	                    }
	                    ;
	                    var toStation = { routeId: route.routeId, name: route.to.name, id: toStationCode };
	                    this.favouriteRoutes[fromStationIndex].to.push(toStation);
	                    needsUpdate = true;
	                }
	                if (callback && needsUpdate)
	                    callback();
	            };
	            RouteCollection.prototype.remove = function (routeId, stationId, callback) {
	                var fromStationCode = stationId.toUpperCase();
	                for (var i = 0, j = this.favouriteRoutes.length; i < j; i++) {
	                    if (this.favouriteRoutes[i].from.id.toUpperCase() === fromStationCode) {
	                        for (var k = 0, l = this.favouriteRoutes[i].to.length; k < l; k++) {
	                            if (this.favouriteRoutes[i].to[k].routeId === routeId) {
	                                this.favouriteRoutes[i].to.splice(k, 1);
	                                if (this.favouriteRoutes[i].to.length === 0)
	                                    this.favouriteRoutes.splice(i, 1);
	                                if (callback)
	                                    callback();
	                                else
	                                    return;
	                            }
	                        }
	                        ;
	                    }
	                }
	                ;
	            };
	            return RouteCollection;
	        })();
	        Entities.RouteCollection = RouteCollection;
	    })(Entities = Commuter.Entities || (Commuter.Entities = {}));
	})(Commuter || (Commuter = {}));
	//# sourceMappingURL=RouteCollection.js.map

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="Interfaces.ts" />
	var Commuter;
	(function (Commuter) {
	    var Query;
	    (function (Query) {
	        var YqlQueryExecutor = (function () {
	            function YqlQueryExecutor() {
	            }
	            YqlQueryExecutor.prototype.query = function (xmlHttpRequestExecutor, url, xpath, callback) {
	                if (!url || !xpath)
	                    throw 'URL and XPATH must be set for YQL query';
	                if (!xmlHttpRequestExecutor.hasOwnProperty('getJSON'))
	                    throw 'getJSON is expected for remote query';
	                var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent("select * from html where url='" + url + "' and xpath='" + xpath) + "'&format=json&callback=?";
	                xmlHttpRequestExecutor.getJSON(yql, function (result) {
	                    callback && callback(result);
	                });
	            };
	            return YqlQueryExecutor;
	        })();
	        Query.YqlQueryExecutor = YqlQueryExecutor;
	    })(Query = Commuter.Query || (Commuter.Query = {}));
	})(Commuter || (Commuter = {}));
	//# sourceMappingURL=YqlQueryExecutor.js.map

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="Interfaces.ts" />
	var Commuter;
	(function (Commuter) {
	    var Entities;
	    (function (Entities) {
	        var StationRoutes = (function () {
	            function StationRoutes() {
	                this.from = { name: '', id: '' };
	                this.to = new Array();
	                this.to.push({ routeId: '', name: '', id: '' });
	            }
	            return StationRoutes;
	        })();
	        Entities.StationRoutes = StationRoutes;
	    })(Entities = Commuter.Entities || (Commuter.Entities = {}));
	})(Commuter || (Commuter = {}));
	//# sourceMappingURL=StationRoutes.js.map

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map