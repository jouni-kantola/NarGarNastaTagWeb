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
                return JSON.parse(stringifiedValue);
            } else {
                return {};
            }
        } catch (ex) {
            console.log('Cannot deserialize: ' + stringifiedValue);
        }
    }

    return {
        serialize: serialize,
        deserialize: deserialize
    };

});
