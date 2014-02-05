define(function() {
    'use strict';

    function id() {
        var partOne = new Date().getTime();
        var partTwo = 1 + Math.floor((Math.random() * 32767));
        var partThree = 1 + Math.floor((Math.random() * 32767));
        return partOne + '-' + partTwo + '-' + partThree;
    }

    function int(min, max) {
        return Math.floor(Math.random() * (1 + max - min)) + min;
    }

    return {
        id: id,
        int: int
    };
});
