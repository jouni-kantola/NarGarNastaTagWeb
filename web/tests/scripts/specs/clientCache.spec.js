define(['cacheConfig', 'clientCache', 'can'], function(cacheConfig, clientCache, can) {
    'use strict';

    describe('clientCache', function() {
        var sandbox;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            // restore the environment as it was before
            sandbox.restore();
        });

        describe('cacheStations()', function() {
            it('should cache stations', function() {
                var store = {},
                    sessionStorageKey,
                    routes = {
                        route: 'a route'
                    };

                sandbox.stub(window.localStorage, 'setItem', function(key, value) {
                    store[key] = value;
                    sessionStorageKey = key;
                });
                clientCache.cacheStations(routes);
                store[sessionStorageKey].should.equal(JSON.stringify(routes));
            });
        });

        describe('getStations()', function() {
            it('should return stations from cache', function() {
                sandbox.stub(window.localStorage, 'getItem', function(key) {
                    return '[ { "Name": "Station1", "Id": 1}, { "Name": "Station2", "Id": 2} ]';
                });
                clientCache.getStations().length.should.equal(2);
            });
        });

        describe('cacheFavourites()', function() {
            it('should cache to localStorage when localStorage is feature detected', function() {
                var store = {},
                    localStorageKey,
                    routes = {
                        route: 'a route'
                    };

                sandbox.stub(window.localStorage, 'setItem', function(key, value) {
                    store[key] = value;
                    localStorageKey = key;
                });
                clientCache.cacheFavourites(routes);
                store[localStorageKey].should.equal(JSON.stringify(routes));
            });

            it('should cache to cookie when localStorage is not supported', function() {
                var cookieName = 'test_cookie',
                    routes = {
                        route: 'a route'
                    };
                
                sandbox.stub(can.use, 'localStorage', false);
                sandbox.stub(document, 'cookie', '');
                sandbox.stub(cacheConfig, 'cookieName', cookieName);

                clientCache.cacheFavourites(routes);
                document.cookie.should.equal(cookieName + '=' + escape(JSON.stringify(routes)));
                sandbox.restore();

            });

            it('should handle save, read and delete cookie when cookies are used as cache', function() {
                var cookieName = 'test_cookie',
                    routes = {
                        route: 'a route'
                    };
                
                sandbox.stub(can.use, 'localStorage', false);
                sandbox.stub(document, 'cookie', '');
                sandbox.stub(cacheConfig, 'cookieName', cookieName);
                sandbox.stub(clientCache, 'doesNotNeedMigration', false);

                clientCache.cacheFavourites(routes);
                document.cookie.should.equal(cookieName + '=' + escape(JSON.stringify(routes)));
                clientCache.migrateCache();
                sandbox.restore();

            });
        });
    });

});
