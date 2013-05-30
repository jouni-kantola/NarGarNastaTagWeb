/// <reference path="declarations/javascript.global.functions.d.ts" />
/// <reference path="declarations/jquery.d.ts" />
/// <reference path="interfaces.d.ts" />

module Commuter.Trains.Command {
    export class CookieStoreConfiguration implements Interfaces.IConfigureCookieStore {
        private cookieName: string;
        private expiryInDays: number;
        private mapper: Interfaces.IParseRoutes;
        constructor (cookieName: string, expiryInDays: number, mapper: Interfaces.IParseRoutes) {
            this.cookieName = cookieName;
            this.expiryInDays = expiryInDays;
            this.mapper = mapper;
        }
    }
}