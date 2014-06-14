//
// Handle toggle of drop down menu
//

angular.module("psApp").directive("ccDropDown", function($document) {

    return {
        restrict: "A",
        link: function(scope, element, attrs) {

            // Find the drop down to display - should be sibling
            // to the clicked element
            var dropdown = element.parent().find("ul");

            // Define the close event
            var close = function() {
                dropdown.removeClass("show");
            };

            var body = $document[0].body;
            element.on("click", function(event) {

                if ( event.stopPropagation ) {
                    event.stopPropagation();
                }
                else {
                    event.cancelBubble();
                }

                event.preventDefault();

                // Toggle drop down visibility
                dropdown.toggleClass("show");

                // Add event listener to body to close drop down
                if ( dropdown.hasClass("show") ) {

                    if ( body.addEventListener ) {
                        body.addEventListener("click", close, false);
                    }
                    else {
                        body.attachEvent("onclick", close);
                    }

                }
                // Otherwise drop down is closed - remove event listener
                // to close it
                else {

                    if ( body.removeEventListener ) {
                        body.removeEventListener("click", close, false);
                    }
                    else {
                        body.detachEvent("onclick", close);
                    }
                }

            });

        }
    };

});