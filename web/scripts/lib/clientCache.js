define(['q', 'jsonParser'], function(Q, jsonParser) {
    'use strict';

    var cachePrefix = "ngnt",
        stationsKey = "_stations",
        localStorageKey = cachePrefix + stationsKey,
        cookieName = 'NT_FAVOURITE_ROUTES';

    function getStations() {
        // TODO: Update to sessionStorage
        if (window.localStorage) {
            return jsonParser.deserialize(window.localStorage.getItem(stationsKey));
        }
    }

    function saveRoutes(routes) {
        if (window.localStorage) {
            window.localStorage.setItem(localStorageKey, jsonParser.serialize(routes));
        } else {
            saveCookie(routes);
        }
    }

    function readRoutes() {
        if (window.localStorage) {
            return jsonParser.serialize(window.localStorage.getItem(localStorageKey));
        } else {
            readCookie(routes);
        }
    }

    return {
        getStations: getStations,
        saveRoutes: saveRoutes,
        migrateCaching: migrateCaching
    };

    function migrateCaching() {
        if (!window.localStorage || jsonParser.serialize(window.localStorage.getItem(localStorageKey))) return;
        var existingCookie = readCookie();
        if (existingCookie) {
            saveRoutes(existingCookie);
            readCookie();
        }
    }

    function saveCookie(routes) {
        var cookieText = jsonParser.serialize(routes);
        var expiryDate = new Date();
        expiryDate.setDate(expiryDate.getYear() + 30);
        var formattedValue = escape(cookieText) + '; expires=' + expiryDate.toUTCString();
        document.cookie = cookieName + "=" + formattedValue;
    }

    function readCookie() {
        var browserCookies = document.cookie.split(';');
        for (var i = 0; i < browserCookies.length; i++) {
            var x = browserCookies[i].substr(0, browserCookies[i].indexOf('='));
            var y = browserCookies[i].substr(browserCookies[i].indexOf('=') + 1);
            x = x.replace(/^\s+|\s+$/g, '');
            if (x === cookieName) {
                var cookie = unescape(y);
                if (cookie) {
                    return jsonParser.deserialize(cookie);
                } else {
                    return undefined;
                }
            }
        }
    }

    function remove() {
        var expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() - 1);
        var formattedValue = '; expires=' + expiryDate.toUTCString();
        document.cookie = cookieName + "=" + formattedValue;
    }

});
