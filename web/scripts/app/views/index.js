define([
    'jquery',
    'oompa',
    'rivets',
    'ajaxify',
    'bus',
    'models/index-model',
    'favourites'
], function($, oompa, rivets, ajaxify, bus, viewModel) {
    'use strict';

    var body = document.getElementById('content');

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

        bus.subscribe('data-favourites-listed', function(msg) {
            list(msg.data);
        });
        bus.subscribe('data-favourite-added', function(msg) {
            list(msg.data);
        });
        bus.subscribe('data-favourite-deleted', function(msg) {
            list(msg.data);
        });
        bus.publish('ui-favourites-listed');

        $('#favourites').on('click', '.route', function(e) {
            e.preventDefault();
            bus.publish('ui-favourite-deleted', $(this).data('routeId'));
        });

        // oompa.get('http://nargarnastatagapi.apphb.com/query/date/20140125/route/825/from/74,U/to/74,CST');
            // oompa.getMany(['http://nargarnastatagapi.apphb.com/query/date/20140125/route/825/from/74,U/to/74,CST', 'http://nargarnastatagapi.apphb.com/query/date/20140125/route/825/from/74,U/to/74,CST']);
    }

    return {
        render: render
    };
});
