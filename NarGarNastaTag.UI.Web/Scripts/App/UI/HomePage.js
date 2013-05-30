var Commuter;
(function (Commuter) {
    (function (UI) {
        var commuterController;
        (function ($, controller) {
            $(document).bind('pageinit', function () {
            });
        })(jQuery, commuterController || (commuterController = new Commuter.Trains.CommuterController()));
        (function (HomePage) {
            function load() {
                getFavouriteRoutes();
                $('.switchOrder').on('tap', function (event) {
                    event.preventDefault();
                    switchRoute(this);
                });
            }
            HomePage.load = load;
            function getFavouriteRoutes() {
                var routes = commuterController.getRoutes();
                var $templateElement = $("#favouriteRouteItemTemplate").clone();
                $('#favouriteRoutes').html('').append($templateElement);
                $.each(routes, function () {
                    var $newElement = $templateElement.clone();
                    var $routeLink = $newElement.find('.routes');
                    var href = $routeLink.prop('href');
                    $routeLink.prop('href', href.replace('fromId', this.from.id).replace('toId', this.to.id).replace('http://' + window.location.host, ''));
                    var $fromTag = $newElement.find('.from');
                    $fromTag.text(this.from.name);
                    var $toTag = $newElement.find('.to');
                    $toTag.text(this.to.name);
                    $newElement.appendTo($('#favouriteRoutes')).fadeIn('slow');
                });
            }
            function switchRoute(sender) {
                var $parent = $(sender).parent();
                var $from = $parent.find('span.from');
                var fromText = $from.text();
                var $to = $parent.find('span.to');
                var toText = $to.text();
                $from.text(toText);
                $to.text(fromText);
                var $routes = $parent.find('a.routes');
                var url = decodeURIComponent($routes.prop('href'));
                var match = RegExp('from\\/[\\d\\,\\wåäöÅÄÖ]+').exec(url);
                var fromId = match && match[0].replace('from/', '');
                match = RegExp('to\\/[\\d\\,\\wåäöÅÄÖ]+').exec(url);
                var toId = match && match[0].replace('to/', '');
                $routes.prop('href', url.replace('from/' + fromId, 'from/' + toId).replace('to/' + toId, 'to/' + fromId).replace('http://' + window.location.host, ''));
            }
        })(UI.HomePage || (UI.HomePage = {}));
        var HomePage = UI.HomePage;
    })(Commuter.UI || (Commuter.UI = {}));
    var UI = Commuter.UI;
})(Commuter || (Commuter = {}));
//@ sourceMappingURL=HomePage.js.map
