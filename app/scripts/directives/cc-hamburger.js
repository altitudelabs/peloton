//
// Handle toggle of vertical display of menu on mobile devices (by
// clicking on hamburger)
//
//

angular.module("psApp").directive("ccHamburger", function() {

    return {
        restrict: "A",
        link: function(scope, element, attrs) {

            var hamburger = element.find("button");
            if ( !hamburger ) {
                return;
            }

            // Listen for click events on hamburger - show
            // full screen menu
            var navContainer = element.find("ul").parent();
            hamburger.on("click", function(event) {

                element.toggleClass("open");

                // On click, toggle "collapse" class on container
                // around nav items
                if ( navContainer ) {
                    navContainer.toggleClass("collapse");
                }
            });

            // Hide full screen menu on click
            if ( navContainer ) {
                navContainer.on("click", closeMenu);
            }

            // Hide full screen on click of logo
            var brand = element.find("img");
            if ( brand ) {
                brand.on("click", closeMenu);
            }

            // Hide mobile menu
            function closeMenu() {
                element.removeClass("open");
                navContainer.addClass("collapse");
            }

        }
    };

});