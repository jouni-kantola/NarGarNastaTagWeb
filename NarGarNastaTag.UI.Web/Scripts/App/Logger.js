var Commuter;
(function (Commuter) {
    (function (Trains) {
        (function (Common) {
            var Logger = (function () {
                function Logger() { }
                Logger.prototype.log = function (errorText, exception) {
                    if(window.console && console.log) {
                        console.log({
                            clearText: errorText,
                            error: exception
                        });
                    }
                };
                Logger.prototype.inform = function (message) {
                    if(window.console && console.log) {
                        console.log({
                            clearText: message
                        });
                    }
                };
                Logger.prototype.dump = function (anyObject) {
                    if(window.console && console.log) {
                        console.log(anyObject);
                    }
                };
                return Logger;
            })();
            Common.Logger = Logger;            
        })(Trains.Common || (Trains.Common = {}));
        var Common = Trains.Common;
    })(Commuter.Trains || (Commuter.Trains = {}));
    var Trains = Commuter.Trains;
})(Commuter || (Commuter = {}));
//@ sourceMappingURL=Logger.js.map
