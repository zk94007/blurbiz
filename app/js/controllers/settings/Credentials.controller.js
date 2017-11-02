(function () {
    'use strict';

    angular
        .module('Blurbiz.social')
        .controller('CredentialsController', Controller);

    function Controller($scope, $uibModalInstance, socket, social, FlashService) {
        $scope.social = social;

        $scope.trySocialLogin = function() {

            socket.removeListener($scope.social + '_login_by_credential_response');
            socket.emit($scope.social + '_login_by_credential', {username: $scope.username, password: $scope.password});

            socket.on($scope.social + '_login_by_credential_response', function(msg) {
                if(!msg.error)
                {
                    msg.result = {username: $scope.username, password: $scope.password};
                    if (msg.authToken)
                        msg.result.authToken = msg.authToken;
                    $uibModalInstance.close(msg);
                }
                else {
                    FlashService.Error(msg.error.message);
                }
            });
        }
    }
})();