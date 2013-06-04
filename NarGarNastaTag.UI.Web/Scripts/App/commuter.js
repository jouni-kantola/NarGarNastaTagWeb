var Commuter;
(function (Commuter) {
    (function (Trains) {
        (function () {
            Trains.Common.IoC.setup();
        })();
        var CommuterController = (function () {
            function CommuterController() {
                this.repository = Trains.Common.IoC.resolve("IRouteRepository");
                this.idGenerator = Trains.Common.IoC.resolve("IGenerateId");
                this.routeHandler = Trains.Common.IoC.resolve("IKnowFavouriteRoutes");
                this.remoteQueryExecutor = Trains.Common.IoC.resolve("IQueryRemoteRoutes");
                this.apiUrl = window['apiUrl'];
            }
            CommuterController.prototype.add = function (fromName, fromId, toName, toId, callback) {
                var route = new Trains.Entities.Route();
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
                if(!this.routeHandler.favouriteRoutes || this.routeHandler.favouriteRoutes.length === 0) {
                    return routes;
                }
                try  {
                    this.routeHandler.favouriteRoutes.forEach(function (route) {
                        route.to.forEach(function (toStation) {
                            var displayRoute = new Trains.Entities.Route();
                            displayRoute.routeId = toStation.routeId;
                            displayRoute.to.id = toStation.id;
                            displayRoute.to.name = toStation.name;
                            displayRoute.from.id = route.from.id;
                            displayRoute.from.name = route.from.name;
                            routes.push(displayRoute);
                        });
                    });
                } catch (ex) {
                    this.repository.remove();
                }
                return routes;
            };
            CommuterController.prototype.queryRemote = function (url, xpath, callback) {
                if(!url || !xpath) {
                    return;
                }
                this.remoteQueryExecutor.query($, url, xpath, function (data) {
                    var context = {
                        data: data,
                        url: url,
                        xpath: xpath
                    };
                    callback && callback(context);
                });
            };
            CommuterController.prototype.scrapeStations = function (callback) {
                $.get(this.apiUrl + '/query/stations', function (data) {
                    var context = {
                        data: data
                    };
                    callback && callback(context);
                });
            };
            CommuterController.prototype.scrapeStationRoutes = function (stationId, callback) {
                $.get(this.apiUrl + '/query/station/' + stationId, function (data) {
                    var context = {
                        data: data
                    };
                    callback && callback(context);
                });
            };
            return CommuterController;
        })();
        Trains.CommuterController = CommuterController;        
    })(Commuter.Trains || (Commuter.Trains = {}));
    var Trains = Commuter.Trains;
})(Commuter || (Commuter = {}));
//@ sourceMappingURL=commuter.js.map
