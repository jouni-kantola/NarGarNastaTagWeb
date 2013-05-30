var Commuter;
(function (Commuter) {
    (function (Trains) {
        (function (Common) {
            var IdRandomizer = (function () {
                function IdRandomizer() { }
                IdRandomizer.prototype.getId = function () {
                    var partOne = new Date().getTime();
                    var partTwo = 1 + Math.floor((Math.random() * 32767));
                    var partThree = 1 + Math.floor((Math.random() * 32767));
                    return partOne + '-' + partTwo + '-' + partThree;
                };
                IdRandomizer.prototype.getRandomRangedInteger = function (minimum, maximum) {
                    return Math.floor(Math.random() * (1 + maximum - minimum)) + minimum;
                };
                return IdRandomizer;
            })();
            Common.IdRandomizer = IdRandomizer;            
        })(Trains.Common || (Trains.Common = {}));
        var Common = Trains.Common;
    })(Commuter.Trains || (Commuter.Trains = {}));
    var Trains = Commuter.Trains;
})(Commuter || (Commuter = {}));
//@ sourceMappingURL=IdRandomizer.js.map
