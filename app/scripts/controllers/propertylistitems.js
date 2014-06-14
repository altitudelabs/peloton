'use strict';

//
// Property List Item Controller
// - Responsible for CRUD functionality for properties in the sponsor detail view
//
angular.module("psApp").controller("PropertyListItemController", function ($scope, SponsorsService, UploadService, ngDialog) {

    //
    // Returns true if property has been saved.
    // TODO(mim) this is repeated in sponsors and properties list item
    //
    $scope.isSaved = function() {

        return $scope.property && $scope.property._id;
    };

    //
    // Display alert to prompt for delete confirmation
    //
    $scope.confirmDelete = function() {

        // If the property has been saved, confirm we want
        // to delete them
        if ( $scope.isSaved() ) {

            ngDialog.open({
                template:"/partials/properties/confirm-delete.html",
                className: "ngdialog-default",
                scope: $scope
            });
        }
        // Otherwise just remove the empty property template
        // from the view
        else {

            removeFromView();
        }
    };

    $scope["delete"] = function() {

        // Close the confirmation prompt
        ngDialog.closeAll();

        SponsorsService.deleteProperty({
            id: $scope.property._id,
            sponsorId: $scope.property.sponsorId
        }, function(response) {

            // Remove the property from the view
            removeFromView();

        });
    };

    //
    // Handle updates to property - called from cc-contenteditable
    // directive.
    //
    // Create property if it does not already exist, otherwise
    // update existing property.
    //
    $scope.handleContenteditableUpdate = function() {

        // Either create or update property...
        if ( $scope.isSaved() ) {

            // Update property
            SponsorsService.updateProperty({
                id: $scope.property._id,
                sponsorId: $scope.property.sponsorId
            }, $scope.property);
        }
        else {

            // Create new property
            createProperty();
        }
    };

    //
    // Save hero image - called from cc-fileupload directive
    // TODO(mim) this is repeated in person list item and in sponsor
    //
    $scope.handleFileDrop = function(file, filePropName) {

        // Clear out existing image and display spinner
        $scope.property[filePropName] = null;
        $scope[filePropName + "Loading"] = true;

        // If property has been created, upload image
        if ( $scope.property && $scope.property._id ) {

            uploadImage();
        }
        // Otherwise property does not exist yet - create it and
        // then upload image
        else {

            createProperty(uploadImage);
        }

        // Create function to upload new image and associate
        // with person
        function uploadImage() {

            // Setup form data
            var formData = new FormData();
            formData.append("file", file[0], file[0].name);

            // Determine URL
            var url = "/api/sponsors/" + $scope.sponsor._id + "/properties/" + $scope.property._id + "/" + filePropName;

            UploadService.upload({
                url: url,
                data: formData
            }, function(image) {

                // Update property
                $scope.property[filePropName] = image;
                $scope[filePropName + "Loading"] = false

            }, angular.noop);
        }

    };

    //
    // Generate URL to hero image
    // TODO(mim) repeat of hero image on sponsor (and profile pic on person)
    //
    $scope.getHeroImageURL = function() {

        if ( !$scope.property ) {
            return "";
        }

        var heroImage = $scope.property.heroImage;
        if ( !heroImage ) {
            return "";
        }

        return "/db-assets/" + heroImage.id + "." + heroImage.fileExtension;
    };

    //
    // Privates
    //

    //
    // Create property
    // - Send POST to create property
    // - Update property in scope with newly created ID
    // - Call custom success callback
    //
    function createProperty(customSuccessCallback) {

        // Create new property
        SponsorsService.createProperty({
            sponsorId: $scope.property.sponsorId
        }, $scope.property, function(property) {

            // Update ID of property
            $scope.property._id = property._id;

            if ( customSuccessCallback ) {
                customSuccessCallback();
            }
        });
    }

    //
    // Remove property from the view
    //
    function removeFromView() {

        var index = $scope.properties.indexOf($scope.property);
        $scope.properties.splice(index, 1);
    }

});
