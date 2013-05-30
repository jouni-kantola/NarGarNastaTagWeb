var Commuter;
(function (Commuter) {
    (function (Trains) {
        (function (Command) {
            var CookieStore = (function () {
                function CookieStore(configuration, parser) {
                    this.configuration = configuration;
                    this.parser = parser;
                }
                CookieStore.prototype.saveAll = function (routes) {
                    var cookieText = this.parser.serialize(routes);
                    var expiryDate = new Date();
                    expiryDate.setDate(expiryDate.getDate() + this.configuration.expiryInDays);
                    var formattedValue = escape(cookieText) + ((this.configuration.expiryInDays === null) ? '' : '; expires=' + expiryDate.toUTCString());
                    document.cookie = this.configuration.cookieName + "=" + formattedValue;
                };
                CookieStore.prototype.readAll = function () {
                    var browserCookies = document.cookie.split(';');
                    for(var i = 0; i < browserCookies.length; i++) {
                        var x = browserCookies[i].substr(0, browserCookies[i].indexOf('='));
                        var y = browserCookies[i].substr(browserCookies[i].indexOf('=') + 1);
                        x = x.replace(/^\s+|\s+$/g, '');
                        if(x === this.configuration.cookieName) {
                            var cookie = unescape(y);
                            if(cookie) {
                                return this.parser.deserialize(cookie);
                            } else {
                                return undefined;
                            }
                        }
                    }
                };
                CookieStore.prototype.remove = function () {
                    var expiryDate = new Date();
                    expiryDate.setDate(expiryDate.getDate() - 1);
                    var formattedValue = '; expires=' + expiryDate.toUTCString();
                    document.cookie = this.configuration.cookieName + "=" + formattedValue;
                };
                return CookieStore;
            })();
            Command.CookieStore = CookieStore;            
        })(Trains.Command || (Trains.Command = {}));
        var Command = Trains.Command;
    })(Commuter.Trains || (Commuter.Trains = {}));
    var Trains = Commuter.Trains;
})(Commuter || (Commuter = {}));
//@ sourceMappingURL=CookieStore.js.map
