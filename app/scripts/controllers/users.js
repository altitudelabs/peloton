'use strict';

//
// User Controller
// - Responsible for user-related CRUD functionality
//
angular.module('psApp').controller('UsersController', function ($scope, users) {

    $scope.users = users;
});
