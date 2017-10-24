"use strict";

var mongoose = require("mongoose"),
  mongoosePaginate = require("mongoose-paginate"),
  Schema = mongoose.Schema;

var sensorMessageEventSchema = new Schema({
  objectType: { type: String, required: true, default: "Sensor Message Event" },
  _asset: { type: Schema.Types.ObjectId, ref: "Asset" },
  _ancestor: { type: Schema.Types.ObjectId, ref: "RawMessageEvent" },
  imei: String,
  eventType: String,
  configType: String,
  time: String,
  date: String,
  latitude: Number,
  longitude: Number,
  heading: Number,
  speedInMps: Number,
  lifetimeOdometerInMeters: Number,
  altitude: Number,
  powerSupplyVoltage: Number,
  ignitionState: Number,
  input0: Number,
  dop: Number,
  numberOfSats: Number,
  engineCoolantTemperature: Number,
  engineRPM: Number,
  engineFrequency: Number,
  enginePercentageTorque: Number,
  averageLineToLineVoltage: Number,
  averageLineToNeutralVoltage: Number,
  averageAcRmsCurrent: Number,
  phaseABLineToLineVoltage: Number,
  phaseALineToNeutralVoltage: Number,
  phaseAFrequency: Number,
  phaseACurrent: Number,
  phaseBCLineToLineVoltage: Number,
  phaseBLineToNeutralVoltage: Number,
  phaseBFrequency: Number,
  phaseBCurrent: Number,
  phaseCALineToLineVoltage: Number,
  phaseCLineToNeutralVoltage: Number,
  phaseCFrequency: Number,
  phaseCCurrent: Number,
  DiagnosticTroubleCodes: String,
  oilPressure: Number,
  engineHourMeter: Number,
  averageFuelConsumptionRate: Number,
  fuelUsed: Number,
  currentFuelLevel: Number,
  eventTime: { type: Date, default: Date.now },
  createdTime: { type: Date, default: Date.now },
  updatedTime: { type: Date, default: Date.now },
  panic: Boolean,
  batteryCharge: Boolean,
  batteryLevel: Number,
  assetName: String,
  gpsPoll: Boolean,
  CannedMessage: Number,
  Message: String,
  // UserNames: Array,
  //features
  engineStatus: String,
  inUse: Boolean,
  hasMapPosition: Boolean,
  powerOutputKW: Number,
  //SBD specific fields
  sessionStatus: String,
  payload: String,
  messageStatus: String
});

// on every save, add the date
sensorMessageEventSchema.pre("save", function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updatedTime = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.createdTime) this.createdTime = currentDate;
  //this is important
  next();
});

// on every save, add the date
sensorMessageEventSchema.pre("find", function(next) {
  // var queryObj = this.getQuery(),
  //     keys = Object.keys(queryObj);

  // //changing types
  // for (let i = 0; i < keys.length; i++) {
  //     switch (keys[i]) {
  //         case '_asset':
  //             if (typeof queryObj._asset == 'string') {
  //                 let objRef = mongoose.Types.ObjectId(queryObj._asset);
  //                 this.where({ '_asset': objRef });
  //             }
  //             break;
  //         default:
  //             break;
  //     }
  // }
  console.log(this.getQuery());
  //this is important
  next();
});

//Add pagination plugin
sensorMessageEventSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("SensorMessageEvent", sensorMessageEventSchema);
