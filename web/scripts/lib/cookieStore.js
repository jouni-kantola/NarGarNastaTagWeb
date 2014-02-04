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
        var cookies = document.cookie.split(';'),
            cookieValue,
            deserialized;
        return cookies.reduce(function(previous, cookie) {
            var name = cookie.substr(0, cookie.indexOf('='));
            if (name.replace(/^\s+|\s+$/g, '') === cacheConfig.cookieName) {
                cookieValue = cookie.substr(cookie.indexOf('=') + 1);
                try {
                    deserialized = jsonParser.deserialize(unescape(cookieValue));
                } catch (ex) {
                    console.log("Cannot deserialize cookie with value '" + cookieValue + "'. Cookie will be reset.");
                    remove();
                }
            }
            return deserialized;
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
