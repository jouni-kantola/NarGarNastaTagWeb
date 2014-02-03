define(['cacheConfig', 'clientCache', 'cookieStore', 'can'], function(cacheConfig, clientCache, cookieStore, can) {
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
            it('should cache stations to sessionStorage', function() {
                var store = {},
                    sessionStorageKey,
                    routes = {
                        route: 'a route'
                    },
                    expected;
                sandbox.stub(can.use, 'sessionStorage', true);
                sandbox.stub(window.sessionStorage, 'setItem', function(key, value) {
                    store[key] = value;
                    sessionStorageKey = key;
                });
                clientCache.cacheStations(routes);
                expected = JSON.parse(store[sessionStorageKey]);
                expected.should.deep.equal(routes);
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
                sandbox.stub(cacheConfig, 'cookieName', cookieName);
                var putStub = sandbox.stub(cookieStore, 'put', function(value) {
                    JSON.stringify(value).should.equal(JSON.stringify(routes));
                });

                clientCache.cacheFavourites(routes);
                putStub.should.have.been.calledWith(routes);

                sandbox.restore();
            });
        });

        describe('migrateCaching()', function() {
            it('should shift caching from cookies to localStorage', function() {
                var cookieName = 'test_cookie',
                    routes = {
                        route: 'a route'
                    },
                    store = {},
                    localStorageKey;

                sandbox.stub(cacheConfig, 'cookieName', cookieName);
                var getStub = sandbox.stub(cookieStore, 'get', function() {
                    return routes;
                });
                var removeStub = sandbox.stub(cookieStore, 'remove');
                sandbox.stub(can.use, 'localStorage', true);
                sandbox.stub(localStorage, 'getItem', function(value) {
                    return undefined;
                });
                var setItemStub = sandbox.stub(window.localStorage, 'setItem', function(key, value) {
                    store[key] = value;
                    localStorageKey = key;
                });

                clientCache.migrateCaching();

                getStub.should.have.been.calledBefore(setItemStub);
                setItemStub.should.have.been.calledWithMatch(localStorageKey, routes.route);
                removeStub.should.have.been.calledAfter(setItemStub);
                JSON.parse(store[localStorageKey]).route.should.deep.equal(routes.route);

                sandbox.restore();
            });
        });
    });
});
