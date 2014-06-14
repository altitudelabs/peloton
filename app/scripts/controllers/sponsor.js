//
// Sponsor Controller
// - Client-side
// - Responsible for sponsor-related CRUD functionality
// - Used for both detail view of existing sponsor and create new sponsor
//
// @param sponsor Sponsor resource, injected from UI router resolve
//

'use strict';

angular.module('psApp').controller('SponsorController', function ($scope, $location, SponsorsService, UploadService, sponsor) {

    // Initialize controller
    init();

    //
    // Returns true if sponsor has been saved. Called
    // when determining if team members or properties
    // can be added to a sponsor. Will return false
    // when sponsor has not yet been created.
    //
    $scope.isSaved = function() {

        return $scope.sponsor && $scope.sponsor._id;
    };

    //
    // Determine if user is admin
    //
    $scope.auth.requireRole("admin").then(function() {
        $scope.isAdmin = true;
    });

    //
    // Handle updates to sponsor - called from cc contenteditable
    // directive.
    //
    // Create sponsor if it does not already exist, otherwise
    // update existing sponsor.
    //
    $scope.handleContenteditableUpdate = function() {

        // Update sponsor
        if ( $scope.isSaved() ) {

            SponsorsService.update({
                id: $scope.sponsor._id
            }, $scope.sponsor);
        }
        // Create sponsor
        else {

            createSponsor();
        }
    };

    //
    // Save hero/logo image - called from cc-fileupload directive
    //
    $scope.handleFileDrop = function(file, filePropName) {

        // Clear out existing image and display spinner
        $scope.sponsor[filePropName] = null;
        $scope[filePropName + "Loading"] = true;

        // If sponsor has been created, upload image
        if ( $scope.sponsor && $scope.sponsor._id ) {

            uploadImage();
        }
        // Otherwise sponsor does not exist yet - create it and
        // then upload image
        else {

            createSponsor(uploadImage);
        }

        // Create function to upload new image and associate
        // with sponsor
        function uploadImage() {

            // Setup form data
            var formData = new FormData();
            formData.append("file", file[0], file[0].name);

            // Determine URL
            var url = "/api/sponsors/" + $scope.sponsor._id + "/" + filePropName;

            UploadService.upload({
                url: url,
                data: formData
            }, function(image) {

                // Update
                $scope.sponsor[filePropName] = image;
                $scope[filePropName + "Loading"] = false;
            }, angular.noop);
        }
    };

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
    // TODO(mim) 0. repeat of hero image
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
    // Add person to sponsor
    //
    $scope.addPerson = function() {

        // Only add person if there is not currently
        // an unsaved person in the list of people
        var peopleCount = $scope.people.length;
        if ( peopleCount > 0 ) {

            var firstPerson = $scope.people[0];
            if ( !firstPerson._id ) {
                return;
            }
        }

        // Otherwise we're good to go - add blank person
        // template to list of people
        $scope.people.push({
            sponsorId: $scope.sponsor._id
        });
    };

    //
    // Add property to sponsor
    //
    $scope.addProperty = function() {

        // Only add property if there is not currently
        // an "empty" property in the list of properties
        var propertyCount = $scope.properties.length;
        if ( propertyCount > 0 ) {

            var firstProperty = $scope.properties[0];
            if ( !firstProperty._id ) {
                return;
            }
        }

        // Otherwise we're good to go - add blank person
        // template to list of people
        $scope.properties.push({
            sponsorId: $scope.sponsor._id
        });
    };

    //
    // Privates
    //

    //
    // Initialize controller - list people and properties
    // if we are in detail mode (as opposed to create mode)
    //
    function init() {

        if ( sponsor ) {

            $scope.sponsor = sponsor;
            listPeople(sponsor._id);
            listProperties(sponsor._id);
        }
        else {

            // Initialize sponsor, people and properties
            $scope.sponsor = {
                sectionHeading: "Featured Properties",
                option0Name: "Under Management",
                option1Name: "Developed"
            };
            $scope.people = [];
            $scope.properties = [];

            // Add watch to group people and properties
            // into groups of three - allow for easy rendering
            // of rows
            initWatchPeople();
            initWatchProperties();
        }
    }

    //
    // Load people associated with the selected sponsor
    //
    function listPeople(sponsorId) {

        // Query for people who work for this sponsor
        SponsorsService.people({
            sponsorId: sponsorId
        }, function(people) {

            $scope.people = people;

            // Add watch to group people to group them
            // into groups of three - allow for easy rendering
            // of rows
            initWatchPeople();
        });

    }

    //
    // Load properties associated with the selected sponsor
    //
    function listProperties(sponsorId) {

        // Query for properties associated with
        // this sponsor
        SponsorsService.properties({
            sponsorId: sponsorId
        }, function(properties) {

            $scope.properties = properties;

            // Add watch to group properties to group them
            // into groups of three - allow for easy rendering
            // of rows
            initWatchProperties();
        });
    }

    //
    // Add watch to group people into groups
    // of three - allow for easy rendering of
    // people into rows
    //
    function initWatchPeople() {

        $scope.$watch("people", function() {

            if ( $scope.people.length === 0 ) {
                $scope.peopleGroups = [];
            }

            $scope.peopleGroups = $scope.people.chunk(3);

        }, true);
    }

    //
    // Add watch to group properties into groups
    // of three - allow for easy rendering of
    // properties into rows
    //
    function initWatchProperties() {

        $scope.$watch("properties", function(newValue, oldValue) {

            if ( $scope.properties.length === 0 ) {
                $scope.propertyGroups = [];
            }

            $scope.propertyGroups = $scope.properties.chunk(3);

        }, true);
    }

    //
    // Create sponsor
    // - Send POST to create sponsor
    // - Update sponsor in scope with newly created ID
    // - Call custom success callback
    //
    function createSponsor(customSuccessCallback) {

        // Create new sponsor - sponsor can be potentially be
        // an empty object if first edit is a file drop and no
        // other values have been specified...
        SponsorsService.save($scope.sponsor, function(sponsor) {

            // Update ID of sponsor
            $scope.sponsor._id = sponsor._id;

            // Update URL with newly created sponsor ID
            $location.path("/sponsors/" + sponsor._id);

            if ( customSuccessCallback ) {
                customSuccessCallback();
            }
        });
    }

});