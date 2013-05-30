var Commuter;
(function (Commuter) {
    (function (Trains) {
        (function (Command) {
            var CookieStoreConfiguration = (function () {
                function CookieStoreConfiguration(cookieName, expiryInDays, mapper) {
                    this.cookieName = cookieName;
                    this.expiryInDays = expiryInDays;
                    this.mapper = mapper;
                }
                return CookieStoreConfiguration;
            })();
            Command.CookieStoreConfiguration = CookieStoreConfiguration;            
        })(Trains.Command || (Trains.Command = {}));
        var Command = Trains.Command;
    })(Commuter.Trains || (Commuter.Trains = {}));
    var Trains = Commuter.Trains;
})(Commuter || (Commuter = {}));
//@ sourceMappingURL=CookieStoreConfiguration.js.map
