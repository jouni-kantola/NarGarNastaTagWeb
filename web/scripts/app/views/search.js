define(function(require) {
    'use strict';

    var $ = require('jquery'),
        oompa = require('oompa'),
        rivets = require('rivets'),
        stations,
        searchResults = [];

    function renderView() {
        if (!stations) {
            var promise = oompa.get('http://nargarnastatagapi.apphb.com/query/stations');
            promise.then(function(data) {
                stations = data;
            });
        }

        $('.search').on('input', function(e) {
            var $searchBox = $(e.target),
                query = $searchBox.val().toLowerCase(),
                searchBoxIsEmpty = query.length === 0;

            if (searchBoxIsEmpty) {
				searchResults.splice(0, searchResults.length);
            } else {
                stations.filter(function(station) {
                    return station.Name.toLowerCase().indexOf(query) === 0;
                }).forEach(function(station) {
                    searchResults.push(station);
                });
            }
            searchResults.length = 0;
        });

        rivets.bind($('#searchResults'), {
            searchResults: searchResults
        });
    }
    return {
        render: renderView
    };
});
