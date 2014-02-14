define(['q', 'lazy'], function(Q, Lazy) {
    'use strict';

    var deferred = Q.defer();

    return {
        stations: [],
        searchResults: [],
        selection: {
            from: {
                name: '',
                id: ''
            },
            to: {
                name: '',
                id: ''
            }
        },
        favourites: [],
        setSelection: function(target, id) {
            this.selection[target].id = id;
            this.selection[target].name = new Lazy(this.stations).find(function(station) {
                return station.Id.toUpperCase() === id.toUpperCase();
            }).Name;
            if ((this.selection.from.id && this.selection.to.id) && (this.selection.from.id !== this.selection.to.id)) {
                deferred.resolve(this.selection);
            }
            return deferred.promise;
        }
    };
});
