/// <reference path="Interfaces.ts" />
/// <reference path="StationRoutes.ts" />

var StationRoutes = require('./StationRoutes');

class RouteCollection implements Interfaces.IKnowFavouriteRoutes {
    repository: Interfaces.IRouteRepository;
    favouriteRoutes: Interfaces.IStationRoutes[];
    constructor(repository: Interfaces.IRouteRepository, favouriteRoutes: Interfaces.IStationRoutes[]) {
        this.repository = repository;
        this.favouriteRoutes = favouriteRoutes;
    }
    cache(routes: Interfaces.IStationRoutes[]) {
        this.favouriteRoutes = routes;
    }
    add(route: Interfaces.IRoute, callback: Function) {
        var fromStationCode: string = route.from.id.toUpperCase();
        var toStationCode: string = route.to.id.toUpperCase();
        var containsFromStation;
        var fromStationIndex: number;
        var needsUpdate;
        if (this.favouriteRoutes) {
            for (var i: number = this.favouriteRoutes.length - 1; i >= 0; i--) {
                if (this.favouriteRoutes[i].from.id.toUpperCase() === fromStationCode) {
                    containsFromStation = true;
                    fromStationIndex = i;
                    break;
                }
            }
        }
        if (!containsFromStation) {
            var newRoute: Interfaces.IStationRoutes = new StationRoutes();
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
            for (var i: number = this.favouriteRoutes[fromStationIndex].to.length - 1; i >= 0; i--) {
                var oldToStationCode = this.favouriteRoutes[fromStationIndex].to[i].id.toUpperCase();
                if (oldToStationCode === toStationCode) return;
            };
            var toStation = { routeId: route.routeId, name: route.to.name, id: toStationCode };
            this.favouriteRoutes[fromStationIndex].to.push(toStation);
            needsUpdate = true;
        }
        if (callback && needsUpdate)
            callback();
    }

    remove(routeId: string, stationId: string, callback: Function) {
        var fromStationCode: string = stationId.toUpperCase();
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
                };
            }
        };
    }
}

export = RouteCollection;