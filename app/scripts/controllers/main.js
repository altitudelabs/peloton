'use strict';


angular.module('psApp').controller('MainCtrl', function ($scope, Auth) {

    // Make auth service available to all
    $scope.auth = Auth;

    $scope.loaded = false;
    $scope.$on('$viewContentLoaded', function() {
        if ( !$scope.loaded ) {
            $scope.loaded = true;
        }
    });

    // Listen for login event and broadcast corresponding
    // authenticated event...
    $scope.$on("login", function(e) {
        $scope.$broadcast("authenticated");
    });


    //
    // Debug utils
    //

    //
    // Print scope -
    // Call with <button ng-click="printScope($event)">print scope</button>
    //
    $scope.printScope = function(e) {
        console.log(angular.element(e.srcElement).scope());
    };

}).filter('checkRole', function (Auth) {

    // TODO(mim) dupe of auth code - requireRole?

    return function(items, role) {

        var filtered = [];
        angular.forEach(items, function(item) {

            if ( Auth.isHasRole(item.role) ) {
                filtered.push(item);
            }
        });

        return filtered;
    }

});