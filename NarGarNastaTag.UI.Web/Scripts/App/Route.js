var Commuter;
(function (Commuter) {
    (function (Trains) {
        (function (Entities) {
            var Route = (function () {
                function Route() {
                    this.from = {
                        name: '',
                        id: ''
                    };
                    this.to = {
                        name: '',
                        id: ''
                    };
                }
                return Route;
            })();
            Entities.Route = Route;            
        })(Trains.Entities || (Trains.Entities = {}));
        var Entities = Trains.Entities;
    })(Commuter.Trains || (Commuter.Trains = {}));
    var Trains = Commuter.Trains;
})(Commuter || (Commuter = {}));
//@ sourceMappingURL=Route.js.map
