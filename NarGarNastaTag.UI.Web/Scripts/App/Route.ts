/// <reference path="interfaces.ts" />

module Commuter.Entities {
    export class Route implements Interfaces.IRoute {
        routeId: string;
        from: { name: string; id: string; };
        to: { name: string; id: string; };

        constructor () {
            this.from = { name: '', id: '' };
            this.to = { name: '', id: '' };
        }
    }
}