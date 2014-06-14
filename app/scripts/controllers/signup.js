//
// Signup Controller
//

'use strict';

angular.module('psApp').controller('SignupCtrl', function ($scope, Auth, $location, $stateParams) {

    $scope.user = {};
    $scope.errors = {};

    //
    // Generate AI qualifications
    //
    $scope.qualifications = [{
        value: "INCOME",
        description: "I made $200,000 or more in each of the two most recent years and believe I will make at least that much this year."
    }, {
        value: "JOINT_INCOME",
        description: "I have a joint income with my spouse that has exceeded $300,000 for each of the last 2 years and I expect it will exceed that again this year."
    }, {
        value: "NET_WORTH",
        description: "I have an individual net worth, or joint net worth with my spouse, that exceeds $1,000,000 today excluding my primary residence."
    }, {
        value: "REP",
        description: "I am a representative of a bank, insurance company, registered investment company, business development company, or small business investment company interested in investment opportunities on Peloton Street."
    }, {
        value: "NONE",
        description: "None of the above"
    }];

    //
    // Register new user
    //
    $scope.register = function(form) {

        $scope.submitted = true;

        // Confirm at least one AI qualification was selected
        var qualValid = $scope.isQualificationsValid();
        form.qualifications = {
            $error: {
                "required": !qualValid
            }
        };

        if ( form.$valid && qualValid ) {

            Auth.createUser({
                firstName: $scope.user.firstName,
                lastName: $scope.user.lastName,
                email: $scope.user.email,
                phone: $scope.user.phone,
                password: $scope.user.password,
                qualifications: $scope.user.qualifications
            })
            .then( function() {
                // Account created, redirect to success page
                $location.path('/signup/success');
            })
            ["catch"]( function(err) {

                err = err.data;
                $scope.errors = {};

                // Update validity of form fields that match the mongoose errors
                angular.forEach(err.errors, function(error, field) {
                    form[field].$setValidity('mongoose', false);
                    $scope.errors[field] = error.message;
                });

            });
        }
    };

    //
    // Returns true if at least one qualification has been selected
    //
    $scope.isQualificationsValid = function() {

        return $scope.user.qualifications.length > 0;
    };

    //
    // Activate new user
    //
    $scope.activateAccount = function(activationKey) {

        Auth.activateAccount(activationKey).then(function() {
            $location.path('/login/activate');
        });
    };

    // Initialize controller
    init();

    //
    // Privates
    //

    //
    // Initialize controller - check if we're handling an
    // account activation.
    //
    function init() {

        if ( $stateParams.activationKey ) {
            $scope.activateAccount($stateParams.activationKey);
        }
        else {
            $scope.user = {
                qualifications: []
            };
        }
    }

});