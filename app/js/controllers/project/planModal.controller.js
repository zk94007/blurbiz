(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('Project.planModalController', Controller);

    function Controller($scope, socket, $uibModalInstance, plan, $timeout, $uibModal, $state, LocalStorageService, SocialConnectService, FlashService) {
        $scope.plan=plan;
        
        if($scope.plan.id == 2)
            $scope.planName = "Pro";
        else if($scope.plan.id == 3)
            $scope.planName = "Plus";
        else if($scope.plan.id == 4)
            $scope.planName = "Enterprise";
        else        
            $scope.planName = "Free"; 
        // console.log($scope.plan);    
        var token = LocalStorageService.getToken();        
        //Stripe Payment
        $scope.formData = {};
        $scope.doStripePayment = function (stripeToken) {            
            // prepare data to purchase plan
            
            this.formData.plan_id=$scope.plan.id;
            this.formData.token=LocalStorageService.getToken();
            this.formData.stripe_token=stripeToken;
            this.formData.old_subscription_id=plan.old_subscription_id;
            // send request to server
            console.log(this.formData);
            socket.emit('stripe_payment', this.formData);
        }

        // console.log($scope);
        socket.removeListener('set_stripe_payment_response');
        socket.on('set_stripe_payment_response', function(msg) {
           if(msg.success) {
               console.log(msg);
            //   $scope.subscriptionPlans = msg.subscription_plans;
            $scope.userSubscriptionPlan = msg.userSubscriptionPlan;
            $scope.userPaymentMethod = msg.payment_method;
                console.log($scope.userSubscriptionPlan);
              // Get all subscription plans
              socket.emit('get_subscription_plans', {
                  token: token
              });
              // End get subscription plans
              $uibModalInstance.close({
                  plan: $scope.plan
              });

              //Show Success message
              $uibModal.open({
                  animation: true,
                  templateUrl: 'templates/modals/upgradeSuccessfullModal.html',
                  windowTemplateUrl: 'templates/modals/shareModalWindow.template.html',
                  controller: 'Project.planModalController',
                  resolve: {
                      plan: function () {
                          return {
                          plan: $scope.plan
                        };
                      }
                    } 
              });

            }else{
              //Show fail message
              $uibModal.open({
                  animation: true,
                  templateUrl: 'templates/modals/upgradeFailModal.html',
                  windowTemplateUrl: 'templates/modals/shareModalWindow.template.html',
                  controller: 'Project.planModalController',
                  resolve: {
                      plan: function () {
                          return {
                          plan: $scope.plan
                        };
                      }
                    } 
              });
            }

        });
        // End Stripe Payment

        // Upgrade Subscription Plan
        $scope.updateSubscriptionPlan = function (plan) {   
            // console.log(plan);         
            socket.emit('update_subscription_plan', { token:token, plan_id: plan.id, stripe_subscription_id: plan.stripe_subscription_id, old_subscription_id: plan.old_subscription_id });
        }

        socket.removeListener('update_subscription_plan_response');
        socket.on('update_subscription_plan_response', function(msg) {
           if(msg.success) {
            $scope.subscriptionPlans = msg.subscription_plans;
            
              // Get all subscription plans
               socket.emit('get_subscription_plans', {
                  token: token
              });
              
            socket.on('get_subscription_plans_response', function(msg) {            
                if(msg.success) {
                    $scope.subscriptionPlans = msg.subscription_plans;
                }
            });
              socket.emit('get_current_user', {
                'token': token
              });  

              // End get subscription plans              
              $uibModalInstance.close({
                  plan: $scope.plan
              });

              //Show Success message
              $uibModal.open({
                  animation: true,
                  templateUrl: 'templates/modals/upgradeSuccessfullModal.html',
                  windowTemplateUrl: 'templates/modals/shareModalWindow.template.html',
                  controller: 'Project.planModalController',
                  resolve: {
                      plan: function () {
                          return {
                          plan: $scope.plan
                        };
                      }
                    } 
              });

            }else{
              //Show fail message
              $uibModal.open({
                  animation: true,
                  templateUrl: 'templates/modals/upgradeFailModal.html',
                  windowTemplateUrl: 'templates/modals/shareModalWindow.template.html',
                  controller: 'Project.planModalController',
                  resolve: {
                      plan: function () {
                          return {
                          plan: $scope.plan
                        };
                      }
                    } 
              });
            }
        });

        $scope.ok = function() {   
            $uibModalInstance.close({
                plan: $scope.plan
            });      
            $scope.updateSubscriptionPlan($scope.plan);                
        };       

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };    

        $scope.gotoplans = function() {
          $uibModalInstance.close();
          $state.go('plans');
        };       
      
        $scope.signout = function() {
            $uibModalInstance.close();
            $state.go('login');
        }; 
  }        

})();