define(['q', 'clientCache', 'tombola'], function(Q, clientCache, tombola) {
    'use strict';

    function populateFromCache() {
        return clientCache.getFavourites() || [];
    }

    function cache(routes) {
        clientCache.cacheFavourites(routes);
    }

    function createFavorite(from, to) {
        return {
            routeId: tombola.id(),
            from: {
                id: from.id.toUpperCase(),
                name: from.name
            },
            to: [{
                id: to.id.toUpperCase(),
                name: to.name
            }]
        };
    }

    function add(favourites, from, to) {
        var favourite = createFavorite(from, to),
            refreshCache = true;
        if (favourites.length === 0) {
            favourites.push(favourite);
        } else {
            var fromExisting = favourites.reduce(function(previous, existing) {
                return existing.from.id === favourite.from.id ? existing : previous;
            });
            if (!fromExisting) {
                favourites.push(favourite);
            } else {
                var toExisting = fromExisting.to.reduce(function(previous, existing) {
                    return favourite.to.id === existing.to.id ? true : false;
                });
                if (!toExisting) {
                    fromExisting.to.push(favourite);
                } else {
                    refreshCache = false;
                }
            }
        }
        return refreshCache;
    }

    return {
        routes: [],
        populate: function() {
            this.routes = populateFromCache();
        },
        add: function(from, to, callback) {
            var refreshCache = add(this.routes, from, to);
            if(callback) callback(this.routes);
            if (refreshCache) {
                cache(this.routes);
            }
        }
    };
});
