var Commuter;
(function (Commuter) {
    /// <reference path="../declarations/jquery.d.ts" />
    /// <reference path="../commuter.ts" />
    (function (UI) {
        var commuterController;

        (function ($, controller) {
            $(document).bind('pageinit', function () {
                $('.nt-version').text('v1.2');
                $('.copyright').text('\u00a9 Jouni Kantola 2012');
            });
        })(jQuery, commuterController || (commuterController = new Commuter.Trains.CommuterController()));
    })(Commuter.UI || (Commuter.UI = {}));
    var UI = Commuter.UI;
})(Commuter || (Commuter = {}));
