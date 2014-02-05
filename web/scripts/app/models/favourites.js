define(['q', 'clientCache', 'tombola'], function(Q, clientCache, tombola) {
    'use strict';

    function populateFromCache() {
        return clientCache.getFavourites() || [];
    }

    function cache(routes) {
        clientCache.cacheFavourites(caches);
    }

    function createFavorite(from, to) {
        return {
            routeId: tombola.id(),
            from: {
                id: from.id.toUpperCase(),
                name: from.name
            },
            to: {
                id: to.id.toUpperCase(),
                name: to.name
            }
        };
    }

    function add(favourites, from, to) {
        var deferred = Q.deferred;
        var favourite = createFavorite(from, to);
        if (favourites.length === 0) {
            favourites.push(favourite);
            Q.resolve(favourites);
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
                }
            }
            Q.resolve(favourites);
        }
        return deferred.promise;
    }

    return {
        routes: [],
        populate: function() {
            this.routes = populateFromCache();
        },
        add: function(from, to, callback) {
            add(this.routes, from, to)
                .then(function(favourites) {
                    callback(favourites);
                    cache(favourites);
                });
        }
    };
});
