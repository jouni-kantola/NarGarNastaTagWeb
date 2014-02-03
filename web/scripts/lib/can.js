define([], function() {
    'use strict';

    return {
        use: {
            localStorage: (window && window.localStorage) || false,
            sessionStorage: (window && window.sessionStorage) || false
        }
    };

});
