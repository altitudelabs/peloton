//
// Deal Controller
// - Server-side
// - Responsible for deal-related CRUD functionality
//

'use strict';

var mongoose = require("mongoose"),
    Deal = mongoose.model("Deal");


//
// List all deals
//
exports.index = function(req, res) {

    Deal.find(function(error, deals) {
        if (error) {
            return console.error(error);
        }
        res.json(deals);
    });
};

//
// Find deal with specified ID
//
exports.findById = function(req, res, next) {

    var id = req.params.id;
    Deal.findById(id, function(error, deal) {


        if (error) {
            return res.json(500, error);
        }

        return res.json(deal);
    });
};