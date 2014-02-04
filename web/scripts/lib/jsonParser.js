define(function() {
    'use strict';

    function serialize(value) {
        if (value && JSON) {
            return JSON.stringify(value);
        }
        return '';
    }

    function deserialize(stringifiedValue) {
        if (JSON) {
            return JSON.parse(stringifiedValue);
        } else {
            return {};
        }
    }

    return {
        serialize: serialize,
        deserialize: deserialize
    };

});
