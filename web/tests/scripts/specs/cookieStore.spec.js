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
