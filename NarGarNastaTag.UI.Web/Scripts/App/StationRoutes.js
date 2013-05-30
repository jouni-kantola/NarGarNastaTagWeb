var Commuter;
(function (Commuter) {
    (function (Trains) {
        (function (Entities) {
            var StationRoutes = (function () {
                function StationRoutes() {
                    this.from = {
                        name: '',
                        id: ''
                    };
                    this.to = new Array();
                    this.to.push({
                        routeId: '',
                        name: '',
                        id: ''
                    });
                }
                return StationRoutes;
            })();
            Entities.StationRoutes = StationRoutes;            
        })(Trains.Entities || (Trains.Entities = {}));
        var Entities = Trains.Entities;
    })(Commuter.Trains || (Commuter.Trains = {}));
    var Trains = Commuter.Trains;
})(Commuter || (Commuter = {}));
//@ sourceMappingURL=StationRoutes.js.map
