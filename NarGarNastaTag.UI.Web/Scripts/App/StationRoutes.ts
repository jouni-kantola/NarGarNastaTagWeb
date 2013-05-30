/// <reference path="interfaces.d.ts" />

module Commuter.Trains.Entities {
    export class StationRoutes implements Interfaces.IStationRoutes {
        from: { name: string; id: string; };
        to: { routeId: string; name: string; id: string; }[];

        constructor () {
            this.from = { name: '', id: '' };
            this.to = new Array();
            this.to.push({ routeId: '', name: '', id: '' });
        }
    }

}