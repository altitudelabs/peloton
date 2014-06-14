'use strict';

//timestamp plugin
var timestamps = require('./timestamps');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
  
var authTypes = ['github', 'twitter', 'facebook', 'google'];



// Status codes
// 0 - OK
// 1 - Suspended
var status = {
    ok: 0,
    suspended: 1
};

/**
 * User Schema
 */
var UserSchema = new Schema({
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    accreditedInvestor: Boolean,
    lastAccreditedDate: Date,
    role: {
        type: String,
        default: 'user'
    },
    hashedPassword: String,
    provider: String,
    salt: String,
    facebook: {},
    twitter: {},
    github: {},
    google: {},
    active: Boolean,
    activationKey: String,
    activationKeyExpiryDate: Date,
    forgotKey: String,
    forgotKeyExpiryDate: Date,
    status: {
        type: Number,
        default: status.ok
    }
});

UserSchema.plugin(timestamps, { index: true });

//
// Virtuals
//

//
// Password
//
UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

//
// Basic info to identify the current authenticated user in the app
//
UserSchema.virtual('userInfo').get(function() {

    return {
        "_id": this._id,
        "firstName": this.firstName,
        "lastName": this.lastName,
        "email": this.email,
        "phone": this.phone,
        "role": this.role,
        "provider": this.provider,
        "active" : this.active,
        "accreditedInvestor": this.accreditedInvestor,
        "lastAccreditedDate": this.lastAccreditedDate
    };
});


//
// Validations
//

//
// Validate empty email
//
UserSchema
  .path('email')
  .validate(function(email) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

//
// Validate empty password
//
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

//
// Validate email is not taken
//
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

//
//
//
var validatePresenceOf = function(value) {
    return value && value.length;
};

//
// Pre-save hook
//
UserSchema
    .pre('save', function(next) {

    if ( !this.isNew ) {
        return next();
    }

    if ( !validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1 ) {
        next(new Error('Invalid password'));
    }
    else {
        next();
    }
});

/**
 * Methods
 */
UserSchema.methods = {

    /**
    * Authenticate - check if the passwords are the same
    *
    * @param {String} plainText
    * @return {Boolean}
    * @api public
    */
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },

    /**
    * Make salt
    *
    * @return {String}
    * @api public
    */
    makeSalt: function() {
        return crypto.randomBytes(16).toString('base64');
    },

    /**
    * Encrypt password
    *
    * @param {String} password
    * @return {String}
    * @api public
    */
    encryptPassword: function(password) {
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    },

    //
    // Returns true if user is an admin
    //
    isAdmin: function() {
        return this.role === "admin";
    },

    //
    // Update status of user to suspended
    //
    deactivate: function() {
        this.status = status.suspended;
    },

    //
    // Update status of user to suspended
    //
    reactivate: function() {
        this.status = status.ok;
    },

    //
    // Returns true if user has been suspended
    //
    isDeactivated: function() {

        return this.status === status.suspended;
    }
};

module.exports = mongoose.model('User', UserSchema);