"use strict";

var mongoose = require("mongoose"),
  mongoosePaginate = require("mongoose-paginate"),
  Schema = mongoose.Schema;

var commandEventSchema = new Schema({
  imei: String,
  interfaceType: String,
  command: String,
  processed: { type: Boolean, default: false },
  pState: { type: Number, default: 1 },
  createdTime: Date,
  updatedTime: Date
});

// on every save, add the date
commandEventSchema.pre("save", function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updatedTime = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.createdTime) this.createdTime = currentDate;
  //this is important
  next();
});

//Add pagination plugin
commandEventSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("CommandEvent", commandEventSchema);
