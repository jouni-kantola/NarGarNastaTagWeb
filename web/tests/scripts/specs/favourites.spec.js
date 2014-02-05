define(['favourites', 'clientCache', 'tombola'], function(favourites, clientCache, tombola) {
    'use strict';

    describe('trains', function() {
        var sandbox;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();
			favourites.routes = [];
        });

        afterEach(function() {
            // restore the environment as it was before
            sandbox.restore();
        });

        describe('populate()', function() {
            it('should get favourites from storage', function() {
                var expected = {
                    favourites: []
                },
                    getFavouritesStub = sandbox.stub(clientCache, 'getFavourites', function() {
                        return expected;
                    });
                favourites.populate();
                favourites.routes.should.deep.equal(expected);
            });

            it('should create empty list if no cached favourites exists', function() {
                var expected = [];
                sandbox.stub(clientCache, 'getFavourites', function() {
                    return undefined;
                });
                favourites.populate();
                favourites.routes.should.deep.equal(expected);
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
                    };

                sandbox.stub(clientCache, 'getFavourites', function() {
                    return undefined;
                });
                sandbox.stub(clientCache, 'cacheFavourites');
                favourites.add(from, to);
                favourites.routes.length.should.equal(1);
            });

            it('should cache favourites after add', function() {
                var from = { id: '1', name: 'station1' },
                    to = { id: '2', name: 'station2' },
                    routeId = '123',
                    expected = [{
                        routeId: routeId,
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
                favourites.routes.length.should.equal(1);
                favourites.routes.should.deep.equal(expected);
                cache.favourites.should.deep.equal(expected);
            });
        });
    });
});
