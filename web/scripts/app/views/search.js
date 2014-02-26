define(['require', 'jquery', 'oompa', 'rivets', 'ajaxify', 'clientCache', 'models/search-model', 'favourites', 'lazy', 'bacon', 'bus'],
    function(require, $, oompa, rivets, ajaxify, clientCache, viewModel, favourites, Lazy, Bacon, bus) {
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
            viewModel.setSelection(controlId, id).then(function(selection) {
                favourites.add(selection.from, selection.to);
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

            $('#favourites').on('click', '.unfavourize', function(e){
                e.preventDefault();
                var $selection = $(this);
                favourites.remove($selection.data('routeId'));
            });
        }

        function search(query) {
            return new Lazy(viewModel.stations).filter(function(station) {
                return !!query && station.Name.toLowerCase().indexOf(query) === 0;
            });
        }

        function renderView(stations) {
            if (stations === undefined) throw new Error('stations is undefined.');
            viewModel.stations = stations;
            bus.subscribe('data-favourite-added', function(msg) {
                viewModel.favourites = new Lazy(msg.data).map(function(favourite) {
                    return new Lazy(favourite.to).map(function(destination) {
                        return {
                            from: favourite.from,
                            to: destination
                        };
                    });
                }).flatten().toArray();
            });
            bus.subscribe('data-favourite-deleted', function(msg) {
                viewModel.favourites = new Lazy(msg.data).map(function(favourite) {
                    return new Lazy(favourite.to).map(function(destination) {
                        return {
                            from: favourite.from,
                            to: destination
                        };
                    });
                }).flatten().toArray();
            });
            attachSearch();
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
