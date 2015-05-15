/// <reference path="declarations/javascript.global.functions.d.ts" />

class Logger {
    public log(errorText: string, exception: any) {
        if (window.console && console.log)
            console.log({ clearText: errorText, error: exception });
    }

    public inform(message: string) {
        if (window.console && console.log)
            console.log({ clearText: message });
    }

    public dump(anyObject: any) {
        if (window.console && console.log)
            console.log(anyObject);
    }
}

export = Logger;