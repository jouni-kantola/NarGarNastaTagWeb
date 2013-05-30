var Commuter;
(function (Commuter) {
    (function (Trains) {
        (function (Command) {
            var RouteToJsonParser = (function () {
                function RouteToJsonParser(parser) {
                    this.parser = parser;
                }
                RouteToJsonParser.prototype.serialize = function (routes) {
                    if(routes) {
                        return this.parser.stringify(routes);
                    }
                    return '';
                };
                RouteToJsonParser.prototype.deserialize = function (stringifiedRoutes) {
                    try  {
                        var routes = JSON.parse(stringifiedRoutes);
                        return routes;
                    } catch (ex) {
                        var log = new Trains.Common.Logger();
                        log.log('Cannot deserialize routes.', ex);
                    }
                };
                return RouteToJsonParser;
            })();
            Command.RouteToJsonParser = RouteToJsonParser;            
        })(Trains.Command || (Trains.Command = {}));
        var Command = Trains.Command;
    })(Commuter.Trains || (Commuter.Trains = {}));
    var Trains = Commuter.Trains;
})(Commuter || (Commuter = {}));
//@ sourceMappingURL=RouteToJsonParser.js.map
