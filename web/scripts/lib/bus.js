define(['bacon'], function(Bacon) {
    'use strict';

    var bus = new Bacon.Bus();

    function publish(msg, data) {
        bus.push({
            msg: msg,
            data: data
        });
    }

    return {
        publish: publish,
        when: bus
    };

});
