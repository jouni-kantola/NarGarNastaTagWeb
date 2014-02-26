(function(require) {

    function getBody() {
        return document.getElementById('content');
    }
    function getCurrentViewPath(body) {
        return body.getAttribute('data-view');
    }

    function boostrapView(viewPath) {
        require([viewPath], function(view) {
            view.render();
        });
    }

    require(['config'], function(config) {
        var body = getBody();
        var viewPath = getCurrentViewPath(body);
        boostrapView(viewPath);
    });
})(require);
