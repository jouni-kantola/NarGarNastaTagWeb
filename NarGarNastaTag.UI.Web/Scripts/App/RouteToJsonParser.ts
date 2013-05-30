/// <reference path="declarations/javascript.global.functions.d.ts" />
/// <reference path="declarations/jquery.d.ts" />
/// <reference path="interfaces.d.ts" />
/// <reference path="Logger.ts" />

module Commuter.Trains.Command {
    export class RouteToJsonParser implements Interfaces.IParseRoutes {
        parser: JSON;
        serialize(routes: any): string {
            if(routes)
                return this.parser.stringify(routes);
            return '';
        }
        deserialize(stringifiedRoutes: string) {
            try {
                var routes = JSON.parse(stringifiedRoutes);
                return routes;
            }catch(ex){
                var log = new Common.Logger();
                log.log('Cannot deserialize routes.', ex);
            }
        }
        constructor (parser: JSON) {
            this.parser = parser;
        }
    }
}