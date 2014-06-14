'use strict';

angular.module('psApp').controller('NavbarCtrl', function ($scope, $location, $q) {

    $scope.menu = [
        {
            'title': 'My Dashboard',
            'link': '/dashboard',
            'role': 'user'
        },
        {
            'title': 'Deals',
            'link': '/deals',
            'role': 'user'
        },
        {
            'title': 'Sponsors',
            'link': '/sponsors',
            'role': ['visitor','user']
        },
        {
            'title': 'Team',
            'link': '/team',
            'role': ['visitor','user']
        },
        {
            'title': 'FAQ',
            'link': '/faq',
            'role': ['visitor','user']
        },
        {
            'title': 'Contact Us',
            'link': '/contact',
            'role': ['visitor','user']
        },
        {
            'title': 'Login',
            'link': '/login',
            'role': 'visitor'
        },
        {
            'title': 'Sign Up',
            'link': '/signup',
            'role': 'visitor'
        }
    ];

    //
    // Logout user
    //
    $scope.logout = function () {

        $scope.auth.logout().then(function() {

            // Logout call back - go back to login page
            $location.path('/login');
        });
    };

    //
    // Returns true if user is logged in
    //
    $scope.loggedIn = function() {
        return $scope.auth.isLoggedIn();
    };

    //
    // Returns the current user's role, or empty
    // string if none
    //
    $scope.getCurrentUserRole = function() {
        return $scope.auth.getCurrentUserRole();
    };

    //
    // Add current user to scope
    //
    $scope.auth.getCurrentUser().then(function(user) {

        if ( user ) {
            $scope.currentUser = user;
        }
    });

    //
    // Listen for authenticated events broadcast from root scope
    //
    $scope.$on("authenticated", function() {

        // TODO(mim) dupe of below
        $scope.auth.requireRole("admin").then(function() {
            $scope.admin = true;
        })["catch"](function() {
            $scope.admin = false;
        });

        // TODO(mim) dupe of below
        $scope.auth.getCurrentUser().then(function(user) {

            if ( user ) {
                $scope.currentUser = user;
            }
        });
    });

    //
    // Determine if current user is an admin
    //
    $scope.auth.requireRole("admin").then(function() {
        $scope.admin = true;
    });

    //
    // Get the current user's name - call once on load, subsequent
    // calls on login
    //
    $scope.auth.getCurrentUser().then(function(user) {

        if ( user ) {
            $scope.currentUser = user;
        }
    });

    //
    // Returns true if route matches the current path
    //
    $scope.isActive = function(route) {
        return route === $location.path();
    };
});
