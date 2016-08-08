(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('Project.IndexController', Controller);

    function Controller($window, $scope, $rootScope,  ProjectService, FlashService) {

        $scope.emptyImg = 'img/empty.png';
        
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