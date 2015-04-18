var config = require('./config');
var http = require('./util/http');
var date = require('./util/date');

var api = {
    timetable: {
        for: {
            station: (station) => http(config.api + '/station/' + station).get()
        },
        from: (from) => {
            return {
                to: (to) => http(config.api + '/date/' + date().toShortDate() + '/route/8418/from/' + from + '/to/' + to).get()
            };
        }
    }
};

// B-> Here you define its functions and its payload
var callback = {
    success: function(data) {
        console.log(1, 'success', JSON.parse(data));
    },
    error: function(data) {
        console.log(2, 'error', JSON.parse(data));
    }
};
// End B

// Executes the method call
api.timetable.from('74,U').to('74,CST')
    .then(callback.success)
    .catch(callback.error);
