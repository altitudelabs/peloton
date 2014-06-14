'use strict';

//
// Sponsor List Item Controller
// - Responsible for CRUD functionality for sponsor in the sponsor list view
//
angular.module('psApp').controller('SponsorListItemController', function ($scope, SponsorsService, ngDialog) {

    //
    // Display alert to prompt for delete confirmation
    //
    $scope.confirmDelete = function() {

        ngDialog.open({
            template:"/partials/sponsors/confirm-delete.html",
            className: "ngdialog-default",
            scope: $scope
        });
    };

    //
    // Delete sponsor
    //
    $scope["delete"] = function() {

        // Close the confirmation prompt
        ngDialog.closeAll();

        var sponsorId = $scope.sponsor._id;

        SponsorsService["delete"]({
            id:sponsorId
        }, function(response) {

            // Sponsor successfully deleted - remove
            // from scope
            var index = $scope.sponsors.indexOf($scope.sponsor);
            $scope.sponsors.splice(index, 1);

        });
    };

    //
    // Return sponsor's hero image URL
    // TODO(mim) repeated in sponsors.js
    //
    $scope.getHeroImageURL = function() {

        if ( !$scope.sponsor ) {
            return "";
        }

        var heroImage = $scope.sponsor.heroImage;
        if ( !heroImage ) {
            return "";
        }

        return "/db-assets/" + heroImage.id + "." + heroImage.fileExtension;
    };

    //
    // Determine link to sponsor detail - display sponsor detail if
    // user is authenticated, otherwise show register page
    //
    $scope.auth.getCurrentUser().then(function(user) {

        if ( user ) {
            $scope.sponsorDetailLink = "/sponsors/" + $scope.sponsor._id;
        }
        else {
            $scope.sponsorDetailLink = "/signup"; // TODO(mim) pull common links file?
        }
    });


});
