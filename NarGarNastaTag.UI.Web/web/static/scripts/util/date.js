'use strict';

var now = () => {

    let date = new Date();
    let dd = date.getDate();
    let mm = date.getMonth() + 1; //January is 0!
    let year = date.getFullYear();

    return {
        toShortDate: () => {
            var day = dd;
            var month = mm;
            if (dd < 10) {
                day = '0' + dd;
            }

            if (mm < 10) {
                month = '0' + mm;
            }

            return year + month + day;
        }
    };
};

module.exports = now;
