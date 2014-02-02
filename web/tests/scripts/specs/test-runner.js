require.config({
    paths: {
        app: '../../../scripts/app',
        lib: '../../scripts/lib',
        framework: '../../../tests/scripts/vendor',
        specs: 'tests/scripts/specs'
    },
    shim: {
        mocha: {
            exports: 'mocha'
        }
    }
});


define(['app/config'], function(config) {
    var should = chai.should();
    mocha.setup('bdd');
    require(
        [
            'specs/search.spec',
            'specs/clientCache.spec'
        ], mocha.run);
});
