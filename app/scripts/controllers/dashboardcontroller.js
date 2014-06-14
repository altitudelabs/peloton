//
// Investment Controller
//

'use strict';

angular.module('psApp').controller('DashboardController', function ($scope, $location, currentUser, investments) {

    // Initialize view
    init();

    //
    // PRIVATES
    //

    //
    // Initialize controller
    //
    function init() {

        $scope.currentUser = currentUser;
        $scope.investments = investments;
    }
});