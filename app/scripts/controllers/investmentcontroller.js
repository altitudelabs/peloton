//
// Investment Controller
//

'use strict';

angular.module('psApp').controller('InvestmentController', function ($scope, $location, DealsService, currentUser, deal, investment) {

    // Initialize view
    init();

    //
    // Returns true if the user has already invested in this deal
    //
    $scope.isInvested = function() {
        return !!$scope.investment._id;
    };

    //
    // Submit investment form
    //
    $scope.invest = function(form) {

        $scope.submitted = true;

        if ( form.$valid ) {

            DealsService.invest({
                id: $scope.deal._id
            }, {
                deal: $scope.deal._id,
                amount: $scope.investment.amount
            });

            // Show thank you immediately
            $scope.invested = true;
        }
    };

    //
    // PRIVATES
    //

    //
    // Initialize controller
    //
    function init() {

        $scope.currentUser = currentUser;

        // Confirm user is accredited
        // TODO(mim) use RBAC
        if ( !$scope.currentUser.accreditedInvestor ) {
            $location.path("/403");
        }

        $scope.deal = deal;
        $scope.investment = investment || {};
    }
});