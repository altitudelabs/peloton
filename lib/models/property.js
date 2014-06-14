//
// Property Model
//

'use strict';

//timestamp plugin
var timestamps = require('./timestamps');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//
// Property Schema
//
var PropertySchema = new Schema({
    name: String,
    sponsorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sponsor"
    },
    location: String,
    description: String,
    heroImage: {
        id: String,
        fileExtension: String
    }
});

PropertySchema.plugin(timestamps, { index: true });


module.exports = mongoose.model("Property", PropertySchema);