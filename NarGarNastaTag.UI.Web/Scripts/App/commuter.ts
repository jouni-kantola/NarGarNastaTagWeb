/// <reference path="declarations/jquery.d.ts" />
/// <reference path="declarations/javascript.global.functions.d.ts" />
/// <reference path="Interfaces.ts" />
/// <reference path="IoC.ts" />
/// <reference path="Route.ts" />
/// <reference path="Logger.ts" />

var Interfaces = require('./Interfaces');
var IoC = require('./IoC');
var Route = require('./Route');

module Commuter.Common {

    export class CommuterController {
        repository: Interfaces.IRouteRepository;
        idGenerator: Interfaces.IGenerateId;
        routeHandler: Interfaces.IKnowFavouriteRoutes;
        remoteQueryExecutor: Interfaces.IQueryRemoteRoutes;
        apiUrl: string;
        
        constructor() {
            IoC.setup();
            this.repository = IoC.resolve("IRouteRepository");
            this.idGenerator = IoC.resolve("IGenerateId");
            this.routeHandler = IoC.resolve("IKnowFavouriteRoutes");
            this.remoteQueryExecutor = IoC.resolve("IQueryRemoteRoutes");
            this.apiUrl = window['apiUrl'];
        }

        add(fromName: string, fromId: string, toName: string, toId: string, callback: Function) {
            var route: Interfaces.IRoute = new Route();
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
                        var displayRoute = new Route();
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
            this.doAjax(this.apiUrl + '/query/stations', function (data) {
                var context: any = { data: data }
                callback && callback(context);
            });
        }

        scrapeStationRoutes(stationId: string, callback: Function) {
            this.doAjax(this.apiUrl + '/query/station/' + stationId, function (data) {
                var context: any = { data: data }
                callback && callback(context);
            });
        }

        doAjax(url: string, callback: Function) {
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
        }
    }
}