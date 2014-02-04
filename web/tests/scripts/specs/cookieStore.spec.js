define(['cacheConfig', 'cookieStore'], function(cacheConfig, cookieStore) {
    'use strict';

    describe('cookieStore', function() {
        var sandbox;
        beforeEach(function() {
            function cleanCookies() {
                var cookies = document.cookie.split(';');
                return cookies.forEach(function(cookie) {
                    var name = cookie.substr(0, cookie.indexOf('='));
                    deleteCookie(name);
                });
            }

            function deleteCookie(cookieName) {
                var expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() - 1);
                var formattedValue = '; expires=' + expiryDate.toUTCString();
                document.cookie = cookieName + "=" + formattedValue;
            }

            sandbox = sinon.sandbox.create();
            cleanCookies();

        });

        afterEach(function() {
            // restore the environment as it was before
            sandbox.restore();
        });

        describe('get()', function() {
            it('should read and deserialize cookie', function() {
                function fakeAndStub(cookieName) {
                    var otherCookies = '01_another_cookie1=anotherCookie1Value;02_another_cookie2=anotherCookie2Value;';
                    otherCookies.split(';').forEach(function(cookie) {
                        document.cookie = cookie.trim();
                    });
                    sandbox.stub(cacheConfig, 'cookieName', cookieName);
                }

                var cookieName = 'test_cookie',
                    anObject = {
                        aProperty: 'withValue'
                    },
                    expectedCookie = cookieName + '=' + JSON.stringify(anObject);

                fakeAndStub(cookieName);

                document.cookie = expectedCookie;
                var deserializedCookie = cookieStore.get();
                var expected = JSON.stringify(anObject);
                var actual = JSON.stringify(deserializedCookie);
                expected.should.equal(actual);
            });

            it('should handle deserialization of cookie for migration', function() {
                function fakeAndStub(cookieName) {
                    var otherCookies = '01_another_cookie1=anotherCookie1Value;02_another_cookie2=anotherCookie2Value;';
                    otherCookies.split(';').forEach(function(cookie) {
                        document.cookie = cookie.trim();
                    });
                    sandbox.stub(cacheConfig, 'cookieName', cookieName);
                }

                var cookieName = 'test_cookie',
                    routes = [{
                        "from": {
                            "name": "Uppsala C",
                            "id": "74,U"
                        },
                        "to": [{
                            "routeId": "1381956031073-26810-17319",
                            "name": "Stockholm C",
                            "id": "74,CST"
                        }, {
                            "routeId": "1391471035932-13502-20488",
                            "name": "Morgongåva",
                            "id": "74,MÅ"
                        }]
                    }, {
                        "from": {
                            "name": "Stockholm C",
                            "id": "74,CST"
                        },
                        "to": [{
                            "routeId": "1391471049078-29042-19135",
                            "name": "Malmö C",
                            "id": "74,M"
                        }]
                    }],
                    expectedCookie = cookieName + '=' + 
                         '%5B%7B%22from%22%3A%7B%22name%22%3A%22Uppsala' +
                         '%20C%22%2C%22id%22%3A%2274%2CU%22%7D%2C%22to%' +
                         '22%3A%5B%7B%22routeId%22%3A%221381956031073-2' +
                         '6810-17319%22%2C%22name%22%3A%22Stockholm%20C' +
                         '%22%2C%22id%22%3A%2274%2CCST%22%7D%2C%7B%22ro' +
                         'uteId%22%3A%221391471035932-13502-20488%22%2C' +
                         '%22name%22%3A%22Morgong%E5va%22%2C%22id%22%3A' +
                         '%2274%2CM%C5%22%7D%5D%7D%2C%7B%22from%22%3A%7' +
                         'B%22name%22%3A%22Stockholm%20C%22%2C%22id%22%' +
                         '3A%2274%2CCST%22%7D%2C%22to%22%3A%5B%7B%22rou' +
                         'teId%22%3A%221391471049078-29042-19135%22%2C%' +
                         '22name%22%3A%22Malm%F6%20C%22%2C%22id%22%3A%2' +
                         '274%2CM%22%7D%5D%7D%5D';

                fakeAndStub(cookieName);

                document.cookie = expectedCookie;
                var deserializedCookie = cookieStore.get();
                routes.should.deep.equal(deserializedCookie);
            });
        });

        describe('put()', function() {
            it('should read and deserialize cookie', function() {
                function fakeAndStub(cookieName) {
                    var otherCookies = '01_another_cookie1=anotherCookie1Value;02_another_cookie2=anotherCookie2Value;';
                    otherCookies.split(';').forEach(function(cookie) {
                        document.cookie = cookie.trim();
                    });
                    sandbox.stub(cacheConfig, 'cookieName', cookieName);
                }

                var cookieName = 'test_cookie',
                    anObject = {
                        aProperty: 'withValue'
                    },
                    expectedCookie = cookieName + '=' + JSON.stringify(anObject);

                fakeAndStub(cookieName);

                document.cookie.split(';').length.should.equal(2);
                document.cookie.indexOf(cookieName).should.equal(-1);
                cookieStore.put(anObject);
                document.cookie.split(';').length.should.equal(3);
                document.cookie.indexOf(cookieName).should.be.greaterThan(0);
            });
        });

        describe('remove()', function() {
            it('should expire and thereby delete cookie', function() {
                function fakeAndStub(cookieName) {
                    var otherCookies = '01_another_cookie1=anotherCookie1Value;02_another_cookie2=anotherCookie2Value;';
                    otherCookies.split(';').forEach(function(cookie) {
                        document.cookie = cookie.trim();
                    });
                    sandbox.stub(cacheConfig, 'cookieName', cookieName);
                }

                var cookieName = 'test_cookie',
                    expectedCookie = cookieName + '=cookiesValue';

                fakeAndStub(cookieName);

                document.cookie = expectedCookie;
                document.cookie.split(';').length.should.equal(3);
                cookieStore.remove();
                document.cookie.split(';').length.should.equal(2);
                document.cookie.split(';').forEach(function(cookie) {
                    cookie.should.not.contain(cookieName);
                });
            });
        });
    });

});
