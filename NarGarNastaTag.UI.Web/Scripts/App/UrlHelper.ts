/// <reference path="declarations/javascript.global.functions.d.ts" />

module Commuter.Trains.Common {
    export class UrlHelper {
        public static getQueryStringParameterByName(url, name) {
            var match = RegExp('[?&]' + name + '=([^&]*)').exec(url);
            return match && match[1].replace(/\+/g, ' ');
        }
    }
}