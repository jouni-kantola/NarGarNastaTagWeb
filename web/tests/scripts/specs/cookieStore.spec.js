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

        describe('readCookie()', function() {
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
                    expectedCookie = cookieName + '=' + JSON.stringify(anObject) + ';';

                fakeAndStub(cookieName);

                document.cookie = expectedCookie;
                var deserializedCookie = cookieStore.readCookie();
                var expected = JSON.stringify(anObject);
                var actual = JSON.stringify(deserializedCookie);
                expected.should.equal(actual);
            });
        });

        describe('saveCookie()', function() {});

        describe('deleteCookie()', function() {});
    });

});
