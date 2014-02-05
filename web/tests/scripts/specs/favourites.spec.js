define(['favourites', 'clientCache', 'can'], function(favourites, clientCache, can) {
    'use strict';

    describe('trains', function() {
        var sandbox;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();
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
                        id: '1',
                        name: 'station1'
                    };

                sinon.stub(clientCache, 'getFavourites', function() {
                    return undefined;
                });
                favourites.add(from, to);
                favourites.routes.length.should.equal(1);
            });
        });
    });
});
