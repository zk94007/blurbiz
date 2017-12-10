(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('BillingController', BillingController);

    /** @ngInject */
    function BillingController($scope, $uibModal, socket, LocalStorageService, FlashService, $state) {
        
        var token = LocalStorageService.getToken();                

        // Get user subscription plan
        socket.emit('get_user_subscription_plan1', {
            token: token
        });

        socket.on('get_user_subscription_plan_response1', function(msg) {            
            if(msg.success) {
              $scope.userSubscriptionPlan = msg.user_subscription_plan;
            }else{
                $scope.userSubscriptionPlan = {};
            }
            //console.log(msg);
        });
        // End get subscription plans

        // Get user payment method
        socket.emit('get_payment_method', {
            token: token
        });

        socket.removeListener('payment_method_update');
        socket.on('payment_method_update', function(msg) {
            $scope.userPaymentMethod.card_type = msg.type;
            $scope.userPaymentMethod.creditcard_number = msg.card_number;
        });

        socket.removeListener('get_payment_method_response');
        socket.on('get_payment_method_response', function(msg) {            
            if(msg.success) {
              $scope.userPaymentMethod = msg.payment_method;
            }else{
                $scope.userPaymentMethod = {};
            }
            console.log(msg);
        }); 
        // End Get Payment Method

        // Show Popup for update Payment Method
        $scope.updatePaymentMethod = function(card) {
            if(card.creditcard_number){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/modals/updatePaymentMethodModalContent.template.html',
                    windowTemplateUrl: 'templates/modals/shareModalWindow.template.html',
                    controller: 'Project.updatePaymentMethodModalController',
                    resolve: {
                        cardDetail: function () {
                            return { card };
                        }
                      } 
                });
                modalInstance.result.then(function (response) {
                       console.log(response);   
                });
            }    
        };
        
        $scope.gotoplans = function() {
          $state.go('plans');
        }; 
    }
})();