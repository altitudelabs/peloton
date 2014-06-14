//
// Handle drag and drop file upload
// <img cc-file-upload>
//

angular.module("psApp").directive("ccFileUpload", ["$timeout", function($timeout) {

    return function(scope, element, attrs) {

        // Don't continue if browser does not
        // support drag functionality
        if ( !("draggable" in document.createElement('span')) ) {
            return;
        }

        // Check if user is allowed to edit field - default to false
        scope.$watch("isAdmin", function(newValue) {

            if ( newValue === true ) {

                // Create overlay for when drag zone is active
                var overlay = createOverlay(element);

                // Update class of drop zone when mouse
                // is dragging over it
                var cancel;
                initDragOver(element, overlay, cancel);

                // Remove "active" state of drop zone when
                // mouse move off it
                initDragLeave(element, overlay, cancel);

                // Handle drop
                var filePropName = attrs.ccFileUpload;
                initDrop(scope, element, overlay, filePropName);
            }
        });
    };

    //
    // Add "dragover" event functionality
    //
    function initDragOver(element, overlay, cancel) {

        // Update class of drop zone when mouse
        // is dragging over it
        element[0].addEventListener("dragover", function(evt) {

            $timeout.cancel(cancel);

            evt.stopPropagation();
            evt.preventDefault();

            // Add active class to element
            element.addClass("drop-active");

            // Show overlay
            if ( overlay ) {
                overlay.removeClass("no-show");
            }

        }, false);
    }

    //
    // Add "dragleave" event functionality
    //
    function initDragLeave(element, overlay, cancel) {

        // Remove "active" state of drop zone when
        // mouse move off it
        element[0].addEventListener("dragleave", function(evt) {

            // Remove active class from element
            element.removeClass("drop-active");

            // Hide overlay - put on timeout to avoid
            // the jiggles
            cancel = $timeout(function() {
                overlay.addClass("no-show");
            });

        }, false);

    }

    //
    // Add drop event functionality
    //
    function initDrop(scope, element, overlay, filePropName) {

        element[0].addEventListener("drop", function(evt) {

            evt.stopPropagation();
            evt.preventDefault();

            // Remove active class from element
            element.removeClass("drop-active");

            // Hide overlay
            overlay.addClass("no-show");

            var files = [];
            var fileList = evt.dataTransfer.files;
            if ( fileList != null ) {
                for ( var i = 0; i < fileList.length; i++ ) {
                    files.push(fileList.item(i));
                }
            }

            // Call handleFile Drop on the scope if specified
            var dropCallback = scope.handleFileDrop;
            if ( dropCallback ) {
//                dropCallback(scope, files, filePropName);
                scope.$apply(function () {
                   dropCallback(files, filePropName);
                });
            }

        }, false);
    }


    //
    // Create overlay for when drop zone is active
    //
    function createOverlay(element) {

        var overlay = angular.element("<div>");
        overlay.addClass("drop-active-overlay");
        overlay.addClass("no-show");
        var icon = angular.element("<i>");
        icon.addClass("fa fa-plus");
        overlay.append(icon);
        element.append(overlay);

        return overlay;
    }

}]);