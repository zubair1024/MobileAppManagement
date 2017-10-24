"use strict";

var mongoose = require("mongoose"),
  mongoosePaginate = require("mongoose-paginate"),
  Schema = mongoose.Schema;

var alarmSchema = new Schema({
  name: String,
  objectType: { type: String, required: true, default: "Alarm" },
  pState: Number,
  _asset: { type: Schema.Types.ObjectId, ref: "Asset" },
  triggered: Boolean,
  monitoredFeature: {},
  triggerTime: { type: Date },
  updatedTime: { type: Date },
  createdTime: { type: Date }
});

// on every save, add the date
alarmSchema.pre("save", function(next) {
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
alarmSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Alarm", alarmSchema);
