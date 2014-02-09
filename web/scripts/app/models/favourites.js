define(['q', 'lazy', 'clientCache', 'tombola'], function(Q, Lazy, clientCache, tombola) {
    'use strict';

    function populateFromCache() {
        return clientCache.getFavourites() || [];
    }

    function cache(routes) {
        clientCache.cacheFavourites(routes);
    }

    function createFavorite(from, to) {
        return {
            from: {
                id: from.id.toUpperCase(),
                name: from.name
            },
            to: [{
                routeId: tombola.id(),
                id: to.id.toUpperCase(),
                name: to.name
            }]
        };
    }

    function add(favourites, from, to) {
        var favourite = createFavorite(from, to),
            refreshCache = true;
        var fromExisting = new Lazy(favourites).find(function(existing) {
            return existing.from.id === favourite.from.id;
        });
        if (!fromExisting) {
            favourites.push(favourite);
        } else {
            var toExisting = new Lazy(fromExisting.to).find(function(existing) {
                return favourite.to[0].id === existing.id;
            });
            if (!toExisting) {
                fromExisting.to.push(favourite.to[0]);
            } else {
                refreshCache = false;
            }
        }
        return refreshCache;
    }

    function remove(favourites, routeId) {
        var refreshCache = false,
            fromExisting = new Lazy(favourites).find(function(existing) {
                return new Lazy(existing.to).some(function(destination) {
                    return destination.routeId === routeId;
                });
            });
        if (fromExisting) {
            refreshCache = true;
            fromExisting.to = new Lazy(fromExisting.to).filter(function(destination) {
                return destination.routeId !== routeId;
            }).toArray();
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
            if (callback) callback(this.routes);
            if (refreshCache) {
                cache(this.routes);
            }
        },
        remove: function(routeId, callback) {
            var refreshCache = remove(this.routes, routeId);
            if (callback) callback(this.routes);
            if (refreshCache) {
                cache(this.routes);
            }
        }
    };
});
