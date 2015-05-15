/// <reference path="declarations/javascript.global.functions.d.ts" />

class UrlHelper {
	public static getQueryStringParameterByName(url, name) {
		var match = RegExp('[?&]' + name + '=([^&]*)').exec(url);
		return match && match[1].replace(/\+/g, ' ');
	}
}

export = UrlHelper;
