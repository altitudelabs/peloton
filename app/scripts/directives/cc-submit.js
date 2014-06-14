//
// Trigger "dirty" bit in forms where fields are autofilled
// by browser
//

angular.module("psApp").directive({
    ccSubmit:[
        "$parse",
        function ($parse) {
            return {
                priority:1,
                link: function(scope, element, attrs, ngModel) {

                    // Listen for submit event and populate fields
                    // from autofilled inputs
                    element.bind("submit", function(event) {

                        var inputs = element.find("input");

                        // For each input, set the value on the inputs ngModel controller
                        // to the current value of the input
                        for ( var i = 0 ; i < inputs.length ; i++ ) {

                            var input = angular.element(inputs[i]);
                            if ( input.attr("type") !== "checkbox" && input.attr("type") !== "radio" ) {
                                var value = input.val();
                                input.controller("ngModel").$setViewValue(value);
                            }
                        }

                        // Call function defined in the directive
                        var fn = $parse(attrs.ccSubmit);
                        fn(scope, {
                            $event: event
                        });
                    });
                }
            }
        }
    ]
});