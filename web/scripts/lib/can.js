define([], function() {
    'use strict';

    return {
        use: {
            debug: document.location.hostname === 'localhost' || false,
            localStorage: (window && window.localStorage) || false,
            sessionStorage: (window && window.sessionStorage) || false
        }
    };

});
