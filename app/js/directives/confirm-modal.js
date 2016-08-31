angular
    .module("Blurbiz")
    .directive('confirmReallyDo', ['$uibModal', function($uibModal) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/confirmModal.html',
                    controller: 'ConfirmModalController'
                });

                modalInstance.result.then(function (selectedItem) {
                    if (selectedItem == 'ok') {
                        scope.$apply(attrs.confirmReallyDo);
                    }
                });
            });
        }
    }
}]);