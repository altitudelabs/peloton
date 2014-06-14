'use strict';

var path = require('path');
/**
 * Custom middleware used by the application
 */
module.exports = {

    /**
    *  Protect routes on your api from unauthenticated access
    */
    auth: function auth(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        else {
            var error = new Error('User not Authenticated.');
            error.status = 401;
            next(error);
        }
    },

    /**
    * Set a cookie for angular so it knows we have an http session
    */
    setUserCookie: function(req, res, next) {
        if(req.user) {
            res.cookie('user', JSON.stringify(req.user.userInfo));
        }
        next();
    },

    //
    // Returns true if the current user matches the user ID param
    // OR the current user is an admin
    //
    isAdminOrOwner: function(req, resp, next) {

        if ( !req.isAuthenticated() ) {

            // User has not been authenticated - return 401
            var error = new Error("User not authenticated.");
            error.status = 401;
            next(error);
        }
        else {

            // Get the current user's ID
            var currentUserId = req.user._id;

            // Get the user ID param
            var userId = req.params.userId;

            // Get the role of the current user
            var role = req.user.role;

            if ( role === "admin" || userId === currentUserId.toHexString() ) {

                // We're good to go
                return next();
            }
            // Otherwise the user is not authorized to view this content
            else {

                // User is not authorized - return 403
                var error = new Error('User not authorized.');
                error.status = 403;
                next(error);
            }

        }

    },

    //
    // Confirm user has specified role
    //
    // @throws 401 if user is not authenticated
    // @throws 403 if user is not authorized
    //
    // TODO(dave) clean this up (ie separate authentication and authorization)
    //
    requireRole: function(role) {

        return function(req, res, next) {

            if ( !req.isAuthenticated() ) {

                // User has not been authenticated - return 401
                var error = new Error("User not authenticated.");
                error.status = 401;
                next(error);
            }
            else if ( req.user.role === role ) {

                // User has the expected role - nothing to see here!
                return next();
            }
            else {

                // User is not authorized - return 403
                var error = new Error('User not authorized.');
                error.status = 403;
                next(error);
            }
        }
    },
    angularPartials: function(req, res, partialPath) {
        var stripped = req.url.split('.')[0];
        var requestedView = path.join(partialPath, stripped)+'.html';
        res.sendfile(requestedView, function(err, html) {
            if(err) {
                console.log("Error rendering partial '" + requestedView + "'\n", err);
                res.status(404);
                res.send(404);
            } else {
                res.send(html);
            }
        });
    },

    angularCatchAll: function(req, res, partialPath) {

    }
};