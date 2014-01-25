requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: './scripts/lib',
    paths: {
        app: '../app',
        jquery: 'jquery-2.0.3.min',
        history: 'history.adapter.jquery-modified',
        ajaxify: 'ajaxify-html5-modified'
    }
});

requirejs(['app/index', 'ajaxify']);