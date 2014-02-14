(function(require) {
    require.config({
        baseUrl: '../../',
        paths: {
            jquery: 'scripts/vendor/jquery-2.0.3.min',
            history: 'scripts/vendor/jquery.history',
            bacon: '/scripts/vendor/bacon.min',
            q: 'scripts/vendor/q',
            lazy: 'scripts/vendor/lazy',
            rivets: 'scripts/vendor/rivets.min',
            xdomain: 'scripts/vendor/jQuery.XDomainRequest',
            ajaxify: 'scripts/lib/ajaxify-html5-modified',
            oompa: 'scripts/lib/oompa-loompa',
            cacheConfig: 'scripts/lib/clientCache-config',
            clientCache: 'scripts/lib/clientCache',
            cookieStore: 'scripts/lib/cookieStore',
            jsonParser: 'scripts/lib/jsonParser',
            bus: 'scripts/lib/bus',
            can: 'scripts/lib/can',
            tombola: 'scripts/lib/tombola',
            favourites: 'scripts/app/models/favourites',
            models: 'scripts/app/models',
            views: 'scripts/app/views'
        },
        shim: {
            'history': {
                exports: 'history'
            },
            'bacon': {
                exports: 'Bacon'
            },
            'lazy': {
                exports: 'Lazy'
            }
        }
    });
})(require);
