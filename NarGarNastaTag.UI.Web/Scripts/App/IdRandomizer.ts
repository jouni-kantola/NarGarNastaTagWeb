/// <reference path="interfaces.d.ts" />

module Commuter.Trains.Common {
    export class IdRandomizer implements Interfaces.IGenerateId {

        getId() { 
            var partOne = new Date().getTime();
            var partTwo = 1 + Math.floor((Math.random() * 32767));
            var partThree = 1 + Math.floor((Math.random() * 32767));
            return partOne + '-' + partTwo + '-' + partThree;
        }

        getRandomRangedInteger(minimum: number, maximum: number) {
            return Math.floor(Math.random() * (1 + maximum - minimum)) + minimum;
        }
    }
}