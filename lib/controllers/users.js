'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    AIStatus = mongoose.model('AIStatus'),
    passport = require('passport'),
    emailService = require('../services/emailService');


/**
 * Create user
 */
exports.create = function (req, res, next) {

    // Setup values of new user
    var newUser = new User(req.body);
    newUser.provider = 'local';

    // Force lower case of email
    newUser.email = newUser.email.toLowerCase();

    // Get the AI status and determine if user is an
    // accredited investor
    var aiStatus = new AIStatus(req.body);
    newUser.accreditedInvestor = aiStatus.isAccreditedInvestor();

    // Set activation key and corresponding expiry
    var expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + (14 * 24 * 60 * 60 * 1000));
    newUser.activationKeyExpiryDate = expiryDate;
    newUser.activationKey = (Math.random() + 1).toString(36).substring(7);

    // Save user
    newUser.save(function(err) {

        if ( err ) {
            console.error(err);
            return res.json(500, err);
        }

        // Set the current date on the AI status
        aiStatus.date = new Date();

        // Save AI status
        // TODO(mim) transaction?
        aiStatus.save(function(aiStatusError) {

            if ( aiStatusError ) {
                console.error(aiStatusError);
                return res.json(500, aiStatusError);
            }

            // Setup activation email
            var hostURL = req.config.hostURL;
            var activationUrl = 'http://'+hostURL+'/signup/activate/' + newUser.activationKey;
            var bodyContent = ["Thank you for registering with Peloton Street. Please visit",
                activationUrl,
                "to activate your account."];

            // Create plain text version
            var plainText = bodyContent.join(" ");

            // Create HTML version - create link around activation URL
            bodyContent[1] = "<a href=\"" + activationUrl + "\">" + activationUrl + "</a>";
            var html = bodyContent.join(" ");

            var mailOptions = {
                from: "Peloton Street <test@clevercanary.com>",
                to: newUser.email,
                subject: "Peloton Street - Activate Account",
                text: plainText,
                html: html
            };

            emailService.send(mailOptions);

            return res.json(200);
        });

    });
};

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {

    var userId = req.params.id;

    User.findById(userId, function (err, user) {

        if ( err ) {
            return res.json(500, err);
        }

        if ( !user ) {
            return res.json(404, "No user found with ID " + userId);
        }

        res.send(user.userInfo);
    });
};

/**
 * Change password
 */
//exports.changePassword = function(req, res, next) {
//  var userId = req.user._id;
//  var oldPass = String(req.body.oldPassword);
//  var newPass = String(req.body.newPassword);
//
//  User.findById(userId, function (err, user) {
//    if(user.authenticate(oldPass)) {
//      user.password = newPass;
//      user.save(function(err) {
//        if (err) return res.send(500);
//
//        res.send(200);
//      });
//    } else {
//      res.send(403);
//    }
//  });
//};

//
// Activate user account
//
exports.activateAccount = function(req, res, next) {

    var activationKey = req.body.activationKey;

    User.findOne({
        activationKey: activationKey
    }, function(error, user) {

        if ( error ) {
            return res.json(500, error);
        }

        // Confirm user was found with matching activation key
        if ( !user ) {
            return res.json(422, {
                ccMinorErrorCode: "ACTIVATION_KEY_INVALID"
            });
        }

        // Check if activation key is still valid
        var now = new Date();
        if ( user.activationKeyExpiryDate.getTime() !== now.getTime()
                && (user.activationKeyExpiryDate < now) ) {
            return res.json(422, {
                ccMinorErrorCode: "ACTIVATION_KEY_EXPIRED"
            });
        }

        // Update active flag on user to true
        user.active = true;
        user.save(function(err) {

            if ( err ) {
                return res.json(500, err);
            }

            res.json(200);
        });
    });
};

