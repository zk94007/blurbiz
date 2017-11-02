(function () {
    'use strict';

    angular
        .module('Blurbiz.admin')
        .controller('Admin.planModalController', Controller);

    function Controller($scope, socket, $uibModalInstance, plan, LocalStorageService, FlashService) {
        var plan_field_name = plan.field_name.replace(/_/g, " ").toUpperCase();
        $scope.plan_field_name = plan_field_name;
        $scope.field_value = plan.field_value;
        
        $scope.ok = function() {
            socket.emit('admin_update_plan_data', {
                'id': plan.id,
                'field_name': plan.field_name,
                'field_value': $scope.field_value,
                'token': LocalStorageService.getToken()
            });
            $uibModalInstance.close();
            FlashService.Success('Updated successfully.');            
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

    }

})();








