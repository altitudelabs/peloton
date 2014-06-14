'use strict';

angular.module('psApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ngDialog',
    'angularFileUpload'
]).config(function ($stateProvider, $urlRouterProvider, $locationProvider, $parseProvider, $httpProvider) {

    // Redirect "" URL to "/" - this is true when hitting
    // the home page in IE8 (as IE8 must use hash bang mode not
    // HTML5 mode and the root URL is interpreted as "")
    $urlRouterProvider.when('', '/');

    // Set up states...
    $stateProvider
    .state('badRequest', {

        url: '/400',
        templateUrl: '/partials/400',
        data: {
            access:  ['visitor','user']
        },
        title: 'Bad Request - Error 400'

    })
    .state('notAuthorized',{

        url: '/403',
        templateUrl: '/partials/403',
        data: {
            access:  ['visitor','user']
        },
        title: 'Not Authorized - Error 403'

    })
    .state('notFound', {

        url: '/404',
        templateUrl: '/partials/404',
        data: {
            access:  ['visitor','user']
        },
        title: 'Not Found - Error 404!'

    })
    .state('error422WithMinorCode',{

        url: '/422/:minorCode',
        templateUrl: '/partials/422',
        data: {
            access:  ['visitor','user']
        },
        title: 'Client Error - Error 422',
        controller: "ErrorController"

    })
    .state('error422',{

        url: '/422',
        templateUrl: '/partials/422',
        data: {
            access:  ['visitor','user']
        },
        title: 'Client Error - Error 422',
        controller: "ErrorController"

    })
    .state('error500',{

        url: '/500',
        templateUrl: '/partials/500',
        data: {
            access:  ['visitor','user']
        },
        title: 'Server Error - Error 500'

    })
    .state('loginActivate',{

        url: '/login/activate',
        templateUrl: '/partials/login',
        controller: 'LoginCtrl',
        data: {
            access: 'visitor',
            activate: true
        },
        title: 'Login'


    }).state('loginReset',{

        url: '/login/reset',
        templateUrl: '/partials/login',
        controller: 'LoginCtrl',
        data: {
            access: 'visitor',
            reset: true
        },
        title: 'Login'


    }).state('login',{

        url: '/login',
        templateUrl: '/partials/login',
        controller: 'LoginCtrl',
        data: {
            access: 'visitor'
        },
        title: 'Login'

    }).state('home',{

        url: '/',
        title: "Introducing Transparency to Real Estate Investing",
        templateUrl: '/partials/site/index',
        data: {
            access: ['visitor','user']
        }

    }).state('team', {

        title: "Our Team",
        url: '/team',
        templateUrl: '/partials/site/team',
        data: {
            access: ['visitor','user']
        }

    }).state("faq", {

        url: '/faq',
        title: "FAQ",
        templateUrl: '/partials/site/faq',
        data: {
            access: ['visitor','user']
        }

    }).state("contact", {

        url: '/contact',
        title: "Contact Us",
        templateUrl: '/partials/site/contact',
        controller: "ContactController",
        data: {
            access: ['visitor','user']
        }

    })
    .state('sponsorSplash', {

        title:"Get Funding",
        url: '/get-funding',
        templateUrl: "/partials/site/sponsor-splash",
        data: {
            access: ['visitor','user']
        }

    })
    .state('investorSplash', {

        title:"Invest",
        url: '/invest',
        templateUrl: "/partials/site/investor-splash",
        data: {
            access: ['visitor','user']
        }

    })
    .state('deals', {

        title: 'Deals',
        url: '/deals',
        templateUrl: "/partials/deals/index",
        controller: "DealsController",
        data: {
            access: 'user'
        },
        resolve: {
            deals: function($stateParams, DealsService) {

                return DealsService.query().$promise;
            }
        }

    })
    .state('dealShow', {

        url: '/deals/:id',
        title: "Deal Detail",
        templateUrl: "/partials/deals/show",
        controller: "DealController",
        data: {
            access: 'user'
        },
        resolve: {
            deal: function($stateParams, DealsService) {

                return DealsService.get({
                    id: $stateParams.id
                }).$promise;
            },
            investment: function($stateParams, DealsService, deal) {

                return DealsService.isInvestor({
                    id: deal._id
                }).$promise;
            }
        }

    })
    .state('invest', {

        url: '/deals/:id/invest',
        title: "Invest",
        templateUrl: "/partials/deals/invest",
        controller: "InvestmentController",
        data: {
            access: 'user'
        },
        resolve: {
            currentUser: function($stateParams, Auth) {

                return Auth.getCurrentUser();
            },
            deal: function($stateParams, DealsService) {

                return DealsService.get({
                    id: $stateParams.id
                }).$promise;
            },
            investment: function($stateParams, DealsService, deal) {

                return DealsService.isInvestor({
                    id: deal._id
                }).$promise;
            }
        }

    })
    .state('users', {

        url: '/users',
        title: "Users",
        templateUrl: "/partials/users/index",
        controller: "UsersController",
        data: {
            access: 'user'
        },
        resolve: {
            users: function($stateParams, UsersService) {

                return UsersService.query().$promise;
            }
        }

    })
    .state('userShow', {

        url: '/users/:id',
        title: "Users",
        templateUrl: "/partials/users/show",
        controller: "UserController",
        data: {
            access: 'user'
        },
        resolve: {
            user: function($stateParams, UsersService) {

                return UsersService.get({
                    id: $stateParams.id
                }).$promise;
            },
            investments: function($stateParams, InvestmentsService, user) {

                return InvestmentsService.query({
                    userId: user._id
                }).$promise;
            }
        }

    })
    .state('userDashboard', {

        url: '/dashboard',
        title: "Users",
        templateUrl: "/partials/users/dashboard",
        data: {
            access: 'user'
        },
        controller: "DashboardController",
        resolve: {
            currentUser: function($stateParams, Auth) {

                return Auth.getCurrentUser();
            },
            investments: function($stateParams, InvestmentsService, currentUser) {

                return InvestmentsService.query({
                    userId: currentUser._id
                }).$promise;
            }
        }

    })
    .state('sponsors', {

        title:"Sponsors",
        url: '/sponsors',
        templateUrl: "/partials/sponsors/index",
        controller: "SponsorsController",
        data: {
            access: ['visitor', 'user']
        },
        resolve: {
            sponsors: function($stateParams, SponsorsService) {

                return SponsorsService.query().$promise;
            }
        }

    })
    .state('sponsorNew', {

        title: 'Sponsor Detail',
        url: '/sponsors/new',
        templateUrl: "/partials/sponsors/show",
        controller: "SponsorController",
        data: {
            access: 'admin'
        },
        resolve: {
            sponsor: function() {

                // Inject null sponsor into sponsor controller to
                // indicate we are creating a new sponsor
                return null;
            }
        }

    })
    .state('sponsorShow', {

        title: 'Sponsor Detail',
        url: '/sponsors/:id',
        templateUrl: "/partials/sponsors/show",
        controller: "SponsorController",
        data: {
            access: 'user'
        },
        resolve: {
            sponsor: function($stateParams, SponsorsService) {

                return SponsorsService.get({
                    id: $stateParams.id
                }).$promise;
            }
        }

    })
    .state('signup', {

        url: '/signup',
        title: "Sign Up!",
        templateUrl: '/partials/signup',
        controller: 'SignupCtrl',
        data: {
            access: 'visitor'
        }

    })
    .state('signupSuccess', {

        url: '/signup/success',
        templateUrl: '/partials/signup-success',
        controller: 'SignupCtrl',
        data: {
            access: 'visitor'
        },
        title: 'Welcome'

    })
    .state("activate", {

        url: '/signup/activate/:activationKey',
        controller: 'SignupCtrl',
        template : "<div></div>",
        data: {
            access: ['visitor','user']
        }

    })
    .state("requestPasswordReset", {

        url: '/user/password/request-reset',
        title: "Reset Password",
        templateUrl: '/partials/forgot.html',
        controller: 'LoginCtrl',
        data: {
            access: 'visitor'
        }

    })
    .state('requestPasswordResetSuccess', {

        url: '/user/password/request-reset/success',
        templateUrl: '/partials/forgot-success',
        controller: 'LoginCtrl',
        data: {
            access: 'visitor'
        },
        title: 'Reset Password Success'

    })
    .state("resetPassword", {

        title:"Reset Password",
        url: '/user/password/reset/:forgotKey',
        templateUrl : '/partials/reset-password',
        controller: 'LoginCtrl',
        data: {
            access: 'visitor'
        }

    })
    .state('logout', {

        url: '/logout',
        controller: function(Auth) {

            // TODO(dave) code duplication with menu controller
            Auth.logout().then(function() {
                window.location.replace('/logout');
            });
        },
        template : "<div></div>" ,
        data: {
            access: ['visitor','user']
        }

    });

    $urlRouterProvider.otherwise('/404');

    $locationProvider.html5Mode(true);

    //
    // Intercept and handle specific response codes (403, 500, 422 etc)
    //
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
        return {
            "responseError": function(response) {


                if ( response.status === 400 ) {

                    $location.path("/400");
                    return $q.reject(response);
                }
                else if ( response.status === 403 ) {

                    $location.path("/403");
                    return $q.reject(response);
                }
                else if ( response.status === 422 ) {

                    var ccMinorCode = response.data.ccMinorErrorCode;
                    if ( ccMinorCode ) {
                        $location.path("/422/" + ccMinorCode);
                    }
                    return $q.reject(response);
                }
                else if ( response.status === 500 ) {

                    $location.path("/500");
                    return $q.reject(response);
                }
                else {

                    return $q.reject(response);
                }
            }
        };
    }]);
})
.run(function ($rootScope,  $state, $location, $window, Auth) {

    //
    // Redirect to login if route requires auth and
    // you're not logged in
    //
    $rootScope.$on('$stateChangeStart', function (event, toState) {

        // Scroll to top
        $window.scrollTo(0,0);

        // Check if user is authorized to view page
        Auth.requireRole(toState.data.access)["catch"](function(authorized) {
            event.preventDefault();

            if ( Auth.isLoggedIn() ) {

                if ( toState.name === 'login' ||
                    toState.name ==='signup'  ) {
                    $state.go('deals');
                }
                else{
                    $state.go('notAuthorized');
                }
            }
            else {
                $state.go('login');
            }
        });

    });

    //
    // Handle state change success
    //
    $rootScope.$on("$stateChangeSuccess",
        function (event, toState, toParams, fromState, fromParams) {

        $rootScope.title = toState.title;
    });

    //
    // Handle state change errors
    //
    $rootScope.$on('$stateChangeError',
        function(event, toState, toParams, fromState, fromParams, error) {

            if ( error.status === 400 ) {
                $state.go('badRequest');
            }
            else if ( error.status === 403 ) {
                $state.go('notAuthorized');
            }
            else if ( error.status === 404 ) {
                $state.go('notFound');
            }
            else if ( error.status === 422 ) {
                $state.go('error422');
            }
            else {
                $state.go('error500');
            }
    });
});