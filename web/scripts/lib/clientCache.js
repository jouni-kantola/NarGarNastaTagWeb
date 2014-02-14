define(['q', 'jsonParser', 'cacheConfig', 'cookieStore', 'can'], function(Q, jsonParser, cacheConfig, cookieStore, can) {
    'use strict';

    function getStations() {
        // TODO: Update to sessionStorage
        var stringifiedStations;
        if (can.use.localStorage) {
            stringifiedStations = window.localStorage.getItem(cacheConfig.stationsStorageKey);
        }
        return stringifiedStations ? jsonParser.deserialize(stringifiedStations) : [];
    }

    function cacheStations(stations) {
        if (can.use.sessionStorage) {
            saveToStorage(cacheConfig.stationsStorageKey, stations, { storage: { sessionStorage: true } });
        }
    }

    function cacheFavourites(routes) {
        if (can.use.localStorage) {
            saveToStorage(cacheConfig.favouritesStorageKey, routes);
        } else {
            cookieStore.put(routes);
        }
    }

    function getFavourites() {
        var stringifiedRoutes;
        if (can.use.localStorage) {
            stringifiedRoutes = window.localStorage.getItem(cacheConfig.favouritesStorageKey);
        } else {
            stringifiedRoutes = cookieStore.get();
        }
        return stringifiedRoutes ? jsonParser.deserialize(stringifiedRoutes) : [];
    }

    function migrateCaching() {
        if (doesNotNeedMigration()) return;
        var existingFavourites = cookieStore.get();
        if (existingFavourites) {
            cacheFavourites(existingFavourites);
            cookieStore.remove();
        }
    }

    function doesNotNeedMigration() {
        return !can.use.localStorage || window.localStorage.getItem(cacheConfig.favouritesStorageKey);
    }

    function saveToStorage(key, value, options) {
        var opt = options ||
            {
                storage: {
                    localStorage: true,
                    sessionStorage: false
                }
            },
            storage,
            serialized = jsonParser.serialize(value);
        if (opt.storage.localStorage)
            storage = window.localStorage;
        else
            storage = window.sessionStorage;
        storage.setItem(key, serialized);
    }

    return {
        cacheStations: cacheStations,
        getStations: getStations,
        getFavourites: getFavourites,
        cacheFavourites: cacheFavourites,
        migrateCaching: migrateCaching
    };

});
