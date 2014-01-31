(function(require) {
    function getCurrentViewPath() {
        return document.getElementById('content').getAttribute('data-view');
    }

    function boostrapView(viewPath) {
        require([viewPath], function(view) {
            view.render();
        });
    }
    
    require(['config'], function(config) {
        var viewPath = getCurrentViewPath();
        boostrapView(viewPath);
    });
})(require);