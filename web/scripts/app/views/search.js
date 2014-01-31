define(function(require) {
    'use strict';

    var $ = require('jquery'),
        oompa = require('oompa'),
        rivets = require('rivets'),
        clientCache = require('clientCache'),
        viewModel = require('models/search-model');

    function populateStations() {
        return clientCache.getStations();
        // oompa.get('http://nargarnastatagapi.apphb.com/query/stations')
        //     .then(function(data) {
        //         stations = data;
        //     });
    }

    function confirmSelection(controlId, text, id) {
        $('#' + controlId).val(text);
        viewModel[controlId] = id;
        console.log(viewModel);
    }

    function renderView(viewModel) {
        if(viewModel === undefined) throw new Error('viewModel is undefined.');
        $('.search').on('input', function(e) {
            var searchBox = e.target,
                query = searchBox.value.toLowerCase(),
                searchBoxIsEmpty = query.length === 0;

            if (searchBoxIsEmpty) {
                viewModel.searchResults.splice(0, searchResults.length);
            } else {
                viewModel.searchResults.splice(0, searchResults.length);
                stations.filter(function(station) {
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
    }

    function bind(viewModel){
        rivets.bind($('#content'), {
            model: viewModel
        });
    }

    return {
        populate: populateStations,
        render: renderView,
        bind: bind
    };
});