"use strict";

var mongoose = require("mongoose"),
    mongoosePaginate = require("mongoose-paginate"),
    Schema = mongoose.Schema;

var configurationSchema = new Schema({
    config: {},
    pState: { type: Number, default: 1 },
    createdTime: Date,
    updatedTime: Date
}, { capped: true, max: 1 });

// on every save, add the date
configurationSchema.pre("save", function (next) {
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
configurationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Configuration", configurationSchema);
