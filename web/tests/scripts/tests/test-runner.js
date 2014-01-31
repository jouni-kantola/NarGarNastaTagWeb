require.config({
    paths: {
        app: '../../../scripts/app',
        lib: '../../scripts/lib',
        framework: '../../../tests/scripts/vendor',
        tests: 'tests/scripts/tests'
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
    require([
            'tests/search-tests',
            'tests/clientCache-tests'
        ],
        function() {
            mocha.run();
        });

});