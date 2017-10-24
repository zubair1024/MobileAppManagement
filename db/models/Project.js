"use strict";

var mongoose = require("mongoose"),
  mongoosePaginate = require("mongoose-paginate"),
  Schema = mongoose.Schema,
  scheme = {
    name: { type: String, required:true },
    objectType: { type: String, required: true, default: 'Project' },
    pState: Number,
    assets: [{ type : Schema.Types.ObjectId, ref: 'Asset' }],
    tags: [],
    createdTime: { type: Date },
    updatedTime: { type: Date }

    // events: [{ type: Schema.Types.ObjectId, ref: 'SensorMessageEvent' }]
  };

// db.odataServer.resource('assets', scheme);

var projectSchema = new Schema(scheme);

// on every save, add the date
projectSchema.pre("save", function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updatedTime = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.createdTime) this.createdTime = currentDate;

  //set the pState
  this.pState = 1;

  //this is important
  next();
});

//Add pagination plugin
projectSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Project", projectSchema);
