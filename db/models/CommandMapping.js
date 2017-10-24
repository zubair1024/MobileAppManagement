"use strict";

var mongoose = require("mongoose"),
    mongoosePaginate = require("mongoose-paginate"),
    Schema = mongoose.Schema;

var commandMappingSchema = new Schema({
    mapping: {},
    pState: { type: Number, default: 1 },
    createdTime: Date,
    updatedTime: Date
}, { capped: true, max: 1 });

// on every save, add the date
commandMappingSchema.pre("save", function (next) {
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
commandMappingSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("CommandMapping", commandMappingSchema);
