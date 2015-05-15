/// <reference path="declarations/javascript.global.functions.d.ts" />
/// <reference path="declarations/jquery.d.ts" />
/// <reference path="Interfaces.ts" />

class CookieStore implements Interfaces.IRouteRepository {
    private configuration: Interfaces.IConfigureCookieStore;
    private parser: Interfaces.IParseRoutes;

    constructor(configuration: Interfaces.IConfigureCookieStore, parser: Interfaces.IParseRoutes) {
        this.configuration = configuration;
        this.parser = parser;
    }

    saveAll(routes: Interfaces.IStationRoutes[]) {
        var cookieText: string = this.parser.serialize(routes);
        var expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + this.configuration.expiryInDays);
        var formattedValue: string = escape(cookieText) + ((this.configuration.expiryInDays === null) ? '' : '; expires=' + expiryDate.toUTCString());
        document.cookie = this.configuration.cookieName + "=" + formattedValue;
    }

    readAll(): Interfaces.IStationRoutes[] {
        var browserCookies: string[] = document.cookie.split(';');
        for (var i: number = 0; i < browserCookies.length; i++) {
            var x: string = browserCookies[i].substr(0, browserCookies[i].indexOf('='));
            var y: string = browserCookies[i].substr(browserCookies[i].indexOf('=') + 1);
            x = x.replace(/^\s+|\s+$/g, '');
            if (x === this.configuration.cookieName) {
                var cookie: string = unescape(y);
                if (cookie)
                    return this.parser.deserialize(cookie);
                else
                    return undefined;
            }
        }
    }

    remove() {
        var expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() - 1);
        var formattedValue: string = '; expires=' + expiryDate.toUTCString();
        document.cookie = this.configuration.cookieName + "=" + formattedValue;
    }
}

export = CookieStore;