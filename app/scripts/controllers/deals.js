//
// Deals Controller
// - Client-side
// - Responsible for deal-related list functionality
//
// @param deals List of deals, injected from UI router resolve
//

'use strict';

angular.module('psApp').controller('DealsController', function ($scope, $location, $stateParams, DealsService, deals) {

    // Initialize view
    init();

    //
    // PRIVATES
    //

    //
    // Initialize controller - determine if list
    // or detail/create view
    //
    function init() {

        $scope.deals = deals;
    }
});