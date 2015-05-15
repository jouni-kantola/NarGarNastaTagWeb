/// <reference path="../declarations/jquery.d.ts" />
/// <reference path="../Interfaces.ts" />
/// <reference path="../Commuter.ts" />
/// <reference path="../UrlHelper.ts" />
/// <reference path="../Logger.ts" />

import CommuterController = require('../Commuter');

class HomePage {
    private commuterController;
    
    load() {
        this.commuterController = new CommuterController();
        this.getFavouriteRoutes();
        $('.switchOrder').on('tap', function(event) {
            event.preventDefault();
            this.switchRoute(this);
        });
    }

    getFavouriteRoutes() {
        var routes: Interfaces.IRoute[] = this.commuterController.getRoutes();
        var $templateElement = $("#favouriteRouteItemTemplate").clone();
        $('#favouriteRoutes').html('').append($templateElement);
        $.each(routes, function() {
            var $newElement = $templateElement.clone();
            var $routeLink = $newElement.find('.routes');
            var href = $routeLink.prop('href');
            $routeLink.prop('href', href
                .replace('fromId', this.from.id)
                .replace('toId', this.to.id)
                .replace('http://' + window.location.host, ''));
            var $fromTag = $newElement.find('.from');
            $fromTag.text(this.from.name);
            var $toTag = $newElement.find('.to');
            $toTag.text(this.to.name)
            $newElement
                .appendTo($('#favouriteRoutes'))
                .fadeIn('slow');

        });
    }

    switchRoute(sender) {
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
        $routes.prop('href', url
            .replace('from/' + fromId, 'from/' + toId)
            .replace('to/' + toId, 'to/' + fromId)
            .replace('http://' + window.location.host, ''));
    }
}

$(document).bind('pageinit', function() {
    $('.nt-version').text('v1.3');
    $('.copyright').text('\u00a9 Jouni Kantola 2012');
    (new HomePage()).load();
});