define(['views/search'], function(searchView) {
    'use strict';

    describe('searchModel', function() {
        describe('populate()', function() {
            it('should return stations', function() {
                searchView.populate().length.should.equal(502);
            });
        });

        describe('render()', function() {
            it('should throw if viewmodel is undefined', function() {
                searchView.render.should.throw(Error, /viewModel is/);
            });
        });
    });


});
