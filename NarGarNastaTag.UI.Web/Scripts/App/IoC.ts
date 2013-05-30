/// <reference path="declarations/jquery.d.ts" />
/// <reference path="declarations/javascript.global.functions.d.ts" />
/// <reference path="interfaces.d.ts" />
/// <reference path="CookieStore.ts" />
/// <reference path="CookieStoreConfiguration.ts" />
/// <reference path="RouteToJsonParser.ts" />
/// <reference path="IdRandomizer.ts" />
/// <reference path="StationRoutes.ts" />
/// <reference path="RouteCollection.ts" />
/// <reference path="YqlQueryExecutor.ts" />
/// <reference path="Logger.ts" />

module Commuter.Trains.Common {
    export class IoC {
        static container: any[];
        static register(interfaceType: string, type: any): any {
            if (!container)
                container = [];
            container.push({ _interfaceType: interfaceType, _type: type });
            return type;
        }
        static resolve(interfaceType: string): any {
            for (var i: number = 0; i < container.length; i++) {
                if (container[i]._interfaceType === interfaceType)
                    return container[i]._type;
            }
            throw new Error(interfaceType + ' is not registred.');
        }
        static setup() {
            var idGenerator: Interfaces.IGenerateId = register("IGenerateId", new Common.IdRandomizer());
            var parser: Interfaces.IParseRoutes = register("IParseRoutes", new Command.RouteToJsonParser(JSON));
            //var routes: Entities.StationRoutes[] = register("IStationRoutes", new Entities.StationRoutes[]);
            var routes: any = register("IStationRoutes", []);
            var configuration: Interfaces.IConfigureCookieStore = register("IConfigureCookieStore", new Command.CookieStoreConfiguration('NT_FAVOURITE_ROUTES', 365, parser));
            var repository: Interfaces.IRouteRepository = register("IRouteRepository", new Command.CookieStore(configuration, parser));
            var routeCollection: Interfaces.IKnowFavouriteRoutes = register("IKnowFavouriteRoutes", new Entities.RouteCollection(repository, routes));
            var remoteQueryExecutor: Interfaces.IQueryRemoteRoutes = register("IQueryRemoteRoutes", new Query.YqlQueryExecutor());
        }
    }
}