/// <reference path="declarations/jquery.d.ts" />
/// <reference path="declarations/javascript.global.functions.d.ts" />
/// <reference path="interfaces.d.ts" />
/// <reference path="IoC.ts" />
/// <reference path="Route.ts" />
/// <reference path="Logger.ts" />

module Commuter.Trains {
    (function () {
        Common.IoC.setup();
    })();

    export class CommuterController {
        repository: Interfaces.IRouteRepository;
        idGenerator: Interfaces.IGenerateId;
        routeHandler: Interfaces.IKnowFavouriteRoutes;
        remoteQueryExecutor: Interfaces.IQueryRemoteRoutes;
        apiUrl: string;
        
        constructor() {
            this.repository = Common.IoC.resolve("IRouteRepository");
            this.idGenerator = Common.IoC.resolve("IGenerateId");
            this.routeHandler = Common.IoC.resolve("IKnowFavouriteRoutes");
            this.remoteQueryExecutor = Common.IoC.resolve("IQueryRemoteRoutes");
            this.apiUrl = window['apiUrl'];
        }

        add(fromName: string, fromId: string, toName: string, toId: string, callback: Function) {
            var route: Interfaces.IRoute = new Entities.Route();
            route.routeId = this.idGenerator.getId();
            route.from.id = fromId.toUpperCase();
            route.from.name = fromName;
            route.to.id = toId.toUpperCase();
            route.to.name = toName;
            route.to.id = toId;
            var that: any = this;
            this.routeHandler.add(route, function () {
                that.repository.saveAll(that.routeHandler.favouriteRoutes);
                callback && callback();
            });
        }

        remove(fromId: string, routeId: string, callback: Function) {
            var that = this;
            this.routeHandler.remove(routeId, fromId, function () {
                that.repository.saveAll(that.routeHandler.favouriteRoutes);
                callback && callback();
            });
        }

        getRoutes(): Interfaces.IRoute[] {
            var routes = [];
            this.routeHandler.cache(this.repository.readAll());
            if (!this.routeHandler.favouriteRoutes || this.routeHandler.favouriteRoutes.length === 0)
                return routes;
            try {
                this.routeHandler.favouriteRoutes.forEach(function (route) {
                    route.to.forEach(function (toStation) {
                        var displayRoute = new Entities.Route();
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
        }

        queryRemote(url: string, xpath: string, callback: Function) {
            if (!url || !xpath) return;
            this.remoteQueryExecutor.query($, url, xpath, function (data) {
                var context: any = { data: data, url: url, xpath: xpath }
                callback && callback(context);
            });
        }

        scrapeStations(callback: Function) {
            $.get(this.apiUrl + '/query/stations', function (data) {
                var context: any = { data: data }
                callback && callback(context);
            });
        }

        scrapeStationRoutes(stationId: string, callback: Function) {
            $.get(this.apiUrl + '/query/station/' + stationId, function (data) {
                var context: any = { data: data }
                callback && callback(context);
            });
        }
    }
}