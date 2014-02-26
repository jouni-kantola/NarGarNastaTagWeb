define(['favourites', 'clientCache', 'tombola'], function(favourites, clientCache, tombola) {
    'use strict';

    describe('favourites', function() {
        var sandbox;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            favourites.routes = [];
        });

        afterEach(function() {
            // restore the environment as it was before
            sandbox.restore();
        });

        describe('remove()', function() {
            it('should remove route by id', function() {
                var routeId = '123',
                    from = {
                        id: '1',
                        name: 'station1'
                    },
                    to = {
                        routeId: routeId,
                        id: '2',
                        name: 'station2'
                    },
                    routes = [{
                        from: from,
                        to: [to]
                    }],
                    expected = [{
                        from: from,
                        to: []
                    }],
                    cache = {
                        favourites: undefined
                    };

                sandbox.stub(favourites, 'routes', routes);
                sandbox.stub(clientCache, 'getFavourites', function() {
                    return routes;
                });
                sandbox.stub(clientCache, 'cacheFavourites', function(favourites) {
                    cache.favourites = favourites;
                });
                favourites.remove(routeId);
                cache.favourites.should.deep.equal(expected);
            });

            it('should not refresh cache if route id is not found', function() {
                var routeId = '123',
                    idToRemove = '456',
                    from = {
                        id: '1',
                        name: 'station1'
                    },
                    to = {
                        routeId: routeId,
                        id: '2',
                        name: 'station2'
                    },
                    expected = [{
                        from: from,
                        to: [to]
                    }],
                    cache = {
                        favourites: undefined
                    };

                sandbox.stub(favourites, 'routes', expected);
                var cacheFavouritesStub = sandbox.stub(clientCache, 'cacheFavourites', function(favourites) {
                    cache.favourites = favourites;
                });
                favourites.remove(idToRemove);
                favourites.routes.should.deep.equal(expected);
                chai.expect(cacheFavouritesStub.should.not.have.been.called);
            });
        });

        describe('add()', function() {
            it('should add as first favourite', function() {
                var from = {
                    id: '1',
                    name: 'station1'
                },
                    to = {
                        id: '2',
                        name: 'station2'
                    },
                    cache = {
                        favourites: undefined
                    };

                sandbox.stub(clientCache, 'getFavourites', function() {
                    return undefined;
                });
                var cacheFavouritesStub = sandbox.stub(clientCache, 'cacheFavourites', function(favourites) {
                    cache.favourites = favourites;
                });
                favourites.add(from, to);
                cache.favourites.length.should.equal(1);
            });

            it('should cache favourites after add', function() {
                var routeId = '123',
                    from = {
                        id: '1',
                        name: 'station1'
                    },
                    to = {
                        routeId: routeId,
                        id: '2',
                        name: 'station2'
                    },
                    expected = [{
                        from: from,
                        to: [to]
                    }],
                    cache = {
                        favourites: undefined
                    };

                sandbox.stub(tombola, 'id', function() {
                    return routeId;
                });
                sandbox.stub(clientCache, 'getFavourites', function() {
                    return undefined;
                });
                sandbox.stub(clientCache, 'cacheFavourites', function(favourites) {
                    cache.favourites = favourites;

                });
                favourites.add(from, to);
                cache.favourites.should.deep.equal(expected);
            });

            it('should not refresh cache favourites if route exists', function() {
                var routeId = '123',
                    from = {
                        id: '1',
                        name: 'station1'
                    },
                    to = {
                        routeId: routeId,
                        id: '2',
                        name: 'station2'
                    },
                    expected = [{
                        from: from,
                        to: [to]
                    }],
                    cache = {
                        favourites: undefined
                    };

                sandbox.stub(tombola, 'id', function() {
                    return routeId;
                });
                sandbox.stub(clientCache, 'getFavourites', function() {
                    return expected;
                });
                var cacheFavouritesStub = sandbox.stub(clientCache, 'cacheFavourites', function(favourites) {
                    cache.favourites = favourites;
                });
                favourites.add(from, to);
                chai.expect(cacheFavouritesStub.should.not.have.been.called);
            });

            it('should add route connected to previously added station', function() {
                var routeId = '123',
                    from = {
                        id: '1',
                        name: 'station1'
                    },
                    to1 = {
                        routeId: routeId,
                        id: '2',
                        name: 'station2'
                    },
                    to2 = {
                        routeId: routeId,
                        id: '3',
                        name: 'station3'
                    },
                    expected = [{
                        from: from,
                        to: [to1, to2]
                    }],
                    cache = {
                        favourites: undefined
                    };
                sandbox.stub(tombola, 'id', function() {
                    return routeId;
                });
                sandbox.stub(clientCache, 'getFavourites', function() {
                    return [{
                        from: from,
                        to: [to1]
                    }];
                });
                sandbox.stub(clientCache, 'cacheFavourites', function(favourites) {
                    cache.favourites = favourites;
                });
                favourites.add(from, to1);
                favourites.add(from, to2);
                cache.favourites.should.deep.equal(expected);
            });
        });
    });
});