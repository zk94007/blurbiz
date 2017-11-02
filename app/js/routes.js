(function () {
    'use strict';

    /**
     * authProvider configuration for the Blurbiz.project module.
     */
    angular.module('Blurbiz.project').config(function($authProvider, FacebookProvider, DropboxProvider) {
        
        FacebookProvider.init(config.social.facebook.app_id);
        DropboxProvider.config(config.social.dropbox.app_key, 'http://' + config.env.frontend  + '/components/ngDropbox/callback.html');
    });

    /**
     * Route configuration for the Blurbiz module.
     */
    angular.module('Blurbiz').config(['$stateProvider', '$urlRouterProvider', 'FlashProvider',
        function($stateProvider, $urlRouterProvider, FlashProvider) {

            FlashProvider.setTimeout(3000);
            FlashProvider.setShowClose(true);

            // For unmatched routes
            $urlRouterProvider.otherwise('/login');

            // Application routes
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'templates/auth/login.html',
                    controller: 'AuthController'
                })
                .state('register', {
                    url: '/signup', 
                    templateUrl: 'templates/auth/signup.html',
                    controller: 'AuthController'
                })
                .state('forgot-password', {
                    url: '/password/forgot',
                    templateUrl: 'templates/auth/forgot.html',
                    controller: 'AuthController'
                })
                .state('reset-password', {
                    url: '/password/reset/{reset_code}',
                    templateUrl: 'templates/auth/reset.html',
                    controller: 'PasswordResetController'
                })
                .state('wait-confirm', {
                    url: '/wait-confirm',
                    templateUrl: 'templates/auth/wait-confirm.html',
                    controller: 'WaitConfirmateEmailController'
                })
                .state('confirm', {
                    url: '/confirm/{email_code}',
                    templateUrl: 'templates/auth/confirm.html',
                    controller: 'ConfirmateEmailController'
                })
                .state('index', {
                    url: '',
                    abstract: true,
                    templateUrl: 'templates/index.html',
                    controller: 'IndexController'
                })
                .state('project', {
                    url: '/project',
                    parent: 'index',
                    abstract: true,
                    template: '<div ui-view></div>'
                })
                .state('project.index', {
                    url: '/all',
                    templateUrl: 'templates/project/all.html',
                    controller: 'Project.IndexController', 
                    data: {
                        title: 'All Projects'
                    }
                })
                .state('project.edit',  {
                    url: '/:id?access_token',
                    templateUrl: 'templates/project/edit.html',
                    controller: 'Project.EditController',
                    data: {
                        title: ''
                    }
                })
                .state('project.detail', {
                    url: '/edit/:id?media_id&access_token',
                    templateUrl: 'templates/project/detail.html',
                    controller: 'Project.DetailController',
                    reloadOnSearch: false,
                    data: {
                        title: ''
                    }
                })
                .state('tables', {
                    url: '/tables',
                    parent: 'index',
                    templateUrl: 'templates/tables.html',
                    controller: 'Project.ScheduleController',
                    data: {
                        title: 'Schedule'
                    }
                })
                .state('admin', {
                    url: '/admin',
                    parent: 'index',
                    templateUrl: 'templates/admin/dashboard.html',
                    controller: 'Admin.DashboardController',
                    data: {
                        title: 'Admin',
                        isAdmin: true
                    }
                })
                .state('instagram_token', {
                    url: '/access_token={token:.+}',
                    templateUrl: 'templates/index.html',
                    controller: function($scope, $stateParams) {
                        var project_id = sessionStorage.getItem("project_id");
                        localStorage.setItem("instagram_token", $stateParams.token);
                        location.reload();
                        window.close();
                        // window.location.href = "/#/project/"+project_id+"?access_token="+$stateParams.token;

                    }
                })
                .state('timezone', {
                    url: '/settings/timezone',
                    parent: 'index',
                    templateUrl: 'templates/settings/timezone.html',
                    controller: 'TimezoneController',
                    controllerAs: "timezone",
                    data: {
                        title: 'Timezone'
                    }
                })
                .state('myaccount', {
                    url: '/settings/myaccount',
                    parent: 'index',
                    templateUrl: 'templates/settings/myaccount.html',
                    controller: 'MyAccountController',
                    controllerAs: "myaccount",
                    data: {
                        title: 'My account'
                    }
                })
                .state('connections', {
                    url: '/settings/connections',
                    parent: 'index',
                    templateUrl: 'templates/settings/connections.html',
                    controller: 'ConnectionsController',
                    controllerAs: "connections",
                    data: {
                        title: 'Connect to Social Networks'
                    }
                })
                .state('integrations', {
                    url: '/settings/integrations',
                    parent: 'index',
                    templateUrl: 'templates/settings/integrations.html',
                    controller: 'IntegrationsController',
                    controllerAs: "integrations",
                    data: {
                        title: 'Integration'
                    }
                })
                .state('plans', {
                    url: '/settings/plans',
                    parent: 'index',
                    templateUrl: 'templates/settings/plans.html',
                    controller: 'PlansController',
                    controllerAs: "plans",
                    data: {
                        title: 'Plans'
                    }
                })
                .state('billing', {
                    url: '/settings/billing',
                    parent: 'index',
                    templateUrl: 'templates/settings/billing.html',
                    controller: 'BillingController',
                    controllerAs: "billing",
                    data: {
                        title: 'Billing'
                    }
                })
                .state('invite', {
                    url: '/invite/:idInvite',
                    templateUrl: 'templates/auth/signup_invite.html',
                    controller: 'AuthController',

                })                
        }
    ])
    .config(['$httpProvider', function($httpProvider) {    
        $httpProvider.defaults.useXDomain = true; 
        delete $httpProvider.defaults.headers.common['X-Requested-With']; 
    }])
    .config(['DropBoxSettingsProvider', function(DropBoxSettingsProvider) {
        DropBoxSettingsProvider.configure({
            multiselect: true,
            box_clientId: config.social.box.client_id,
            extensions: [ '.gif','.png','.jpg', 'jpeg', 'mp4'],//dropbox file 
            box_linkType: 'direct'
        });
    }])
    .config(['lkGoogleSettingsProvider', function(lkGoogleSettingsProvider) {
        lkGoogleSettingsProvider.configure({
            apiKey   : config.social.googleDrive.api_key,
            clientId : config.social.googleDrive.client_id,
            scopes   : ['https://www.googleapis.com/auth/drive'],
        });
    }])
    .run(['$rootScope', '$state', 'LocalStorageService', 'SessionService', 'SessionStorageService', function($rootScope, $state, LocalStorageService, SessionService, SessionStorageService) {
          $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams, options){
                $rootScope.title_editing = false;
                $rootScope.isBared = false;
                // redirect to login page if user not loggedin
                var token = LocalStorageService.getToken();
                var publicPages = ['login', 'register', 'invite', 'forgot-password', 'reset-password'];
                var restrictedPage = publicPages.indexOf(toState.name) === -1;

                if (restrictedPage && (token === undefined || token === null)){
                    event.preventDefault();
                    $state.go('login')
                }

                // redirect to wait confirm if email not confirmed
                //todo exclude other routes if needed
                var exclude_routes = [
                  'login',
                  'register',
                  'confirm',
                  'wait-confirm',
                  'invite',
                  'forgot-password',
                  'reset-password'
                ];
                var userEmailisConfirmed = LocalStorageService.get('is_confirmed');
                userEmailisConfirmed = (userEmailisConfirmed !== undefined && userEmailisConfirmed !== null) ? JSON.parse(userEmailisConfirmed) : false;
                if (exclude_routes.indexOf(toState.name) === -1 && userEmailisConfirmed === false){
                    event.preventDefault();
                    $state.go('wait-confirm')
                }

                SessionService.checkAccess(event, toState, toParams, fromState, fromParams);
          });

          $rootScope.$on('$stateChangeSuccess', 
            function(event, toState, toParams, fromState, fromParams) {
                if(toState.data)
                    $rootScope.pageTitle = toState.data.title;
                SessionStorageService.clear();
            })
      }
      ]);
})();
