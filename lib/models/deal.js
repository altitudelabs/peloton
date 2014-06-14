//
// Deal Model
//

'use strict';

//timestamp plugin
var timestamps = require('./timestamps');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Deal Schema
 */
var DealSchema = new Schema({
    name: String
});


DealSchema.plugin(timestamps, { index: true });

module.exports = mongoose.model("Deal", DealSchema);