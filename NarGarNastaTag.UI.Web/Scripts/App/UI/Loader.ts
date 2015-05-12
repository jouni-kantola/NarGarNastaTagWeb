/// <reference path="../declarations/jquery.d.ts" />
/// <reference path="../Commuter.ts" />

var CommuterController = require('../Commuter');
var homePage = require('./HomePage');
var favoritesPage = require('./FavoritesPage');
//var routesPage = require('./RoutesPage');
var trainPage = require('./TrainPage');

module Loader {
    $(document).bind('pageinit', function () {
            $('.nt-version').text('v1.3');
            $('.copyright').text('\u00a9 Jouni Kantola 2012');
        });
    (new homePage()).load();
}