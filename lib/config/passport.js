'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/**
 * Passport configuration
 */
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//
//
//
passport.deserializeUser(function(id, done) {

  console.log("Deserializing user with id:" +id);
  User.findOne({
    _id: id
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt

    console.log("User is:" +user);
    done(err, user);
  });
});

//
// Configure strategy for user who is authenticated locally
//
passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, function(email, password, done) {

    User.findOne({
            email: email
        }, function(err, user) {

            if ( err ) {
              return done(err);
            }

            // Confirm user with matching email was found
            if ( !user ) {
                return done(null, false, {
                    message: "Invalid username and password combination."
                });
            }

            // Confirm user has activated their account
            if ( !user.active ) {
                return done(null, false, {
                    message: "This account has not been activated."
                });
            }

            // Confirm user has not been suspended
            if ( user.isDeactivated() ) {
                return done(null, false, {
                   message: "This account has been suspended."
                });
            }


            // Confirm password is correect
            if (!user.authenticate(password)) {
                return done(null, false, {
                    message: "Invalid username and password combination."
                });
            }
            return done(null, user);
        });
    }
));

module.exports = passport;