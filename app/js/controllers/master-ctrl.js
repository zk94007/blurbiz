/**
 * Master Controller
 */

angular.module('Blurbiz')
    .controller('IndexController', ['$scope', '$rootScope', '$cookieStore', '$state', 'socket', 'LocalStorageService', 'SocialConnectService', '$uibModal', MasterCtrl]);

function MasterCtrl($scope, $rootScope, $cookieStore, $state, socket, LocalStorageService, SocialConnectService, $uibModal) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    var token = LocalStorageService.getToken(); 
    var mobileView = 992;
    var popupShowCount = 1;
    $scope.expire_free_trial = false; 
    $scope.logout = function() {
        LocalStorageService.delete('jwtToken');
        LocalStorageService.delete('is_confirmed');
        $state.reload();
    }

    $scope.calcDiff = function(firstDate, secondDate){
        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds    
        var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
        return diffDays;
    }


    // Get user used subscription plan
    socket.emit('check_user_used_free_plan', {
        token: token
    });
    
    socket.on('check_user_used_free_plan_response', function(msg) {
        // console.log('free_plan_used_days: ', msg);
        if(msg.success) {
          $scope.userUsedFreePlan = msg.FREE_PLAN_DATA.free_plan_used_days;
        }else{
            $scope.userUsedFreePlan = 0;
        }
    });
    // End get used subscription plans

    $scope.getCurrentUser = function() {
        var token = LocalStorageService.getToken();        
        socket.emit('get_current_user', {
          'token': token
        });
        socket.removeListener('get_current_user_response');
        socket.on('get_current_user_response', function(msg) {
            console.log(msg);
            $scope.projectCanCreate = msg.number_of_projects;
            $scope.is_admin = msg.is_admin;
            if(Number($scope.userUsedFreePlan) > msg.number_of_days_free_trial && msg.plan_id==1 && msg.is_admin==false && popupShowCount==1 && msg.admin_update == 0){
                $scope.expire_free_trial = true;
            } else {
                $scope.expire_free_trial = false; 
            }    
        //   console.log('project response: ' + JSON.stringify(msg));
          if (msg == null) {
            // console.log('ERROR: msg is null');
            return;
          }

          if (msg.success == false) {
            // console.log('ERROR: expected answer - { success: true }, err: ' + msg.msg);
            $scope.message = {
              error: msg.msg,
              success: false
            };
          } else {
            // console.log('CORRECT');
            $scope.user = msg;
            $scope.$apply();
          }
        });
    };

    $scope.getTimeZone = function() {
        socket.emit('get_timezone', {
            token: LocalStorageService.getToken()
        });

        socket.on('get_timezone_response', function (msg) {
            // console.log('project response: ' + JSON.stringify(msg));
            if (msg == null) {
                // console.log('ERROR: msg is null');
                return;
            }

            if (msg.success == false) {
                // console.log('ERROR: expected answer - { success: true }, err: ' + msg.msg);
                $scope.message = {
                    error: msg.msg,
                    success: false
                };
            } else {
                if (msg) {
                    $scope.newTimeZone = msg;
                    moment.tz.setDefault($scope.newTimeZone);
                }
                // console.log('CORRECT');
            }
        });
    };

    initController();

    function initController() {
        $scope.getCurrentUser();
        $scope.getTimeZone();        
        SocialConnectService.initialize();
    }

    $scope.state = $state;

    $scope.rootScope = $rootScope;

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    socket.on('set_project_title_response', function(msg) {
        // console.log(msg);
    });

    $scope.titleEditing = function(status) {
        if (!status)
        {
            socket.emit('set_project_title', {
                token: LocalStorageService.getToken(),
                project_id: $state.params.id,
                title: $scope.rootScope.pageTitle
            });
        }
        if (!($state.$current.data && $state.$current.data.title))
        {
            $scope.title_editing = status;
            // if (!$scope.title_editing)
            // {
            //     $timeout(function() {
            //         $('#page-title-input').focus();
            //     });
            // }
        }

    }

    $scope.titleEditable = function() {
        return !($state.$current.data.title);
    }

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };

    //Get Subscription plans
           
    socket.emit('get_subscription_plans', {
        token: LocalStorageService.getToken()
    });

    socket.on('get_subscription_plans_response', function(msg) {            
        if(msg.success) {
          $scope.subscriptionPlans = msg.subscription_plans;
        }
    });
    // End get subscription plans

    // Get user subscription response
    socket.on('get_user_subscription_plan_response', function(msg) {            
        if(msg.success) {
          $scope.userSubscriptionPlan = msg.user_subscription_plan;
        }else{
            $scope.userSubscriptionPlan = {};
        }
        //console.log(msg);
    });
    
}