//
// Request reset password email
//
exports.requestResetPassword = function(req, res, next) {

    var email  = req.body.email;

    if ( !email ) {
        return res.json(400, "User email not specified");
    }
    email = email.toLowerCase();

    User.findOne({
        email: email
    }, function(error, user) {

        if ( error ) {
            return res.json(500, error);
        }

        // Confirm matching user was found
        if ( !user ) {
            // Send vague error message on porpoise so we don't leek info
            return res.json(422, createFormFieldErrorMessage("email", "Unable to reset password."));
        }

        // Check if user has activated account
        if ( !user.active ) {
            return res.json(422, createFormFieldErrorMessage("email", "Unable to reset password."));
        }

        // Check if user was not suspended
        if ( user.isDeactivated() ) {
            return res.json(422, createFormFieldErrorMessage("email", "Unable to reset password."));
        }

        // Generate new activation key
        // Set activation key and corresponding expiry
        var expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + (14 * 24 * 60 * 60 * 1000));
        var forgotKey = (Math.random() + 1).toString(36).substring(7);

        // Update user with new forgot key and send email
        User.update({
            _id: user._id
        }, {
            forgotKeyExpiryDate: expiryDate,
            forgotKey: forgotKey
        }, {
            multi: false,
            upsert: false
        }, function(updateError) {

            if (updateError) {
                return res.json(500, updateError);
            }

            // Send out email
            var hostURL = req.config.hostURL;
            var resetUrl = 'http://'+hostURL+'/user/password/reset/' + forgotKey;
            var bodyContent = ["You recently requested to reset your Peloton Street password. Please click the secure link below and follow the instructions to reset your password.",
                resetUrl];

            // Create plain text version
            var plainText = bodyContent.join("\r\n\r\n");

            // Create HTML version - create link around reset URL
            bodyContent[1] = "<a href=\"" + resetUrl + "\">" + resetUrl + "</a>";
            var html = bodyContent.join("<br><br>");

            var mailOptions = {
                from: "Peloton Street <test@clevercanary.com>",
                to: user.email,
                subject: "Peloton Street - Reset Password",
                text: plainText,
                html: html
            };

            emailService.send(mailOptions);

            return res.json(200);
        });

    });
};

//
// Update user password
//
exports.resetPassword = function(req, res, next) {

    var forgotKey = req.body.forgotKey;

    User.findOne({
        forgotKey: forgotKey
    }, function(error, user) {

        if ( error ) {
            return res.json(500, error);
        }

        // Confirm user was found with matching activation key
        if ( !user ) {
            return res.json(422, createFormFieldErrorMessage("password", "Invalid forgot password key."));
        }

        // Check if forgot key is still valid
        var now = new Date();
        if ( user.forgotKeyExpiryDate.getTime() !== now.getTime()
            && (user.forgotKeyExpiryDate < now) ) {
            return res.json(422, createFormFieldErrorMessage("password", "Forgot password key has expired."));
        }

        // Check passwords match
        var password = String(req.body.password);
        var passwordMatch = String(req.body.passwordConfirm);

        if( password !== passwordMatch ){
             return res.json(422, createFormFieldErrorMessage("password", "Passwords do not match."));
        }

        // Update user password
        user.password = password;

        //expire the reset key
        user.forgotKeyExpiryDate= new Date();

        //Save Les Changes
        user.save(function(err) {

            if ( err ) {
                return res.json(500, err);
            }

            res.json(200);
        });
    });
};

//
// Deactivate user account
//
exports.deactivate = function(req, res, next) {

    var userId = req.params.id;

    // Can not deactivate yourself...
    var currentUser = req.user;
    if ( currentUser.id === userId ) {
        return res.json(422, "Can not deactivate yourself.")
    }

    // Find the specified user
    User.findById(userId, function (err, user) {

        if ( err ) {
            return res.json(500, err);
        }

        if ( !user ) {
            return res.json(422, "Unable to find user with ID: " + userId);
        }

        // Update status flag on user to indicate they
        // are now suspended
        user.deactivate();
        user.save(function(err) {

            if ( err ) {
                return res.json(500, err);
            }

            res.json(user);
        });
    });
};

//
// Deactivate user account
//
exports.reactivate = function(req, res, next) {

    var userId = req.params.id;

    // Can not reactivate yourself...
    var currentUser = req.user;
    if ( currentUser.id === userId ) {
        return res.json(422, "Can not reactivate yourself.")
    }

    // Find the specified user
    User.findById(userId, function (err, user) {

        if ( err ) {
            return res.json(500, err);
        }

        if ( !user ) {
            return res.json(422, "Unable to find user with ID: " + userId);
        }

        // Update status flag on user to indicate they
        // are now suspended
        user.reactivate();
        user.save(function(err) {

            if ( err ) {
                return res.json(500, err);
            }

            res.json(user);
        });
    });
};

/**
 * Get current user
 */
exports.me = function(req, res) {
    res.json(req.user || {});
};

/**
 * List all users
 */
exports.index = function(req, res) {
    User.find({}).sort('name').exec(function(error, users) {
        if (error) {
            return console.error(error);
        }
        res.json(users);
    });
};

//
// Create customer error message for the specified field in
// the format:
// {
//     message: "My error message"
// }
//
function createFormFieldErrorMessage(fieldName, message) {

    var errors = {};
    errors[fieldName] = {
        message: message
    };

    return {
        errors:errors
    };
};