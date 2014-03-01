define(['q', 'jquery', 'xdomain'], function(Q, $) {
    function get(url, options) {
        var ajaxRequest = createAjaxRequest(url, options);
        return Q(ajaxRequest);
    }

    function createAjaxRequest(url, options) {
        var headers;
        options = options || {};
        if (options.isPushStateRequest) {
            headers = {
                'X-Push-State-Request': options.isPushStateRequest
            };
            $.support.cors = false;
        } else {
            $.support.cors = true;
        }
        return $.ajax({
            url: url,
            type: 'GET',
            dataType: options.dataType || 'json',
            cache: options.cache || false,
            timeout: 5000,
            headers: headers,
            data: {
                hereGoesData: 'yes it does'
            }
        });
    }

    function getMany(urls, callback, options) {
        return urls.map(function(url) {
            return get(url, options);
        }).map(function(promise) {
            return function() {
                return promise.then(function(data) {
                    if(data.length > 0)
                        callback(data);
                });
            };
        }).reduce(Q.when, Q);
    }

    function getView(url) {
        return get(url, {
            dataType: 'html',
            isPushStateRequest: true,
            cache: true
        });
    }

    return {
        get: get,
        getMany: getMany,
        getView: getView
    };
});
