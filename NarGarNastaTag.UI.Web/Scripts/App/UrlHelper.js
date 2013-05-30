var Commuter;
(function (Commuter) {
    (function (Trains) {
        (function (Common) {
            var UrlHelper = (function () {
                function UrlHelper() { }
                UrlHelper.getQueryStringParameterByName = function getQueryStringParameterByName(url, name) {
                    var match = RegExp('[?&]' + name + '=([^&]*)').exec(url);
                    return match && match[1].replace(/\+/g, ' ');
                }
                return UrlHelper;
            })();
            Common.UrlHelper = UrlHelper;            
        })(Trains.Common || (Trains.Common = {}));
        var Common = Trains.Common;
    })(Commuter.Trains || (Commuter.Trains = {}));
    var Trains = Commuter.Trains;
})(Commuter || (Commuter = {}));
//@ sourceMappingURL=UrlHelper.js.map
