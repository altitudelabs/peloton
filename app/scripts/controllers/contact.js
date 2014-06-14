//
// Contact Controller
// - Responsible for handling contact form functionality
//

'use strict';

angular.module('psApp').controller('ContactController', function ($scope, $http) {

    $scope.emailSent = false;
    $scope.contact = {};

    //
    // Submit contact form from contact page
    //
    $scope.submitContact = function(form) {

        $scope.submitted = true;

        if ( form.$valid ) {

            var data = {
                name: $scope.contact.name,
                email: $scope.contact.email,
                message: $scope.contact.message
            };

            $http.post('/api/contact', data);

            // Show thank you immediately
            $scope.emailSent = true;
        }
    };

    //
    // Submit contact form from sponsor page (companies/get-funding)
    //
    $scope.submitContact = function(form) {

        $scope.submitted = true;

        if ( form.$valid ) {

            var data = {
                name: $scope.contact.name,
                company: $scope.contact.company,
                phone: $scope.contact.phone,
                email: $scope.contact.email,
                message: $scope.contact.message
            };

            $http.post('/api/sponsors/get-funded-contact', data);

            // Show thank you immediately
            $scope.emailSent = true;
        }
    };
});