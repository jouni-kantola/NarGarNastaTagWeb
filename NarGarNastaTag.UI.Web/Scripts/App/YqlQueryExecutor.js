var Commuter;
(function (Commuter) {
    (function (Trains) {
        (function (Query) {
            var YqlQueryExecutor = (function () {
                function YqlQueryExecutor() { }
                YqlQueryExecutor.prototype.query = function (xmlHttpRequestExecutor, url, xpath, callback) {
                    if(!url || !xpath) {
                        throw 'URL and XPATH must be set for YQL query';
                    }
                    if(!xmlHttpRequestExecutor.hasOwnProperty('getJSON')) {
                        throw 'getJSON is expected for remote query';
                    }
                    var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent("select * from html where url='" + url + "' and xpath='" + xpath) + "'&format=json&callback=?";
                    xmlHttpRequestExecutor.getJSON(yql, function (result) {
                        callback && callback(result);
                    });
                };
                return YqlQueryExecutor;
            })();
            Query.YqlQueryExecutor = YqlQueryExecutor;            
        })(Trains.Query || (Trains.Query = {}));
        var Query = Trains.Query;
    })(Commuter.Trains || (Commuter.Trains = {}));
    var Trains = Commuter.Trains;
})(Commuter || (Commuter = {}));
//@ sourceMappingURL=YqlQueryExecutor.js.map
