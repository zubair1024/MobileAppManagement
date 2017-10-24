"use strict";

var mongoose = require("mongoose"),
  mongoosePaginate = require("mongoose-paginate"),
  Schema = mongoose.Schema;

var geofenceSchema = new Schema({
  name: String,
  objectType: { type: String, required: true, default: "Geofence" },
  pState: Number,
  _location: { type: Schema.Types.ObjectId, ref: "Location" },
  type: String,
  geoShape: {},
  updatedTime: { type: Date },
  createdTime: { type: Date }
});

// on every save, add the date
geofenceSchema.pre("save", function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updatedTime = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.createdTime) this.createdTime = currentDate;

  //set pState
  if (!this.pState) this.pState = 1;
  //this is important
  next();
});

//Add pagination plugin
geofenceSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Geofence", geofenceSchema);
