//
// Person Model
//

'use strict';

//timestamp plugin
var timestamps = require('./timestamps');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//
// Person Schema
//
var PersonSchema = new Schema({
    name: String,
    sponsorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sponsor"
    },
    role: String,
    bio: String,
    linkedinUrl: String,
    profilePicture: {
        id: String,
        fileExtension: String
    }
});

PersonSchema.plugin(timestamps, { index: true });

module.exports = mongoose.model("Person", PersonSchema);