'use strict';

angular.module('psApp').controller('FooterController', function ($scope, $location, $q) {

    //
    // Returns true if user is logged in
    //
    $scope.loggedIn = function() {
        return $scope.auth.isLoggedIn();
    }

    //
    // Returns the current user's role, or empty
    // string if none
    //
    $scope.getCurrentUserRole = function() {
        return $scope.auth.getCurrentUserRole();
    }
});
