//
// Investment Model
//

'use strict';

//timestamp plugin
var timestamps = require('./timestamps');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Status codes
// 0 - Pending
var status = {
    pending: 0
};

//
// Investment Schema
//
var InvestmentSchema = new Schema({
    name: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    deal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Deal"
    },
    amount: Number,
    status: {
        type: Number,
        default: status.pending
    },
    investmentDate: {
        type: Date,
        default: Date.now
    }
});

InvestmentSchema.plugin(timestamps, { index: true });


module.exports = mongoose.model("Investment", InvestmentSchema);