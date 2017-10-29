"use strict";

var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema,
    scheme = {
        name: { type: String, required: true },
        objectType: { type: String, required: true, default: 'Ad' },
        pState: Number,
        imageUrl: String,
        linkedUrl:String,
        tags: {},
        lastEventTime: { type: Date },
        lastCreatedTime: { type: Date },
        createdTime: { type: Date },
        updatedTime: { type: Date }
    };

// db.odataServer.resource('assets', scheme);

var adSchema = new Schema(scheme);

// on every save, add the date
adSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updatedTime = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdTime)
        this.createdTime = currentDate;

    //set the pState
    this.pState = 1;

    //this is important
    next();
});

//Add pagination plugin
adSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Ad', adSchema);;
