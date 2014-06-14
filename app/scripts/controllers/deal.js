//
// Deals Controller
// - Client-side
// - Responsible for deal-related CRUD functionality
//
// @param company Deal resource, injected from UI router resolve
//

'use strict';

angular.module('psApp').controller('DealController', function ($scope, $location, $stateParams, DealsService, deal, investment) {

    // Initialize view
    init();

    //
    // Returns true if the user has already invested in this deal
    //
    $scope.isInvested = function() {
        return !!$scope.investment._id;
    };

    //
    // Add current user to scope
    //
    $scope.auth.getCurrentUser().then(function(user) {

        if ( user ) {
            $scope.currentUser = user;
        }
    });

    //
    // PRIVATES
    //

    //
    // Initialize controller
    //
    function init() {

        $scope.deal = deal;
        $scope.investment = investment;
    }
});