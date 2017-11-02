(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('PlansController', PlansController);

    /** @ngInject */
    function PlansController($scope, $uibModal, socket, LocalStorageService, FlashService) {
        
        var token = LocalStorageService.getToken();   
        // Get all subscription plans
        // socket.emit('get_subscription_plans', {
        //     token: token
        // });

        /*socket.on('get_subscription_plans_response', function(msg) {            
            if(msg.success) {
              $scope.subscriptionPlans = msg.subscription_plans;
            }
        });*/
        // End get subscription plans

        // Get user subscription plan
        // socket.emit('get_user_subscription_plan', {
        //     token: token
        // });

        // End get subscription plans
        // Show Popup for choose plan
        $scope.choosePlan = function(plan) { 
            socket.emit('get_user_subscription_plan', {
                token: token
            });
            socket.removeListener('get_user_subscription_plan_response');
            
            socket.on('get_user_subscription_plan_response', function(msg) { 
                // console.log(msg);           
                if(msg.success) {
                    $scope.expire_free_trial = false;
                    $scope.userSubscriptionPlan = msg.user_subscription_plan;
                    if(Number($scope.userSubscriptionPlan.stripe_subscription_id)!=0 
                        && $scope.userSubscriptionPlan.stripe_subscription_id !='' 
                        && $scope.userSubscriptionPlan.stripe_subscription_id!='NULL'){        
                            
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'templates/modals/upgradeplanModal.html',
                            windowTemplateUrl: 'templates/modals/shareModalWindow.template.html',
                            controller: 'Project.planModalController',
                            resolve: {
                                plan: function () {
                                    return {
                                        id:plan.planId,
                                        stripe_subscription_id: $scope.userSubscriptionPlan.stripe_subscription_id,
                                        old_subscription_id: $scope.userSubscriptionPlan.id
                                    };
                                }
                            } 
                        });
                    }else{
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'templates/modals/chooseplanModalContent.template.html',
                            windowTemplateUrl: 'templates/modals/shareModalWindow.template.html',
                            controller: 'Project.planModalController',
                            resolve: {
                                plan: function () {
                                    // console.log(plan);
                                    return {
                                        id:plan.planId,
                                        price: plan.price,
                                        old_subscription_id: $scope.userSubscriptionPlan.id
                                    };
                                }
                            } 
                        });

                    }    
                }else{
                    $scope.userSubscriptionPlan = 0;
                }
            });    
        }; 
        
    }
})();