define(['q', 'jquery'], function(Q, $) {
    function getView(url, options){
        return get(url, {dataType: 'text', isPushStateRequest: true});
    };

    function get(url, options) {
        var o = options || {};
        $.support.cors = true;
        return Q($.ajax({
            url: url,
            type: "GET",
            dataType: options.dataType || "json",
            cache: false,
            timeout: 5000,
            headers: {
                'X-Push-State-Request': options.isPushStateRequest || false
            },
            data: {
                hereGoesData: 'yes it does'
            }
        }));
    };

    function getAll(urls, callback) {
        return urls.map(get).map(function(promise) {
            return function() {
                return promise.then(function(data) {
                    callback(data);
                });
            }
        }).reduce(Q.when, Q);
    };

    return {
        get: get,
        getAll: getAll,
        getView: getView
    }
});
