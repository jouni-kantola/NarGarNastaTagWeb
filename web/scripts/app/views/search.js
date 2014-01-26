define(function(require) {
    'use strict';

    var $ = require('jquery'),
        oompa = require('oompa');

    function renderView() {
		console.log('search rendering...');
        var promise = oompa.get('http://nargarnastatagapi.apphb.com/query/stations');
        promise.then(function(data) {
            console.log(data);
        });

        $('.search').on('input', function(e) {
            console.log(e.target);
        });
    }
    return {
        render: renderView
    };
});