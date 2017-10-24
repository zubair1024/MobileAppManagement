"use strict";

var mongoose = require("mongoose"),
  mongoosePaginate = require("mongoose-paginate"),
  Schema = mongoose.Schema;

var ETLAssetUtilization = new Schema(
  {
    _asset: { type: Schema.Types.ObjectId, ref: "Asset" },
    eventCount: Number,
    totalPowerOutputKW: Number,
    averagePowerOutput: Number,
    firstEngineHourMeter: Number,
    lastEngineHourMeter: Number,
    totalEngineHours: Number,
    firstFuelUsed: Number,
    lastFuelUsed: Number,
    totalFuelUsed: Number,
    startTime: Date,
    endTime: Date,
    nextRunTime: Date,
    updated_at: { type: Date },
    created_at: { type: Date }
  }

  // { capped: { max: 1, autoIndexId: true } }
);

// on every save, add the date
ETLAssetUtilization.pre("save", function (next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;
  //this is important
  next();
});

//Add pagination plugin
ETLAssetUtilization.plugin(mongoosePaginate);

module.exports = mongoose.model("ETLAssetUtilization", ETLAssetUtilization);
