define(['q', 'lazy', 'clientCache', 'tombola', 'bus'], function(Q, Lazy, clientCache, tombola, bus) {
    'use strict';

    function cache(routes) {
        clientCache.cacheFavourites(routes);
    }

    function createFavourite(from, to) {
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

    function add(from, to) {
        var favourites = clientCache.getFavourites() || [];
        var favourite = createFavourite(from, to);
        var refreshCache = true;
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
        return {
            refreshCache: refreshCache,
            data: favourites
        };
    }

    function remove(routeId) {
        var favourites = clientCache.getFavourites() || [];
        var refreshCache = false;
        var fromExisting = new Lazy(favourites).find(function(existing) {
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
        return {
            refreshCache: refreshCache,
            data: favourites
        };
    }

    function publish(msg, data) {
        bus.publish(msg, data);
    }

    return {
        add: function(from, to) {
            var result = add(from, to);
            if (result.refreshCache) {
                cache(result.data);
                publish('data-favourite-added', result.data);
            }
        },
        remove: function(routeId) {
            var result = remove(routeId);
            if (result.refreshCache) {
                cache(result.data);
            }
        }
    };
});
