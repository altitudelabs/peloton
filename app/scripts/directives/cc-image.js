//
// Handles loading of image source from values in scope.
//

angular.module("psApp").directive("ccImage", function() {

    return {
        restrict: "A",
        require: "?ngModel",
        scope: {
            srcFn: "&ccImage"
        },
        link: function(scope, element) {

            // Get the function to watch changes on
            var srcFnHandler = scope.srcFn();

            // Watch for changes in the image source
            scope.$watch(srcFnHandler, function(newValue) {
                element.attr("src", newValue);
            });
        }
    };

});