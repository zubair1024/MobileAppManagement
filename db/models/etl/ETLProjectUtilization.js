"use strict";

var mongoose = require("mongoose"),
  mongoosePaginate = require("mongoose-paginate"),
  Schema = mongoose.Schema;

var ETLProjectUtilization = new Schema(
  {
    _project: { type: Schema.Types.ObjectId, ref: "Project" },
    powerOutputKW: Number,
    startTime: Date,
    endTime: Date,
    nextRunTime: Date,
    updated_at: { type: Date },
    created_at: { type: Date }
  }
);

// on every save, add the date
ETLProjectUtilization.pre("save", function(next) {
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
ETLProjectUtilization.plugin(mongoosePaginate);

module.exports = mongoose.model("ETLProjectUtilization", ETLProjectUtilization);
