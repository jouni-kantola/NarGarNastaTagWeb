var Commuter;
(function (Commuter) {
    (function (UI) {
        var commuterController;
        (function ($, controller) {
            $(document).bind('pageinit', function () {
                $('.nt-version').text('v1.11');
                $('.copyright').text('\u00a9 Jouni Kantola 2012');
            });
        })(jQuery, commuterController || (commuterController = new Commuter.Trains.CommuterController()));
    })(Commuter.UI || (Commuter.UI = {}));
    var UI = Commuter.UI;
})(Commuter || (Commuter = {}));
//@ sourceMappingURL=Loader.js.map
