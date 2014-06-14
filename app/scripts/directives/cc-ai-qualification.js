//
// Handle toggle of checkboxes between AI qualification and "none" option
//

angular.module("psApp").directive("ccAiQualification", function($document) {

    return {
        restrict: "A",
        scope: {
            qualifications: "="
        },
        link: function(scope, element, attrs) {

            element.on("change", function() {

                var qualEls = findQualificationElements();

                // If the checkbox being toggled is the "NONE", and it's
                // being set to true, clear all other checkboxes
                if ( element.val() === "NONE" ) {

                    if ( element.prop("checked") ) {
                        clearAllExceptNone(scope, element, qualEls);
                    }
                }
                // Otherwise, the checkbox being toggled is not the "NONE"
                // checkbox...clear the "NONE" checkbox
                else {

                    if ( element.prop("checked") ) {
                        clearNone(qualEls);
                    }
                }

                // Add/remove qualification from array of qualifications
                updateQualifications(scope, qualEls);
            });
        }
    };

    //
    // PRIVATES
    //

    //
    // Clear all checkboxes except the "none" option.
    //
    function clearAllExceptNone(scope, element, qualificationEls) {

        for ( var i = 0 ; i < qualificationEls.length ; i++ ) {

            var qual = qualificationEls[i];
            if ( qual.val() === "NONE" ) {
                continue;
            }

            qual.prop("checked", false);
        }

    }

    //
    // Clear the "none" checkbox. Add value to
    //
    function clearNone(qualificationEls) {

        for ( var i = 0 ; i < qualificationEls.length ; i++ ) {

            var qual = qualificationEls[i];
            if ( qual.val() === "NONE" ) {
                qual.prop("checked", false);
                break;
            }
        }

    }

    //
    // Add/remove selected qualifications from array
    // of qualifications according to checked values
    //
    function updateQualifications(scope, qualificationEls) {

        // Add qualification to array of qualifications
        scope.$apply(function() {

            scope.qualifications.length = 0;
            for ( var i = 0 ; i < qualificationEls.length ; i++ ) {

                var qual = qualificationEls[i];
                if ( qual.prop("checked") ) {
                    scope.qualifications.push(qual.val());
                }
            }

        });
    }

    //
    // Returns array of qualification checkboxes
    //
    // @returns [angularElement]
    //
    function findQualificationElements() {

        var qualificationsWrapperEl = $document[0].getElementById("qualifications");
        var qualCheckboxes = angular.element(qualificationsWrapperEl).find("input");

        var qualificationEls = [];
        angular.forEach(qualCheckboxes, function(el, index) {
            qualificationEls.push(angular.element(el));
        });

        return qualificationEls;
    }
});