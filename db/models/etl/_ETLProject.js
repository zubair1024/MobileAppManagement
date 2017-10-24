"use strict";

var mongoose = require("mongoose"),
  mongoosePaginate = require("mongoose-paginate"),
  Schema = mongoose.Schema;

var ETLProjectSchema = new Schema(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    generatorStatus: {
      deployed: Number,
      maintenance: Number,
        decommissioned: Number,
      readyForDeployment: Number
    },
    generatorEngineRating: {
      prime: Number,
      continuous: Number,
      standby: Number
    },
    generatorCapacity: {},
    startTime: Date,
    endTime: Date,
    nextRunTime: Date,
    updated_at: { type: Date },
    created_at: { type: Date }
  }

  // { capped: { max: 1, autoIndexId: true } }
);

// on every save, add the date
ETLProjectSchema.pre("save", function(next) {
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
ETLProjectSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("ETLProject", ETLProjectSchema);
