//
// Sponsors Controller
// - Client-side
// - Responsible for sponsor-related list functionality
//
// @param sponsors List of sponsors, injected from UI router resolve
//

'use strict';

angular.module('psApp').controller('SponsorsController', function ($scope, $location, $stateParams, SponsorsService, sponsors) {

    // Initialize controller
    init();

    //
    // Generate the URL to the hero image
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
    // Generate URL to logo
    // TODO(mim) 0. repeat of hero image, repeated in sponsor controller
    //
    $scope.getLogoImageURL = function() {

        if ( !$scope.sponsor ) {
            return "";
        }

        var logoImage = $scope.sponsor.logoImage;
        if ( !logoImage ) {
            return "";
        }

        return "/db-assets/" + logoImage.id + "." + logoImage.fileExtension;
    };

    //
    // Returns true if user is admin
    // TODO(mim) 0. dupe of sponsor controller
    //
    $scope.auth.requireRole("admin").then(function() {
        $scope.isAdmin = true;
    });

    //
    // PRIVATES
    //

    //
    // Initialize controller - chunk list of sponsors into
    // groups of three for display
    //
    function init() {

        $scope.sponsors = sponsors;
        initWatchSponsors();

    }

    //
    // Add watch to group people into groups
    // of three - allow for easy rendering of
    // people into rows
    //
    function initWatchSponsors() {

        $scope.$watch("sponsors", function() {

            if ( $scope.sponsors.length === 0 ) {
                $scope.sponsorGroups = [];
            }

            $scope.sponsorGroups = $scope.sponsors.chunk(3);

        }, true);
    }

});
