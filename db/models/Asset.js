"use strict";

var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema,
    scheme = {
        name: { type: String, required: true },
        objectType: { type: String, required: true, default: 'Asset' },
        pState: Number,
        _projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
        status: String,
        sensor: { type: String, unqiue: true, required: true },
        interfaceType: { type: String, required: true },
        category: String,
        model: String,
        manufacturer: String,
        controlPanelManufacturer: String,
        yearOfManufacture: Number,
        powerRating: String,
        generatorEngineRating: String,
        powerFactor: Number,
        generatorFrequency: Number,
        generatorCapacity: Number,
        features: {},
        tags: {},
        imageUrl: String,
        lastEventTime: { type: Date },
        lastCreatedTime: { type: Date },
        createdTime: { type: Date },
        updatedTime: { type: Date }
    };

// db.odataServer.resource('assets', scheme);

var assetSchema = new Schema(scheme);

// on every save, add the date
assetSchema.pre('save', function (next) {
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
assetSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Asset', assetSchema);;
