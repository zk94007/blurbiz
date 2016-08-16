(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('Project.CreateModalController', Controller);

    function Controller($scope, $uibModalInstance, LocalStorageService) {

        $scope.ok = function() {
            socket.emit('create_project', {
                'project_name': $scope.project_name,
                'token': LocalStorageService.getToken()
            });
            $uibModalInstance.close();
        };

        socket.on('create_project_response', function(msg) {
            
        });

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
        
    }

})();