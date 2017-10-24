"use strict";

var mongoose = require("mongoose"),
  mongoosePaginate = require("mongoose-paginate"),
  Schema = mongoose.Schema;

var liveOperationalStatisticSchema = new Schema({
  operational: Number,
  notOperational: Number,
  operationalToday: Number,
  unknown: Number,
  deployed: Number,
  maintenance: Number,
    decommissioned: Number,
  readyForDeployment: Number,
  toBeServiced: Number,
  startTime: Date,
  endTime: Date,
  nextRunTime: Date,
  updated_at: { type: Date },
  created_at: { type: Date }
}, { capped: { max: 1} });

// on every save, add the date
liveOperationalStatisticSchema.pre("save", function(next) {
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
liveOperationalStatisticSchema.plugin(mongoosePaginate);

module.exports = mongoose.model(
  "ETLliveOperationalStatistic",
  liveOperationalStatisticSchema
);
