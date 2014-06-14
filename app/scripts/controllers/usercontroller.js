'use strict';

//
// User Controller
// - Responsible for user-related CRUD functionality
//
angular.module('psApp').controller('UserController', function ($scope, user, investments) {

    $scope.user = user;
    $scope.investments = investments;
});
