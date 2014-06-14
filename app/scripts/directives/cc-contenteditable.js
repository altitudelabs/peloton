//
// Handle contenteditable fields
// - Only add contenteditable prop if current user is allowed to edit fields
// - Show placeholder value if specified, toggle on click
//
// TODO(mim) review structure with DR
//

angular.module("psApp").directive("ccContenteditable", function() {

    return {
        restrict: "A",
        require: "?ngModel",
        link: function(scope, element, attrs, ngModel) {

            // Must have ngModel to continue
            if ( !ngModel ) {
                return;
            }

            // Get the placeholder value
            var placeholderValue = attrs.ccContenteditablePlaceholder;

            // Check if user is allowed to edit field - default to false
            var enableContenteditable = false;
            scope.$watch("isAdmin", function(newValue) {

                if ( newValue === true ) {
                    enableContenteditable = true;
                    initContenteditable(scope, element, attrs, ngModel);
                }
            });

            // Specify how UI should be updated
            ngModel.$render = function() {

                var newValue = ngModel.$viewValue;

                // Handle contenteditable-related functionality if enabled
                if ( enableContenteditable ) {

                    // If no value is specified, display placeholder
                    if ( !newValue ) {
                        newValue = placeholderValue || "";
                    }

                    // Display value
                    element.html(newValue);

                    // Update class on field to indicate placeholder if
                    // default text is visible
                    element.toggleClass("placeholder", (newValue === placeholderValue));

                    // Keep a record of the new value to we can track changes
                    element.data("ccContenteditablePrevious", newValue);
                }
                // Otherwise just set the value on the element
                else {
                    element.html(newValue);
                }
            };
        }
    };

    //
    // Initialize the content editable functionality
    //
    function initContenteditable(scope, element, attrs, ngModel) {

        // Add contenteditable attribute to element
        element.attr("contenteditable", true);

        // Listen for blur events to update model
        element.on("blur", function() {
            scope.$apply(function() {
                writeToModel(scope, element, ngModel, previousValue);
            });
        });

        // Store current value, clear placeholder text
        var previousValue = "";
        element.on("mousedown focus", function() {
            previousValue = initFocus(element, attrs.ccContenteditablePlaceholder, ngModel);
        });

        // Render to display placeholder text
        ngModel.$render();
    }

    //
    // Add "focus" event functionality (ie user has clicked into or
    // tabbed into content editable field)
    //
    function initFocus(element, placeholderValue, ngModel) {

        // Remove placeholder text is current value
        // is just the placeholder
        var currentValue = ngModel.$viewValue;
        if ( currentValue === "" ) {

            element.text("");
            element.removeClass("placeholder");

            // Return empty string as the current value so
            // we can track changes
            return "";

        }

        // Otherwise keep a record of the current value so
        // we can track changes
        return currentValue;
    }

    //
    // Write data to model
    //
    function writeToModel(scope, element, ngModel, previousValue) {

        var newValue = element.text().trim();

        // Strip out any HTML
        newValue = newValue.replace(/(<([^>]+)>)/ig, "");

        // Determine if value has changed and trigger
        // change if updated
        // Trigger update event if new value is different from previous value
        if ( newValue !== previousValue
            && scope.handleContenteditableUpdate ) {
            scope.handleContenteditableUpdate();
        }

        ngModel.$setViewValue(newValue);
        ngModel.$render();
    }
});