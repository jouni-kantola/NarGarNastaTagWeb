(function(require) {
    require.config({
        baseUrl: '../../',
        paths: {
            jquery: 'scripts/vendor/jquery-2.0.3.min',
            history: 'scripts/vendor/jquery.history',
            q: 'scripts/vendor/q',
            rivets: 'scripts/vendor/rivets.min',
            xdomain: 'scripts/vendor/jQuery.XDomainRequest',
            ajaxify: 'scripts/lib/ajaxify-html5-modified',
            oompa: 'scripts/lib/oompa-loompa',
            clientCache: 'scripts/lib/clientCache',
            cacheConfig: 'scripts/lib/clientCache-config',
            jsonParser: 'scripts/lib/jsonParser',
            can: 'scripts/lib/can',
            models: 'scripts/app/models',
            views: 'scripts/app/views'
        },
        shim: {
            mocha: {
                history: 'history'
            }
        }
    });
})(require);
