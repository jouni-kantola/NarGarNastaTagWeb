define(['q', 'jsonParser', 'cacheConfig', 'can'], function(Q, jsonParser, cacheConfig, can) {
    'use strict';

    function getStations() {
        // TODO: Update to sessionStorage
        var stringifiedStations;
        if (window.localStorage) {
            stringifiedStations = window.localStorage.getItem(cacheConfig.stationsStorageKey);
        }
        return stringifiedStations ? jsonParser.deserialize(stringifiedStations) : [];
    }

    function cacheStations(stations) {
        // TODO: Update to sessionStorage
        if (window.localStorage) {
            window.localStorage.setItem(cacheConfig.stationsStorageKey, jsonParser.serialize(stations));
        }
    }

    function cacheFavourites(routes) {
        if (can.use.localStorage) {
            window.localStorage.setItem(cacheConfig.localStorageKey, jsonParser.serialize(routes));
        } else {
            saveCookie(routes);
        }
    }

    function getFavourites() {
        var stringifiedRoutes;
        if (can.use.localStorage) {
            stringifiedRoutes = window.localStorage.getItem(cacheConfig.favouritesStorageKey); 
        } else {
            stringifiedRoutes = readCookie();
        }
        return stringifiedRoutes ? jsonParser.serialize(stringifiedRoutes) : [];
    }

    function migrateCaching() {
        if (!can.use.localStorage || jsonParser.serialize(window.localStorage.getItem(cacheConfig.favouritesStorageKey))) return;
        var existingCookie = readCookie();
        if (existingCookie) {
            cacheFavourites(existingCookie);
            deleteCookie();
        }
    }

    function saveCookie(routes) {
        var cookieText = jsonParser.serialize(routes);
        var expiryDate = new Date();
        expiryDate.setDate(expiryDate.getYear() + cacheConfig.cookieLifeTime);
        var formattedValue = escape(cookieText) + '; expires=' + expiryDate.toUTCString();
        document.cookie = cacheConfig.cookieName + "=" + formattedValue;
    }

    function readCookie() {
        var browserCookies = document.cookie.split(';');
        for (var i = 0; i < browserCookies.length; i++) {
            var x = browserCookies[i].substr(0, browserCookies[i].indexOf('='));
            var y = browserCookies[i].substr(browserCookies[i].indexOf('=') + 1);
            x = x.replace(/^\s+|\s+$/g, '');
            if (x === cacheConfig.cookieName) {
                var cookie = unescape(y);
                if (cookie) {
                    return jsonParser.deserialize(cookie);
                } else {
                    return undefined;
                }
            }
        }
    }

    function deleteCookie() {
        var expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() - 1);
        var formattedValue = '; expires=' + expiryDate.toUTCString();
        document.cookie = cacheConfig.cookieName + "=" + formattedValue;
    }

    return {
        cacheStations: cacheStations,
        getStations: getStations,
        cacheFavourites: cacheFavourites,
        migrateCaching: migrateCaching
    };

});
