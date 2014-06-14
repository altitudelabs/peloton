//
// Handle toggle of checkboxes between AI qualification and "none" option
//

angular.module("psApp").directive("ccToggle", function($document) {

    return {
        restrict: "A",
        link: function(scope, element, attrs) {

            // Find the anchor and content elements for this toggle
            var children = element.children();
            var anchor;
            for ( var i = 0 ; i < children.length ; i++ ) {

                var childEl = angular.element(children[i]);
                if ( childEl.hasClass("toggle-anchor") ) {
                    anchor = childEl;
                    break;
                }
            }

            // Register click handler to toggle "open" class
            // on the container (element)
            anchor.on("click", function(e) {

                e.preventDefault();

                element.toggleClass("open");
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