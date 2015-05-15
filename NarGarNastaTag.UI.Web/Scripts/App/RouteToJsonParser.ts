/// <reference path="declarations/javascript.global.functions.d.ts" />
/// <reference path="declarations/jquery.d.ts" />
/// <reference path="Interfaces.ts" />
/// <reference path="Logger.ts" />

var Logger = require('./Logger');

class RouteToJsonParser implements Interfaces.IParseRoutes {
    parser: JSON;
    serialize(routes: any): string {
        if (routes)
            return this.parser.stringify(routes);
        return '';
    }
    deserialize(stringifiedRoutes: string) {
        try {
            var routes = JSON.parse(stringifiedRoutes);
            return routes;
        } catch (ex) {
            var log = new Logger();
            log.log('Cannot deserialize routes.', ex);
        }
    }
    constructor(parser: JSON) {
        this.parser = parser;
    }
}

export = RouteToJsonParser;