//
// Investment Controller
//

'use strict';

angular.module('psApp').controller('InvestmentListItemController', function ($scope) {


    //
    // Returns true if the user has already invested in this deal
    //
    $scope.getStatus = function() {

        if ( $scope.investment.status === 0 ) {
            return "Pending";
        }
        else {
            return "TO DO"
        }
    };

});