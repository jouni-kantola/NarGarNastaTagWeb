define(['require', 'jquery', 'oompa', 'rivets', 'ajaxify', 'clientCache', 'models/search-model'], function(require, $, oompa, rivets, ajaxify, clientCache, viewModel) {
    'use strict';

    function populate() {
        // oompa.get('http://nargarnastatagapi.apphb.com/query/stations')
        //     .then(function(data) {
        //         stations = data;
        //         clientCache.cacheStations(stations);
        //     });
        return clientCache.getStations();
    }

    function confirmSelection(controlId, text, id) {
        $('#' + controlId).val(text);
        viewModel[controlId] = id;
    }

    function renderView(stations) {
        if (stations === undefined) throw new Error('stations is undefined.');
        viewModel.stations = stations;
        $('.search').on('input', function(e) {
            var searchBox = e.target,
                query = searchBox.value.toLowerCase(),
                searchBoxIsEmpty = query.length === 0;

            if (searchBoxIsEmpty) {
                viewModel.searchResults.splice(0, searchResults.length);
            } else {
                viewModel.searchResults.splice(0, searchResults.length);
                viewModel.stations.filter(function(station) {
                    return station.Name.toLowerCase().indexOf(query) === 0;
                }).forEach(function(station) {
                    station.direction = searchBox.id;
                    viewModel.searchResults.push(station);
                });
            }
            viewModel.searchResults.length = 0;
        });

        $('#searchResults').on('click', '.station', function(e) {
            e.preventDefault();
            var $selection = $(this);
            confirmSelection($selection.data('direction'), $selection.text(), $selection.data('id'));
            viewModel.searchResults.splice(0, searchResults.length);
        });
        return viewModel;
    }

    function bind(viewModel) {
        rivets.bind($('#content'), {
            model: viewModel
        });
    }

    return {
        populate: populate,
        render: renderView,
        bind: bind
    };
});
