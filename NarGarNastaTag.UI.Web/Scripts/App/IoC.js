var Commuter;
(function (Commuter) {
    (function (Trains) {
        (function (Common) {
            var IoC = (function () {
                function IoC() { }
                IoC.container = null;
                IoC.register = function register(interfaceType, type) {
                    if(!IoC.container) {
                        IoC.container = [];
                    }
                    IoC.container.push({
                        _interfaceType: interfaceType,
                        _type: type
                    });
                    return type;
                }
                IoC.resolve = function resolve(interfaceType) {
                    for(var i = 0; i < IoC.container.length; i++) {
                        if(IoC.container[i]._interfaceType === interfaceType) {
                            return IoC.container[i]._type;
                        }
                    }
                    throw new Error(interfaceType + ' is not registred.');
                }
                IoC.setup = function setup() {
                    var idGenerator = IoC.register("IGenerateId", new Trains.Common.IdRandomizer());
                    var parser = IoC.register("IParseRoutes", new Trains.Command.RouteToJsonParser(JSON));
                    var routes = IoC.register("IStationRoutes", []);
                    var configuration = IoC.register("IConfigureCookieStore", new Trains.Command.CookieStoreConfiguration('NT_FAVOURITE_ROUTES', 365, parser));
                    var repository = IoC.register("IRouteRepository", new Trains.Command.CookieStore(configuration, parser));
                    var routeCollection = IoC.register("IKnowFavouriteRoutes", new Trains.Entities.RouteCollection(repository, routes));
                    var remoteQueryExecutor = IoC.register("IQueryRemoteRoutes", new Trains.Query.YqlQueryExecutor());
                }
                return IoC;
            })();
            Common.IoC = IoC;            
        })(Trains.Common || (Trains.Common = {}));
        var Common = Trains.Common;
    })(Commuter.Trains || (Commuter.Trains = {}));
    var Trains = Commuter.Trains;
})(Commuter || (Commuter = {}));
//@ sourceMappingURL=IoC.js.map
