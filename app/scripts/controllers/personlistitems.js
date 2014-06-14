'use strict';

//
// Person List Item Controller
// - Responsible for CRUD functionality for people in the sponsor detail view
//
angular.module("psApp").controller("PersonListItemController", function ($scope, SponsorsService, UploadService, ngDialog) {

    //
    // Returns true if person has been saved.
    // TODO(mim) this is repeated in sponsors and properties list item
    //
    $scope.isSaved = function() {

        return $scope.person && $scope.person._id;
    };

    //
    // Display alert to prompt for delete confirmation
    //
    $scope.confirmDelete = function() {

        // If the person has been saved, confirm we want
        // to delete them
        if ( $scope.isSaved() ) {

            ngDialog.open({
                template:"/partials/people/confirm-delete.html",
                className: "ngdialog-default",
                scope: $scope
            });
        }
        // Otherwise just remove the empty person template
        // from the view
        else {

            removeFromView();
        }
    };

    $scope["delete"] = function() {

        // Close the confirmation prompt
        ngDialog.closeAll();

        SponsorsService.deletePerson({
            id: $scope.person._id,
            sponsorId: $scope.person.sponsorId
        }, function(response) {

            // Remove the person from the view
            removeFromView();

        });
    };

    //
    // Handle updates to person - called from cc-contenteditable
    // directive.
    //
    // Create person if it does not already exist, otherwise
    // update existing person.
    //
    $scope.handleContenteditableUpdate = function() {

        // Either create or update person...
        if ( $scope.isSaved() ) {

            // Update person
            SponsorsService.updatePerson({
                id: $scope.person._id,
                sponsorId: $scope.person.sponsorId
            }, $scope.person);
        }
        else {

            createPerson();
        }
    };

    //
    // Save profile image - called from cc-fileupload directive
    //
    $scope.handleFileDrop = function(file, filePropName) {

        // Clear out existing image and display spinner
        $scope.person[filePropName] = null;
        $scope[filePropName + "Loading"] = true;

        // If person has been created, upload image
        if ( $scope.person && $scope.person._id ) {

            uploadImage();
        }
        // Otherwise person does not exist yet - create it and
        // then upload image
        else {

            createPerson(uploadImage);
        }

        // Create function to upload new image and associate
        // with person
        function uploadImage() {

            // Setup form data
            var formData = new FormData();
            formData.append("file", file[0], file[0].name);

            // Determine URL
            var url = "/api/sponsors/" + $scope.sponsor._id + "/people/" + $scope.person._id + "/" + filePropName;

            UploadService.upload({
                url: url,
                data: formData
            }, function(image) {

                // Update person
                $scope.person[filePropName] = image;
                $scope[filePropName + "Loading"] = false;

            }, angular.noop);
        }

    };

    //
    // Generate URL to profile picture
    // TODO(mim) repeat of hero image
    //
    $scope.getProfilePictureURL = function() {

        if ( !$scope.person ) {
            return "";
        }

        var profilePicture = $scope.person.profilePicture;
        if ( !profilePicture ) {
            return "";
        }

        return "/db-assets/" + profilePicture.id + "." + profilePicture.fileExtension;
    };


    //
    // Privates
    //

    //
    // Remove person from the view
    //
    // TODO(mim) is this right? reaching in to parent scope to remove person (same for property)...
    //
    function removeFromView() {

        var index = $scope.people.indexOf($scope.person);
        $scope.people.splice(index, 1);
    }

    //
    // Create person
    // - Send POST to create person
    // - Update person in scope with newly created ID
    // - Call custom success callback
    //
    function createPerson(customSuccessCallback) {

        // Create new person
        SponsorsService.createPerson({
            sponsorId: $scope.person.sponsorId
        }, $scope.person, function(person) {

            // Update ID of person
            $scope.person._id = person._id;

            if ( customSuccessCallback ) {
                customSuccessCallback();
            }
        });
    }

});
