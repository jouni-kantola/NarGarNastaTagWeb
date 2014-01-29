define(['q'], function(Q) {
    var cachePrefix = "ngnt",
        stationsKey = "_stations";

    function getStations() {
        var deferred = Q.defer();
        if (window.localStorage) {
            var stations = JSON.parse(window.localStorage.getItem(stationsKey));
            deferred.resolve(stations);
        } else {
            deferred.fail();
        }
        return deferred.promise;
    }

    return {
        getStations: getStations
    };
});
