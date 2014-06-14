//
// Controller for handling errors
// - Adds minor code to scope
//

'use strict';

angular.module('psApp').controller('ErrorController', function ($scope, $stateParams) {

    init();

    //
    // PRIVATES
    //

    //
    // Initialize scope
    //
    function init() {

        $scope.minorCode = $stateParams.minorCode;
    }
});
