/// <reference path="Interfaces.ts" />

module Commuter.Query {

    export class YqlQueryExecutor implements Interfaces.IQueryRemoteRoutes {
        query(xmlHttpRequestExecutor: any, url: string, xpath: string, callback: Function) {
            if (!url || !xpath) throw 'URL and XPATH must be set for YQL query';
            if (!xmlHttpRequestExecutor.hasOwnProperty('getJSON')) throw 'getJSON is expected for remote query';
            var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent("select * from html where url='" + url + "' and xpath='" + xpath) + "'&format=json&callback=?";
            xmlHttpRequestExecutor.getJSON(yql, function (result) {
                callback && callback(result);
            });
        }
    }
}