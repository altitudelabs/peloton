//
// Sponsor Model
//

'use strict';

//timestamp plugin
var timestamps = require('./timestamps');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Sponsor Schema
 */
var SponsorSchema = new Schema({
    name: String,
    description: String,
    dates: Date, // TODO what is this?
    type: String,
    numberOfDeals: String,
    heroImage: {
        id: String,
        fileExtension: String
    },
    logoImage: {
        id: String,
        fileExtension: String
    },
    location: String,
    url: String,
    sectionHeading: String,
    option0Name: String,
    option0Value: String,
    option1Name: String,
    option1Value: String
});

SponsorSchema.plugin(timestamps, { index: true });

SponsorSchema.virtual("teaser").get(function() {

    var teaser = {
        "_id": this._id,
        name: this.name,
        location: this.location,
        type: this.type
    };

    if ( this.heroImage && this.heroImage.id ) {
        teaser.heroImage = this.heroImage;
    }

    if ( this.logoImage && this.logoImage.id ) {
        teaser.logoImage = this.logoImage;
    }

    return teaser;
});

module.exports = mongoose.model("Sponsor", SponsorSchema);