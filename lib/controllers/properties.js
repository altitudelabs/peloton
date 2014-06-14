//
// Properties Controller
// - Server-side
// - Responsible for property-related CRUD functionality
//

'use strict';

var mongoose = require("mongoose"),
    Property = mongoose.model("Property"),
    AssetService = require('../services/assetService');

//
// Create new property
//
exports.create = function(req, res, next) {

    var property = new Property(req.body);

    property.save(function(error) {

        if (error) {
            console.error(error);
            return res.json(500, error);
        }

        return res.json(property);
    });
};

//
// Update property
//
exports.update = function(req, res, next) {

    // Grab the property POST params
    var property = req.body;

    // Delete the ID field from the POST params - Mongo
    // doens't handle updates containing the _id field
    delete property._id;

    Property.update({
        _id: req.params.id
    }, property, {
        multi: false,
        upsert: false
    }, function(error) {

        if (error) {
            console.error(error);
            return res.json(500, error);
        }

        return res.json(200);
    });

};


//
// Update hero image
// TODO(mim) this is a repeat of sponsor code...
//
exports.updateHeroImage = function(req, res, next) {

    AssetService.create(req, res, function(error, image) {

        if (error) {
            console.error(error);
            return res.json(500, error);
        }

        var propertyUpdateModel = {
            heroImage: image
        };

        // Update property with image details
        Property.update({
            _id: req.params.id
        }, propertyUpdateModel, function(error) {

            if (error) {
                console.error(error);
                return res.json(500, error);
            }

            return res.json(image);
        });

    });
};


//
// Delete property
//
exports.delete = function(req, res, next) {

    var toDeleteId = req.params.id;
    Property.findByIdAndRemove(toDeleteId, function(error) {

        if (error) {
            console.error(error);
            return res.json(500, error);
        }

        return res.json(200);
    });
}

//
// Find properties associated with specified sponsor
//
exports.findBySponsorId = function(req, res, next) {

    var sponsorId = req.params.sponsorId;
    Property.find({
        sponsorId:sponsorId
    }).sort('createdAt').exec(function(error, properties) {

        if (error) {
            console.error(error);
            return res.json(500, error);
        }

        return res.json(properties);
    });
};