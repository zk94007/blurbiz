(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('Project.updatePaymentMethodModalController', Controller);

    function Controller($scope, socket, $uibModalInstance, cardDetail, $timeout, $uibModal, $state, LocalStorageService, SocialConnectService, FlashService) {
        $scope.cardDetail=cardDetail;
        // console.log(cardDetail);
        var token = LocalStorageService.getToken();
        //Stripe Payment
        $scope.myTxt = "You have not yet clicked submit";
        $scope.formData = {};

        $scope.updateStripePaymentMethod = function (stripeToken) {            
            this.formData.stripe_customer_id=$scope.cardDetail.card.stripe_customer_id;
            this.formData.token=LocalStorageService.getToken();
            this.formData.stripe_token=stripeToken;                        
            socket.emit('update_stripe_payment_method', this.formData);
        }

        // console.log($scope.userPaymentMethod);

        socket.removeListener('update_stripe_payment_method_response');
        socket.on('update_stripe_payment_method_response', function(msg) {
           if(msg.success) {
            //    console.log(msg);
              $scope.userPaymentMethod = msg.user_payment_method;
              // Get all subscription cardDetails
              socket.emit('get_payment_method', {
                  token: token
              });

              socket.removeListener('get_payment_method_response');
              socket.on('get_payment_method_response', function(msg) {            
                  if(msg.success) {
                    $scope.userPaymentMethod = msg.user_payment_method;
                    // console.log($scope.userPaymentMethod);
                  }
              });
              // End get subscription cardDetails
              $uibModalInstance.close({
                  cardDetail: $scope.cardDetail
              });

              //Show Success message
              $uibModal.open({
                  animation: true,
                  templateUrl: 'templates/modals/paymentMethodUpdatedModal.html',
                  windowTemplateUrl: 'templates/modals/shareModalWindow.template.html',
                  controller: 'Project.updatePaymentMethodModalController',
                  resolve: {
                      cardDetail: function () {
                          return {
                          cardDetail: $scope.cardDetail
                        };
                      }
                    } 
              });

            }else{
              //Show fail message
              $uibModal.open({
                  animation: true,
                  templateUrl: 'templates/modals/paymentMethodUpdateFailModal.html',
                  windowTemplateUrl: 'templates/modals/shareModalWindow.template.html',
                  controller: 'Project.updatePaymentMethodModalController',
                  resolve: {
                      cardDetail: function () {
                          return {
                          cardDetail: $scope.cardDetail
                        };
                      }
                    } 
              });
            }

        });
        // End update Payment Method Modal Controller
        $scope.ok = function() {   
            $uibModalInstance.close({
                cardDetail: $scope.cardDetail
            });                          
        };       

        $scope.cancel = function() {
            // console.log('Deepak');
            $uibModalInstance.dismiss('cancel');
        };
    
  }        

})();