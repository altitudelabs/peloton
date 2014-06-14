//
// Sponsor Controller
// - Server-side
// - Responsible for sponsor-related CRUD functionality
//

'use strict';

var mongoose = require("mongoose"),
    Sponsor = mongoose.model("Sponsor"),
    AssetService = require('../services/assetService');


//
// List all sponsors
//
exports.index = function(req, res) {

    Sponsor.find({}).sort('createdAt').exec(function(error, sponsors) {

        if (error) {
            return console.error(error);
        }

        // User i authenticated - display all sponsor
        // inforamtion
        if ( req.user ) {

            res.json(sponsors);
        }
        // User is not authenticated - display teaser
        // information only
        else {

            var teasers = [];
            for ( var i = 0 ; i < sponsors.length ; i++ ) {
                teasers.push(sponsors[i].teaser);
            }
            res.json(teasers);
        }
    });
};


//
// Create new sponsor
//
exports.create = function (req, res, next) {

    var sponsor = new Sponsor(req.body);

    sponsor.save(function(error) {

        if (error) {
            return res.json(500, error);
        }

        return res.json(sponsor);
    });
};

//
// Update sponsor
//
exports.update = function(req, res, next) {

    var sponsor = req.body;

    // Delete the ID field from the POST params - Mongo
    // doens't handle updates containing the _id field
    delete sponsor._id;

    Sponsor.update({
        _id: req.params.id
    }, sponsor, {
        multi: false,
        upsert: false
    }, function(error) {

        if (error) {
            return res.json(500, error);
        }

        return res.json(200);
    });
};

//
// Update sponsor hero image
//
exports.updateHeroImage = function(req, res, next) {

    AssetService.create(req, res, function(error, image) {

        if (error) {
            return res.json(500, error);
        }

        var sponsorUpdateModel = {
            heroImage: image
        };

        // Update sponsor with image details
        Sponsor.update({
                _id: req.params.id
            }, sponsorUpdateModel, function(error) {

            if (error) {
                return res.json(500, error);
            }

            return res.json(image);
        });

    });
};

//
// Update sponsor logo image
// TODO(mim) this is a repeat of above
//
exports.updateLogoImage = function(req, res, next) {

    AssetService.create(req, res, function(error, image) {

        if (error) {
            return res.json(500, error);
        }

        var sponsorUpdateModel = {
            logoImage: image
        };

        // Update sponsor with image details
        Sponsor.update({
            _id: req.params.id
        }, sponsorUpdateModel, function(error) {

            if (error) {
                return res.json(500, error);
            }

            return res.json(image);
        });

    });
};

//
// Find sponsor with specified ID
//
exports.findById = function(req, res, next) {

    var id = req.params.id;
    Sponsor.findById(id, function(error, sponsor) {

        if (error) {
            return res.json(500, error);
        }

        return res.json(sponsor);
    });
};

//
// Delete sponsor
//
exports.delete = function(req, res, next) {

    var toDeleteId = req.params.id;
    Sponsor.findByIdAndRemove(toDeleteId, function(error) {

        if (error) {
            return res.json(500, error);
        }

        return res.json(200);
    });
};