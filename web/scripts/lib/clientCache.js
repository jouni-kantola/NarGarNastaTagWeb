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
            saveToStorage(cacheConfig.localStorageKey, jsonParser.serialize(routes));
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
        if (doesNotNeedMigration()) return;
        var existingFavourites = readCookie();
        if (existingFavourites) {
            cacheFavourites(existingFavourites);
            deleteCookie();
        }
    }

    function doesNotNeedMigration() {
        return !can.use.localStorage || jsonParser.serialize(window.localStorage.getItem(cacheConfig.favouritesStorageKey));
    }

    function saveToStorage(key, values, options) {
        var opt = options || {
            storage: {
                localStorage: true,
                sessionStorage: false
            }
        },
            storage;
        if (opt.storage.localStorage)
            storage = window.localStorage;
        else
            storage = window.sessionStorage;
        storage.setItem(key, values);
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
        browserCookies.filter(function(cookie) {
            var key = cookie.substr(0, cookie.indexOf('='));
            return key.replace(/^\s+|\s+$/g, '') === cacheConfig.cookieName;
        }).map(function(cookie) {
            var value = cookie.substr(0, cookie.indexOf('=') + 1);
            return value ? unescape(value) : undefined;
        });
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
