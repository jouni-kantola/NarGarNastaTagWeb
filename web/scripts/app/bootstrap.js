(function(require) {
    function getCurrentViewPath() {
        return document.getElementById('content').getAttribute('data-view');
    }

    function boostrapView(viewPath) {
        require([viewPath], function(view) {
            var data = view.populate();
            var viewModel = view.render(data);
            view.bind(viewModel);
        });
    }

    require(['config'], function(config) {
        var viewPath = getCurrentViewPath();
        boostrapView(viewPath);
    });
})(require);
