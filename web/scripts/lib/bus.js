define(['bacon', 'lazy'], function(Bacon, Lazy) {
    'use strict';

    var bus = new Bacon.Bus(),
        subscriptions = {};

    bus.onValue(function(message) {
        new Lazy(subscriptions[message.msg]).each(function(eventHandler) {
            eventHandler(message);
        });
    });

    function publish(msg, data) {
        bus.push({
            msg: msg,
            data: data
        });
    }

    function subscribe(msg, eventHandler) {
        if (!subscriptions.hasOwnProperty(msg)) {
            subscriptions[msg] = [];
        }
        subscriptions[msg].push(eventHandler);
    }

    function unsubscribe(msg, subscriber) {
        if (subscriptions.hasOwnProperty(msg)) {
            subscriptions[msg] = new Lazy(subscriptions[msg]).filter(function(subsciption){
                return subsciption.subscriber !== subscriber;
            });
        }
    }

    return {
        publish: publish,
        subscribe: subscribe
    };

});
