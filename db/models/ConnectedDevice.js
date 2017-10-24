"use strict";

var mongoose = require("mongoose"),
  mongoosePaginate = require("mongoose-paginate"),
  Schema = mongoose.Schema;

var connectedDeviceSchema = new Schema(
  {
    connectionList: {},
    createdTime: Date,
    updatedTime: Date
  },
  { capped: { size: 1024, max: 1, autoIndexId: true } }
);

// on every save, add the date
connectedDeviceSchema.pre("save", function(next) {
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
connectedDeviceSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("ConnectedDevice", connectedDeviceSchema);
