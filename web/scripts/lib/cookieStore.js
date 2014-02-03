define(['cacheConfig', 'jsonParser'], function(cacheConfig, jsonParser) {
    'use strict';

    function put(serializable) {
        var cookieText = jsonParser.serialize(serializable);
        var expiryDate = new Date();
        expiryDate.setDate(expiryDate.getYear() + cacheConfig.cookieLifeTime);
        var formattedValue = escape(cookieText) + '; expires=' + expiryDate.toUTCString();
        document.cookie = cacheConfig.cookieName + "=" + formattedValue;
    }

    function get() {
        var cookies = document.cookie.split(';');
        return cookies.reduce(function(previous, cookie) {
            var name = cookie.substr(0, cookie.indexOf('='));
            if(name.replace(/^\s+|\s+$/g, '') === cacheConfig.cookieName){
                var value = cookie.substr(cookie.indexOf('=') + 1);
                return value ? jsonParser.deserialize(unescape(value)) : undefined;
            }
            return undefined;
        });
    }

    function remove() {
        var expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() - 1);
        var formattedValue = '; expires=' + expiryDate.toUTCString();
        document.cookie = cacheConfig.cookieName + "=" + formattedValue;
    }

    return {
        put: put,
        get: get,
        remove: remove
    };

});
