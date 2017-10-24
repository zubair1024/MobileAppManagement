"use strict";

var mongoose = require("mongoose"),
  mongoosePaginate = require("mongoose-paginate"),
  Schema = mongoose.Schema;

var alarmEventSchema = new Schema({
  objectType: { type: String, required: true, default: "Alarm Event" },
  alarmName: String,
  pState: Number,
  _asset: { type: Schema.Types.ObjectId, ref: "Asset" },
  _alarm: { type: Schema.Types.ObjectId, ref: "Alarm" },
  eventType: String,
  eventTime: { type: Date, default: Date.now },
  createdTime: { type: Date },
  updatedTime: { type: Date }
});

// on every save, add the date
alarmEventSchema.pre("save", function(next) {
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
alarmEventSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("AlarmEvent", alarmEventSchema);
