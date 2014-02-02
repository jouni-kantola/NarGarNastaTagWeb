define(['views/search', 'clientCache'], function(searchView, clientCache) {
    'use strict';

    describe('searchModel', function() {
        describe('populate()', function() {
            it('should return stations', function() {
                var sandbox = sinon.sandbox.create();
                sandbox.stub(clientCache, 'getStations', function() {
                    return [{
                        Name: 'Station1',
                        Id: 1
                    }, {
                        Name: 'Station2',
                        Id: 2
                    }];
                });
                searchView.populate().length.should.equal(2);
                sandbox.restore();
            });
        });

        describe('render()', function() {
            it('should throw if viewmodel is undefined', function() {
                searchView.render.should.throw (Error, /stations is/);
            });
        });
    });


});
