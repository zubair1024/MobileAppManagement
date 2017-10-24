"use strict";

var mongoose = require("mongoose"),
  mongoosePaginate = require("mongoose-paginate"),
  Schema = mongoose.Schema;

var rawMessageEventSchema = new Schema({
  sourceAddress: String,
  destinationPort: String,
  protocol: String,
  interfaceType: String,
  message: String,
  createdTime: Date,
  updatedTime: Date
});

// on every save, add the date
rawMessageEventSchema.pre("save", function(next) {
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
rawMessageEventSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("RawMessageEvent", rawMessageEventSchema);
