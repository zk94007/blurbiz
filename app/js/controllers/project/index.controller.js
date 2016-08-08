(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('Project.IndexController', Controller);

    function Controller($window, $scope, $rootScope, $uibModal, ProjectService, FlashService) {

        $scope.emptyImg = 'img/empty.png';

        $scope.sort_item = 'name';

        $scope.openModal = function() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'createProjectModal.html'
            });
        };

        $scope.ok = function() {
          $scope.showModal = false;
        };

        $scope.cancel = function() {
          $scope.showModal = false;
        };
        
        initController();

        function initController() {
            // get current user
            ProjectService.GetAll($rootScope.user._id).then(function (projects) {
                $scope.projects = projects;
            });
        }

        function saveUser() {
            UserService.Update(vm.user)
                .then(function () {
                    FlashService.Success('User updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deleteUser() {
            UserService.Delete(vm.user._id)
                .then(function () {
                    // log user out
                    $window.location = '/login';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }

})();