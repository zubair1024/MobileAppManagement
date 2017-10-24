"use strict";
/**
 * Message Handler Transformer
 */

const validate = require("validate.js"),
    camelcaseKeys = require('camelcase-keys');

/**
 * Define a schema for whitlisting and validation
 */
const constraints = {
    "Panic": {
        exclusion: {
            within: [true, false],
            message: "'%{value}' is not allowed"
        }
    },
    "Altitude": {
        numericality: true
    },
    "BatteryCharge": {
        exclusion: {
            within: [true, false, null],
            message: "'%{value}' is not allowed"
        }
    },
    "BatteryLevel": {
        numericality: true
    },
    "AssetName": {
        presence: true,
        length: {
            minimum: 1
        }
    },
    "GpsPoll": {
        exclusion: {
            within: [true, false, null],
            message: "'%{value}' is not allowed"
        }
    },
    "Heading": {
        numericality: true
    },
    "Ignition": {
        exclusion: {
            within: [true, false, null],
            message: "'%{value}' is not allowed"
        }
    },
    "Latitude": {
        numericality: true
    },
    "Longitude": {
        numericality: true
    },
    "Speed": {
        numericality: true
    },
    "Time": {
    },
    "UnixTime": {
        presence: true,
        numericality: true
    },
    "CannedMessage": {
        numericality: true
    },
    "Message": {
    },
    "UserNames": {
        length: {
            minimum: 1
        }
    }
};

module.exports = {
    /**
     * Whitelist and Validate the JSON Object
     */
    validate: function (data) {

        let whitelisted = validate.cleanAttributes(data, constraints);
        return validate(whitelisted, constraints);
    },
    /**
     * Transform the values of the objects 
     */
    transform: function (data) {

        for (let key in data) {
            switch (key) {
                case 'Speed':
                    data.speedInMps = (data.Speed) * 0.277778;
                    break;
                case 'AssetName':
                    data.imei = data.AssetName;
                    break;
                case 'UnixTime':
                    data.eventTime = new Date(data.UnixTime * 1000);
                    break;
            }
        }

        return camelcaseKeys(data);
    }
}