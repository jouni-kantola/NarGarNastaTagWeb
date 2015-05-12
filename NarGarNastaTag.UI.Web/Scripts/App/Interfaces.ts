module Interfaces {
    export interface IGenerateId {
        getId(): string;
        getRandomRangedInteger(minmum: number, maxmimum: number): number;
    }
    export interface IStationRoutes {
        from: { name: string; id: string; };
        to: { routeId: string; name: string; id: string; }[];
    }
    export interface IRoute {
        routeId: string;
        from: { name: string; id: string; };
        to: { name: string; id: string; };
    }
    export interface IKnowFavouriteRoutes {
        favouriteRoutes: IStationRoutes[];
        cache(routes: IStationRoutes[]);
        add(route: IRoute, callback: Function);
        remove(routeId: string, stationId: string, callback: Function);
    }
    export interface IRouteRepository {
        saveAll(routes: IStationRoutes[]);
        readAll(): IStationRoutes[];
        remove();
    }
    export interface IConfigureCookieStore {
        cookieName: string;
        expiryInDays: number;
        mapper: IParseRoutes;
        //new (configuration: IConfigureCookieStore, mapper: IParseRoutes);
    }
    export interface IParseRoutes {
        parser: any;
        serialize(routes: any): string;
        deserialize(stringifiedRoutes: string): any;
    }
    export interface IQueryRemoteRoutes {
        //queryAllStations(callback:any): any;
        //queryRoutesFromStation(id: string, callback: any): any;
        //queryRoutesToStation(fromId: string, toId: string, callback: any): any;
        query(xmlHttpRequestExecutor: any, url: string, xpath: string, callback: Function);
    }
}