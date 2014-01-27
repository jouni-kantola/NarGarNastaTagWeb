(function(require) {
    function getCurrentViewPath() {
        return document.getElementById('content').getAttribute('data-view');
    }

    function boostrapView(viewPath) {
        require([viewPath], function(view) {
            view.render();
        });
    }

    require.config({
        //By default load any module IDs from js/lib
        baseUrl: './scripts/lib',
        paths: {
            app: '../app',
            jquery: 'jquery-2.0.3.min',
            history: 'jquery.history',
            ajaxify: 'ajaxify-html5-modified',
            xdomain: 'jQuery.XDomainRequest',
            oompa: 'oompa-loompa',
            rivets: 'rivets.min'
        }
    });

    require(['jquery', 'history', 'ajaxify'], function() {
        var viewPath = getCurrentViewPath();
        boostrapView(viewPath);
    });
})(require);
