'use strict';

//
// User List Item Controller
// - Responsible for CRUD functionality for users in the user list view
//
angular.module('psApp').controller('UserListItemController', function ($scope, $q, UsersService, ngDialog) {

    //
    // Display alert to prompt for deactivation confirmation
    //
    $scope.confirmDeactivate = function() {

        ngDialog.open({
            template:"/partials/users/confirm-deactivate.html",
            className: "ngdialog-default",
            scope: $scope
        });
    };

    //
    // Deactivate user
    //
    $scope.deactivate = function() {

        // Close the confirmation prompt
        ngDialog.closeAll();

        // Deactivate user
        var user = $scope.user;

        UsersService.deactivate({
            id:user._id
        }, function(updatedUser) {

            // Update the user's status - triggers
            // update in view
            user.status = updatedUser.status;

        });
    };

    //
    // Display alert to prompt for reactivation confirm
    //
    $scope.confirmReactivate = function() {

        ngDialog.open({
            template:"/partials/users/confirm-reactivate.html",
            className: "ngdialog-default",
            scope: $scope
        });
    };

    //
    // Reactivate user
    //
    $scope.reactivate = function() {

        // Close the confirmation prompt
        ngDialog.closeAll();

        // Reactivate user
        var user = $scope.user;

        UsersService.reactivate({
            id:user._id
        }, function(updatedUser) {

            // Update the user's status - triggers
            // update in view
            user.status = updatedUser.status;

        });
    };

    //
    // Returns true if user is suspended
    //
    $scope.isDeactivated = function() {

        return $scope.user.status === 1;
    };

    //
    // Returns true if the user to be deactivated is
    // not the current user and if the user has not
    // yet been deactivated
    //
    $scope.auth.getCurrentUser().then(function(currentUser) {
        $scope.isDeactivateDisabled = (currentUser && currentUser._id === $scope.user._id);
    });

    //
    // Returns true if user (for this list item) is admin
    //
    $scope.isAdmin = function() {

        return $scope.user.role === "admin";
    };
});
