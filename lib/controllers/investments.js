//
// Investment Controller
// - Server-side
// - Responsible for investment-related CRUD functionality
//

'use strict';

var mongoose = require("mongoose"),
    Investment = mongoose.model("Investment");

//
// Create new investment
//
exports.create = function(req, res) {

    // Confirm the current user is an IA
    var currentUser = req.user;
    if ( !currentUser.accreditedInvestor ) {
        var error = "Error attempting to invest by unaccredited user. User ID: " + currentUser._id;
        console.error(error);
        return res.json(403, error);
    }

    // Confirm user hasn't already invested in this deal
    // TODO(mim)

    var investment = new Investment(req.body);

    // Confirm at least minimum investment has been specified
    if ( investment.amount < 10000 ) {
        var error = "Error attempting to invest - specified investment amount less than $10000. User ID: " + currentUser._id;
        console.error(error);
        return res.json(403, error);
    }

    // Set user ID and deal ID on investment
    investment.user = currentUser.id;

    investment.save(function(error, savedInvestment) {

        if (error) {
            console.error(error);
            return res.json(500, error);
        }

        return res.json(savedInvestment);
    });
};

//
// Returns true if the current user is an investor
//
exports.isInvestor = function(req, res) {

    var userId = req.user.id;
    var dealId = req.params.id;
    Investment.findOne({
        deal: dealId,
        user: userId
    }).exec(function(error, investment) {

        if (error) {
            console.error(error);
            return res.json(500, error);
        }

        return res.json(investment);
    });
};

//
// Find investments for specified user, populate deal information
//
exports.findByUserId = function(req, res) {


    var userId = req.params.userId;
    Investment.find({
        user: userId
    })
    .populate('deal')
    .sort('createdAt')
    .exec(function(error, investments) {

        if (error) {
            console.error(error);
            return res.json(500, error);
        }

        return res.json(investments);
    });
};