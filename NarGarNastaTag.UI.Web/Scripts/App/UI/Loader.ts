/// <reference path="../declarations/jquery.d.ts" />
/// <reference path="../commuter.ts" />

module Commuter.UI {
    var commuterController: Commuter.Trains.CommuterController;

    (function ($, controller) {
        $(document).bind('pageinit', function () {
            $('.nt-version').text('v1.08');
            $('.copyright').text('\u00a9 Jouni Kantola 2012');
        });
    })(jQuery, commuterController || (commuterController = new Commuter.Trains.CommuterController()));
}