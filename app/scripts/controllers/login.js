'use strict';

angular.module('psApp').controller('LoginCtrl', function ($scope, Auth, $stateParams, $state, $location) {

    $scope.user = {};
    $scope.errors = {};

    //
    // Login
    //
    $scope.login = function(form) {

        $scope.submitted = true;

        if ( form.$valid ) {
            Auth.login({
                email: $scope.user.email.toLowerCase(),
                password: $scope.user.password
            })
            .then(function() {

                // Keeps session - page is not realoaded
                $location.path('/deals');

                // Emit login event
                $scope.$emit("login");
            })
            ["catch"]( function(err) {
                err = err.data;
                $scope.errors.other = err.message;
            });
        }
    };

    //
    // Request password reset
    //
    $scope.requestResetPassword = function(form) {

        $scope.resetRequestSubmitted = true;

        if ( form.$valid ) {

            Auth.requestResetPassword($scope.user.email.toLowerCase()).then(function () {
                // Account created, redirect to home
                $location.path('/user/password/request-reset/success');
            })["catch"]( function(err) {

                err = err.data;
                $scope.errors = {};

                // Update validity of form fields that match the mongoose errors
                angular.forEach(err.errors, function(error, field) {
                    form[field].$setValidity('mongoose', false);
                    $scope.errors[field] = error.message;
                });
            });
        }

    };

    //
    // Reset password
    //
    $scope.resetPassword = function(form) {

        $scope.resetSubmitted = true;

        if ( form.$valid ) {

            Auth.resetPassword($stateParams.forgotKey, $scope.user.password, form.passwordConfirm.$viewValue).then(function() {

                // Password updated - redirect user to login
                $location.path('/login/reset');

            })["catch"]( function(err) {

                err = err.data;
                $scope.errors = {};

                // Update validity of form fields that match the mongoose errors
                angular.forEach(err.errors, function(error, field) {
                    form[field].$setValidity('mongoose', false);
                    $scope.errors[field] = error.message;
                });

            });
        }

    };

    //
    // Returns true if the login form is being
    // displayed after the user has activated
    // their account
    //
    $scope.isActivatedRedirect = function() {
        return !!$state.current.data.activate;
    };

    //
    // Returns true if the login form is being displayed
    // after the user has reset their password
    //
    $scope.isResetPasswordRedirect = function() {

        return !!$state.current.data.reset;
    };

    //
    // Returns true if there are errors with the login form
    //
    $scope.isHasErrors = function() {

        for ( var key in $scope.errors ) {
            return true;
        }

        return false;
    };
});