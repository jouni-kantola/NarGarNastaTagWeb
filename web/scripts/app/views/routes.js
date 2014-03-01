define([
    'jquery',
    'rivets',
    'ajaxify',
    'lazy',
    'bus',
    'oompa',
    'models/routes-model'
], function($, rivets, ajaxify, Lazy, bus, oompa, viewModel) {
    'use strict';

    var body = document.getElementById('content');

    function render() {
        rivets.bind(body, {
            model: viewModel
        });
        var apiUrl = 'http://nargarnastatagapi.apphb.com/query';
        var pattern = '\\/[\\d\\,\\wåäöÅÄÖ]+';
        var qs = decodeURIComponent(document.location.href);
        var match = new RegExp('from' + pattern).exec(qs);
        var from = match && match[0].replace('from/', '');
        match = new RegExp('to' + pattern).exec(qs);
        var to = match && match[0].replace('to/', '');
        oompa.get(apiUrl + '/station/' + from).then(function(routes) {
            var urls = new Lazy(routes).map(function(route) {
                return apiUrl + '/date/' + route.Date + '/route/' + route.RouteNo + '/from/' + from + '/to/' + to;
            }).toArray();
            oompa.getMany(urls, function(route){
                viewModel.routes.push.apply(viewModel.routes, route);
            });
        });
    }

    return {
        render: render
    };
});
