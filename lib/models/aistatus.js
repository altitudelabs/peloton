//
// Accredited investor status
//

'use strict';

//timestamp plugin
var timestamps = require('./timestamps');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//
//
// Types of accreditation
var sources = {
    self: 0
};

//
// Qualification for AI status
//
var qualifications = {
    income: "INCOME",
    jointIncome: "JOINT_INCOME",
    netWorth: "NET_WORTH",
    rep: "REP",
    none: "NONE"
};

//
// AI status Schema
//
var AIStatusSchema = new Schema({
    source: String,
    qualifications: [String],
    date: Date
});

//
// Methods
//
AIStatusSchema.methods = {

    //
    // Returns true if any qualification is any other than "none"
    //
    isAccreditedInvestor: function() {

        return this.qualifications.indexOf(qualifications.none) == -1;
    }
};


AIStatusSchema.plugin(timestamps, { index: true });

module.exports = mongoose.model("AIStatus", AIStatusSchema);