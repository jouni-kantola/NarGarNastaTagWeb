define([
    'require',
    'jquery',
    'oompa',
    'rivets',
    'ajaxify',
    'clientCache',
    'models/search-model',
    'favourites',
    'lazy',
    'bacon',
    'bus'
], function(require, $, oompa, rivets, ajaxify, clientCache, viewModel, favourites, Lazy, Bacon, bus) {
    'use strict';
    
    var body = document.getElementById('content');

    function confirmSelection(controlId, text, id) {
        $('#' + controlId).val(text);
        viewModel.setSelection(controlId, id).then(function(selection) {
            bus.publish('ui-favourite-added', {
                from: selection.from,
                to: selection.to
            });
        });
    }

    function attachSearch() {
        $('.search')
            .asEventStream('input')
            .map(function(event) {
                return search(event.target.value.toLowerCase())
                    .map(function(station) {
                        return {
                            direction: event.target.id,
                            name: station.Name,
                            id: station.Id
                        };
                    }).toArray();
            })
            .assign(function(searchResults) {
                viewModel.searchResults = searchResults;
            });

        $('#searchResults').on('click', '.station', function(e) {
            e.preventDefault();
            var $selection = $(this);
            confirmSelection($selection.data('direction'), $selection.text(), $selection.data('id'));
            viewModel.searchResults = [];
        });

        $('#favourites').on('click', '.unfavourize', function(e) {
            e.preventDefault();
            bus.publish('ui-favourite-deleted', $(this).data('routeId'));
        });
    }

    function search(query) {
        return new Lazy(viewModel.stations).filter(function(station) {
            return !!query && station.Name.toLowerCase().indexOf(query) === 0;
        });
    }

    function list(favourites) {
        viewModel.favourites = new Lazy(favourites).map(function(favourite) {
            return new Lazy(favourite.to).map(function(destination) {
                return {
                    from: favourite.from,
                    to: destination
                };
            });
        }).flatten().toArray();
    }

    function render() {
        rivets.bind(body, {
            model: viewModel
        });
        viewModel.stations = clientCache.getStations();
        bus.subscribe('data-favourites-listed', function(msg) {
            list(msg.data);
        });
        bus.subscribe('data-favourite-added', function(msg) {
            list(msg.data);
        });
        bus.subscribe('data-favourite-deleted', function(msg) {
            list(msg.data);
        });
        attachSearch();
        bus.publish('ui-favourites-listed');
    }

    return {
        render: render
    };
});
