//
// Handle password and password confirm functionality
//
//

angular.module("psApp").directive("ccPasswordConfirm", function() {

    return {
        restrict: "A",
        require: "ngModel",
        link: function(scope, element, attrs, ctrl) {

            // Find the password element
            var form = element.parent()[0];
            var inputs = form.getElementsByTagName("input");
            var passwordInput;
            for ( var i = 0 ; i < inputs.length ; i++ ) {

                var input = inputs[i];
                var inputName = input.getAttribute("name");
                if ( inputName === "password" ) {
                    passwordInput = input;
                    break;
                }
            }

            // We must have a password input to continue
            if ( !passwordInput ) {
                return;
            }

            // Convert password input into angular element for easy
            // event listener registration etc
            passwordInput = angular.element(passwordInput);

            // Mark input as dirty if any keyup event causes
            // two input fields to not equal each other
            function handleKeyUp() {
                scope.$apply(function() {
                    if ( element.val() === passwordInput.val() ) {
                        ctrl.$setValidity("passwordMatch", true);
                    }
                    else {
                        ctrl.$setValidity("passwordMatch", false);
                    }

                });
            }
            element.on("keyup", handleKeyUp);
            passwordInput.on("keyup", handleKeyUp);
        }
    };

});