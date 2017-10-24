"use strict";

var mongoose = require("mongoose"),
  mongoosePaginate = require("mongoose-paginate"),
  Schema = mongoose.Schema;

var locationSchema = new Schema({
  name: String,
  objectType: { type: String, required: true, default: "Location" },
  pState: Number,
  type: String,
  latitude: Number,
  longitude: Number,
  updatedTime: { type: Date },
  createdTime: { type: Date }
});

// on every save, add the date
locationSchema.pre("save", function(next) {
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
locationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Location", locationSchema);
