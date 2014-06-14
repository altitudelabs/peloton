//
// Person Controller
// - Server-side
// - Responsible for person-related CRUD functionality
//

'use strict';

var mongoose = require("mongoose"),
    Person = mongoose.model("Person"),
    AssetService = require('../services/assetService');

//
// Create new person
//
exports.create = function(req, res, next) {

    var person = new Person(req.body);

    person.save(function(error) {

        if (error) {
            console.error(error);
            return res.json(500, error);
        }

        return res.json(person);
    });
};

//
// Update person
//
exports.update = function(req, res, next) {

    // Grab the person POST params
    var person = req.body;

    // Delete the ID field from the POST params - Mongo
    // doens't handle updates containing the _id field
    delete person._id;

    Person.update({
        _id: req.params.id
    }, person, {
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
// Update profile picture
// TODO(mim) this is a repeat of sponsor code...
//
exports.updateProfilePicture = function(req, res, next) {

    AssetService.create(req, res, function(error, image) {

        if (error) {
            console.error(error);
            return res.json(500, error);
        }

        var personUpdateModel = {
            profilePicture: image
        };

        // Update person with image details
        Person.update({
            _id: req.params.id
        }, personUpdateModel, function(error) {

            if (error) {
                return res.json(500, error);
            }

            return res.json(image);
        });

    });
};


//
// Delete person
//
exports.delete = function(req, res, next) {

    var toDeleteId = req.params.id;
    Person.findByIdAndRemove(toDeleteId, function(error) {

        if (error) {
            console.error(error);
            return res.json(500, error);
        }

        return res.json(200);
    });
};

//
// Find people in specified sponsor
//
exports.findBySponsorId = function(req, res, next) {

    var sponsorId = req.params.sponsorId;
    Person.find({
        sponsorId:sponsorId
    }).sort('createdAt').exec(function(error, people) {

        if (error) {
            console.error(error);
            return res.json(500, error);
        }

        return res.json(people);
    });
};