define([
    'jquery',
    'rivets',
    'ajaxify',
    'bus',
    'models/index-model',
    'favourites'
], function($, rivets, ajaxify, bus, viewModel) {
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

    function subscribe(){
        bus.subscribe('data-favourites-listed', function(msg) {
            list(msg.data);
        });
        bus.subscribe('data-favourite-added', function(msg) {
            list(msg.data);
        });
        bus.subscribe('data-favourite-deleted', function(msg) {
            list(msg.data);
        });
    }

    function render() {
        subscribe();
        bus.publish('ui-favourites-listed');

        $('#favourites').on('click', '.route', function(e) {
            e.preventDefault();
            var $this = $(this),
                href = $this.prop('href'),
                from = $this.data('from-id'),
                to = $this.data('to-id'),
                url = href + '?/from/' + from + '/to/' + to;
            $this.prop('href', url);
            return true;
        });

        rivets.bind(body, {
            model: viewModel
        });
    }

    return {
        render: render
    };
});
