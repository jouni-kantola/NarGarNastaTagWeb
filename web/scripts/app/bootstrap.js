(function(require) {
    function getCurrentViewName() {
        return document.getElementById('content').getAttribute('data-view');
    }

    function boostrapView(viewName) {
        require(['app/views/' + viewName], function(view) {
            view.render();
        });
    }

    require.config({
        //By default load any module IDs from js/lib
        baseUrl: './scripts/lib',
        paths: {
            app: '../app',
            jquery: 'jquery-2.0.3.min',
            history: 'history.adapter.jquery-modified',
            ajaxify: 'ajaxify-html5-modified',
            xdomain: 'jQuery.XDomainRequest',
            oompa: 'oompa-loompa'
        }
    });

    require(['ajaxify'], function() {
        var viewName = getCurrentViewName();
        boostrapView(viewName);
    });
})(require);
