var Commuter;
(function (Commuter) {
    (function (Trains) {
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
                    if(this.favouriteRoutes) {
                        for(var i = this.favouriteRoutes.length - 1; i >= 0; i--) {
                            if(this.favouriteRoutes[i].from.id.toUpperCase() === fromStationCode) {
                                containsFromStation = true;
                                fromStationIndex = i;
                                break;
                            }
                        }
                    }
                    if(!containsFromStation) {
                        var newRoute = new Entities.StationRoutes();
                        newRoute.from.name = route.from.name;
                        newRoute.from.id = route.from.id;
                        newRoute.to[0].routeId = route.routeId;
                        newRoute.to[0].name = route.to.name;
                        newRoute.to[0].id = toStationCode;
                        if(!this.favouriteRoutes) {
                            this.favouriteRoutes = [];
                        }
                        this.favouriteRoutes.push(newRoute);
                        needsUpdate = true;
                    } else {
                        for(var i = this.favouriteRoutes[fromStationIndex].to.length - 1; i >= 0; i--) {
                            var oldToStationCode = this.favouriteRoutes[fromStationIndex].to[i].id.toUpperCase();
                            if(oldToStationCode === toStationCode) {
                                return;
                            }
                        }
                        ; ;
                        var toStation = {
                            routeId: route.routeId,
                            name: route.to.name,
                            id: toStationCode
                        };
                        this.favouriteRoutes[fromStationIndex].to.push(toStation);
                        needsUpdate = true;
                    }
                    if(callback && needsUpdate) {
                        callback();
                    }
                };
                RouteCollection.prototype.remove = function (routeId, stationId, callback) {
                    var fromStationCode = stationId.toUpperCase();
                    for(var i = 0, j = this.favouriteRoutes.length; i < j; i++) {
                        if(this.favouriteRoutes[i].from.id.toUpperCase() === fromStationCode) {
                            for(var k = 0, l = this.favouriteRoutes[i].to.length; k < l; k++) {
                                if(this.favouriteRoutes[i].to[k].routeId === routeId) {
                                    this.favouriteRoutes[i].to.splice(k, 1);
                                    if(this.favouriteRoutes[i].to.length === 0) {
                                        this.favouriteRoutes.splice(i, 1);
                                    }
                                    if(callback) {
                                        callback();
                                    } else {
                                        return;
                                    }
                                }
                            }
                            ; ;
                        }
                    }
                    ; ;
                };
                return RouteCollection;
            })();
            Entities.RouteCollection = RouteCollection;            
        })(Trains.Entities || (Trains.Entities = {}));
        var Entities = Trains.Entities;
    })(Commuter.Trains || (Commuter.Trains = {}));
    var Trains = Commuter.Trains;
})(Commuter || (Commuter = {}));
//@ sourceMappingURL=RouteCollection.js.map
