(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('Project.CreateModalController', Controller);

    function Controller($scope, $uibModalInstance) {

        $scope.ok = function() {
          $uibModalInstance.close($scope.project_name);
        };

        $scope.cancel = function() {
          $uibModalInstance.dismiss('cancel');
        };
        
    }

})();