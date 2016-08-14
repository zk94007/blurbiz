(function () {
    'use strict';

    /**
     * Route configuration for the Blurbiz module.
     */
    angular.module('Blurbiz').config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            // For unmatched routes
            $urlRouterProvider.otherwise('/login');

            // Application routes
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'templates/login.html',
                    controller: 'AuthController',
                    requireAuth: false
                })
                .state('register', {
                    url: '/signup', 
                    templateUrl: 'templates/signup.html',
                    controller: 'AuthController',
                    requireAuth: false
                })
                .state('wait-confirm', {
                    url: '/wait-confirm',
                    templateUrl: 'templates/wait-confirm.html',
                    controller: 'WaitConfirmateEmailController',
                    requireAuth: true
                })
                .state('confirm', {
                    url: '/confirm/{email_code}',
                    templateUrl: 'templates/confirm.html',
                    controller: 'ConfirmateEmailController',
                    requireAuth: true
                })
                .state('index', {
                    url: '/',
                    templateUrl: 'templates/project/all.html',
                    controller: 'Project.IndexController',
                    data: { pageTitle: 'All Projects' },
                    requireAuth: true
                })
                .state('tables', {
                    url: '/tables',
                    templateUrl: 'templates/tables.html',
                    // controller: 'Schedule.IndexController',
                    data: { pageTitle: 'Schedule' },
                    requireAuth: true
                });
        }
    ])
    .run(['$rootScope', '$state', 'LocalStorageService', function($rootScope, $state, LocalStorageService) {
          $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams, options){

                // redirect to login page if user not loggedin
                var token = LocalStorageService.getToken();
                if (toState.requireAuth == true && (token === undefined || token === null)){
                    event.preventDefault();
                    $state.go('login')
                }

                // redirect to wait confirm if email not confirmed
                //todo exclude other routes if needed
                var exclude_routes = [
                  'login',
                  'register',
                  'confirm',
                  'wait-confirm'
                ];
                var userEmailisConfirmed = LocalStorageService.get('is_confirmed');
                userEmailisConfirmed = (userEmailisConfirmed !== undefined && userEmailisConfirmed !== null) ? JSON.parse(userEmailisConfirmed) : false;
                if (exclude_routes.indexOf(toState.name) === -1 && userEmailisConfirmed === false){
                    event.preventDefault();
                    $state.go('wait-confirm')
                }
          });
      }
      ]);
    // .run(['$http', '$rootScope', '$window', '$cookieStore', 'UserService', function($http, $rootScope, $window, $cookieStore, UserService) {
    //     // add JWT token as default auth header
    //     $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

    //     // update active tab on state change
    //     $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    //         $rootScope.pageTitle = toState.data.pageTitle;
    //     });

    //     /**
    //      * Sidebar Toggle & Cookie Control
    //      */
    //     var mobileView = 992;

    //     UserService.GetCurrent().then(function(user) {
    //         $rootScope.user = user;
    //     });

    //     $rootScope.getWidth = function() {
    //         return window.innerWidth;
    //     };

    //     $rootScope.$watch($rootScope.getWidth, function(newValue, oldValue) {
    //         if (newValue >= mobileView) {
    //             if (angular.isDefined($cookieStore.get('toggle'))) {
    //                 $rootScope.toggle = ! $cookieStore.get('toggle') ? false : true;
    //             } else {
    //                 $rootScope.toggle = true;
    //             }
    //         } else {
    //             $rootScope.toggle = false;
    //         }

    //     });

    //     $rootScope.toggleSidebar = function() {
    //         $rootScope.toggle = !$rootScope.toggle;
    //         $cookieStore.put('toggle', $rootScope.toggle);
    //     };

    //     window.onresize = function() {
    //         $rootScope.$apply();
    //     };
    // }]);    

    // manually bootstrap angular after the JWT token is retrieved from the server
    // $(function () {
    //     // get JWT token from server
    //     $.get('/app/token', function (token) {
    //         window.jwtToken = token;

    //         angular.bootstrap(document, ['Blurbiz']);
    //     });
    // });
})();