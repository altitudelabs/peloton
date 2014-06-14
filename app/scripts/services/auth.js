'use strict';

angular.module('psApp').factory('Auth', function Auth($http, $q, Session, UsersService) {

    // True if we have checked the server for the current user
    var init = false;

    // The current logged in user
    var currentUser = null;

    return {

        /**
         * Authenticate user
         *
         * @param  {Object}   user     - login info
         * @param  {Function} callback - optional
         * @return {Promise}
         */
        login: function(user, callback) {

            var cb = callback || angular.noop;

            return Session.save({
                email: user.email,
                password: user.password
            }, function(user) {

                setCurrentUser(user);
                return cb();

            }, function(err) {

                return cb(err);

            }).$promise;
        },

        /**
         * Unauthenticate user
         *
         * @param  {Function} callback - optional
         * @return {Promise}
         */
        logout: function(callback) {

            var cb = callback || angular.noop;

            return Session["delete"](function () {

                    currentUser = null;
                    init = false;
                    return cb();
                },
                function(err) {

                    return cb(err);

                }).$promise;
        },

        /**
         * Create a new user
         *
         * @param  {Object}   user     - user info
         * @param  {Function} callback - optional
         * @return {Promise}
         */
        createUser: function(user, callback) {

            var cb = callback || angular.noop;

            return UsersService.save(user, function() {

                return cb();

            },
            function(err) {

                return cb(err);

            }).$promise;
        },

        /**
         * Change password
         *
         * @param  {String}   oldPassword
         * @param  {String}   newPassword
         * @param  {Function} callback    - optional
         * @return {Promise}
         */
        changePassword: function(oldPassword, newPassword, callback) {

            var cb = callback || angular.noop;

            return UsersService.update({
                oldPassword: oldPassword,
                newPassword: newPassword
            }, function(user) {
                return cb(user);
            }, function(err) {
                return cb(err);
            }).$promise;
        },

        //
        // Request password reset
        //
        requestResetPassword: function(email) {

            return UsersService.requestResetPassword({
                email:email
            }, function() {
                return true;
            }, function() {
                return false;
            }).$promise;
        },

        //
        // Reset user's password
        //
        resetPassword: function(forgotKey, password, passwordConfirm) {

            return UsersService.resetPassword({
                forgotKey: forgotKey,
                password: password,
                passwordConfirm: passwordConfirm
            }, function() {
                return true;
            }, function() {
                return false;
            }).$promise;
        },

        /**
         * Gets all available info on authenticated user. Queries server once for user
         * details otherwise returns cached user (which can be null if user has not
         * yet logged in).
         *
         * @return {Promise}
         */
        getCurrentUser: function() {

            var userDeferred = $q.defer();

            if ( init ) {
                userDeferred.resolve(currentUser);
            }
            else {
                UsersService.get(function(user) {

                    // If no user was found, set user to be null - $resource
                    // returns an object populated with data from server, must
                    // explicitly check if returned data has ID
                    if ( !user._id ) {
                        user = null;
                    }

                    // Cache the user and resolve the promise
                    setCurrentUser(user);
                    userDeferred.resolve(user);

                });
            }
            return userDeferred.promise;

        },

        //
        // Returns true if user is authenticated - used by
        // view to toggle visibility of elements etc.
        //
        // This method does not query the server for the user. If
        // querying the server for the user is required, used the
        // getCurrentUser method instead.
        //
        isLoggedIn: function() {

            return !!currentUser;
        },

        //
        // Return the role of the current user, or "visitor"
        // if user is not authenticated
        //
        getCurrentUserRole: function() {

            if ( this.isLoggedIn() ) {
                return currentUser.role;
            }

            return "visitor";

        },

        //
        // Activate new user
        //
        activateAccount: function(activationKey) {

            return $http({
                method: "POST",
                url: "/api/signup/activate",
                data: {
                    activationKey: activationKey
                }
            });
        },

        //
        // Returns true if user has specified role
        //
        requireRole: function(role) {

            var userRoleDeferred = $q.defer();

            this.getCurrentUser().then(function() {

                // Resolve or reject deferred according to whether
                // use is authorized
                if ( isHasRole(role) ) {
                    userRoleDeferred.resolve(true);
                }
                else {
                    userRoleDeferred.reject(false);
                }

            });

            return userRoleDeferred.promise;
        },

        //
        //
        //
        isHasRole : function(role) {
            return isHasRole(role);
        }
    };

    //
    // Privates
    //

    //
    // Set the current user
    //
    function setCurrentUser(user) {

        currentUser = user;
        init = true;
    }

    //
    // Returns true if user has specified role(s)
    //
    function isHasRole(role) {

        // Convert the role into an array if it's not so we
        // can loop over it
        var roleArray = [].concat(role);
        for ( var i = 0 ; i < roleArray.length ; i++ ) {

            var roleToCheck = roleArray[i];

            // If there the user is not authenticated and
            // the required role is visitor then user is authorized
            if ( currentUser ) {

                var userRole = currentUser.role;

                // Ignore links for visitors...
                if ( roleToCheck === 'visitor' ) {
                    continue;
                }

                if ( userRole === 'admin' ) {
                    return true;
                }

                if ( userRole === roleToCheck ) {
                    return true;
                }
            }
            // Otherwise there is no user - check if role is "visitor"
            else {

                if ( roleToCheck === "visitor" ) {
                    return true;
                }
            }
        }

        return false;
    }
});