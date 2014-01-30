define([], function() {
    'use strict';

    function serialize(value) {
        if (value && JSON) {
            return JSON.stringify(value);
        }
        return '';
    }

    function deserialize(stringifiedValue) {
        try {
            if (JSON) {
                var routes = JSON.parse(stringifiedValue);
                return routes;
            } else {
                return {};
            }
        } catch (ex) {
            console.log('Cannot deserialize routes.');
        }
    }

    return {
        serialize: serialize,
        deserialize: deserialize
    };

});
