require.config({
    paths: {
        app: '../../../scripts/app',
        libs: '../../scripts/lib',
        testLibs: '../../../tests/scripts/lib',
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