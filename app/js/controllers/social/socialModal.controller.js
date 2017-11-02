(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('Project.SocialModalController', Controller);

    function Controller($scope, $uibModalInstance) {
        $scope.ok = function() {    
            $uibModalInstance.close();
        };

        $scope.cancel = function() {    
            $uibModalInstance.dismiss();
        };
    }

})();