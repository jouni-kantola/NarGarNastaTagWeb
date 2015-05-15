/// <reference path="interfaces.ts" />

class Route implements Interfaces.IRoute {
	routeId: string;
	from: { name: string; id: string; };
	to: { name: string; id: string; };

	constructor() {
		this.from = { name: '', id: '' };
		this.to = { name: '', id: '' };
	}
}

export = Route;