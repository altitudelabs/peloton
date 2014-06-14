//
// Use overlay to prevent mouse scroll over map
//

angular.module("psApp").directive("ccMap", function($document) {

    return {
        restrict: "A",
        link: function(scope, element, attrs) {

            // Setup the lat/long
            var lat = attrs.ccMapLat;
            var long = attrs.ccMapLong;
            var latLong = new google.maps.LatLng(parseFloat(lat,10), parseFloat(long,10));

            // Setup the map options
            var mapOptions = {
                center: latLong,
                zoom: 14,
                scrollwheel: false
            };

            if ( Modernizr.touch ) {
                mapOptions.draggable = false;
            }

            // Create the map
            var map = new google.maps.Map(element[0], mapOptions);

            // Drop a marker!
            var marker = new google.maps.Marker({
                position: latLong,
                title:"CrowdBite"
            });
            marker.setMap(map);
        }
    };

});