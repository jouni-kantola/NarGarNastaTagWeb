/// <reference path="declarations/javascript.global.functions.d.ts" />
/// <reference path="declarations/jquery.d.ts" />
/// <reference path="Interfaces.ts" />

module Commuter.Command {
    export class CookieStoreConfiguration implements Interfaces.IConfigureCookieStore {
        cookieName: string;
        expiryInDays: number;
        mapper: Interfaces.IParseRoutes;
        constructor (cookieName: string, expiryInDays: number, mapper: Interfaces.IParseRoutes) {
            this.cookieName = cookieName;
            this.expiryInDays = expiryInDays;
            this.mapper = mapper;
        }
    }
}