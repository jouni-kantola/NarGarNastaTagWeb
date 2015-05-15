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

var IdRandomizer = require('./IdRandomizer');
var RouteToJsonParser = require('./RouteToJsonParser');
var CookieStoreConfiguration = require('./CookieStoreConfiguration');
var CookieStore = require('./CookieStore');
var RouteCollection = require('./RouteCollection');
var YqlQueryExecutor = require('./YqlQueryExecutor');

class IoC {
    static container: any[];
    static register(interfaceType: string, type: any): any {
        if (!IoC.container)
            IoC.container = [];
        IoC.container.push({ _interfaceType: interfaceType, _type: type });
        return type;
    }
    static resolve(interfaceType: string): any {
        for (var i: number = 0; i < IoC.container.length; i++) {
            if (IoC.container[i]._interfaceType === interfaceType)
                return IoC.container[i]._type;
        }
        throw new Error(interfaceType + ' is not registred.');
    }
    static setup() {
        var idGenerator: Interfaces.IGenerateId = IoC.register("IGenerateId", new IdRandomizer());
        var parser: Interfaces.IParseRoutes = IoC.register("IParseRoutes", new RouteToJsonParser(JSON));
        //var routes: Entities.StationRoutes[] = IoC.register("IStationRoutes", new Entities.StationRoutes[]);
        var routes: any = IoC.register("IStationRoutes", []);
        var configuration: Interfaces.IConfigureCookieStore = IoC.register("IConfigureCookieStore", new CookieStoreConfiguration('NT_FAVOURITE_ROUTES', 365, parser));
        var repository: Interfaces.IRouteRepository = IoC.register("IRouteRepository", new CookieStore(configuration, parser));
        var routeCollection: Interfaces.IKnowFavouriteRoutes = IoC.register("IKnowFavouriteRoutes", new RouteCollection(repository, routes));
        var remoteQueryExecutor: Interfaces.IQueryRemoteRoutes = IoC.register("IQueryRemoteRoutes", new YqlQueryExecutor());
    }
}

export = IoC;