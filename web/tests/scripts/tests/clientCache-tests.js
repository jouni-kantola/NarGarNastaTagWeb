define(['libs/clientCache'], function(clientCache) {
    'use strict';
    
    describe('clientCache', function() {
        describe('getStations()', function() {
            it('should return stations from cache', function() {
                clientCache.getStations().length.should.equal(502); 
            });
        });
    });


});
