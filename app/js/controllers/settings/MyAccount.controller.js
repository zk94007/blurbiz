(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('MyAccountController', MyAccountController);

    /** @ngInject */
    function MyAccountController($scope, $uibModal, socket, LocalStorageService, FlashService) {
        
        var popupShowCount = 1;        
        
        $scope.calcDiff = function(firstDate, secondDate){
            var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds    
            var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
            return diffDays;
        }

        var token = LocalStorageService.getToken();        
        
        $scope.$watch('expire_free_trial', function(value) {
            if(value) {
                $uibModal.open({
                    animation: true,
                    backdrop: false,                  
                    keyboard : false,
                    backdropClick : false,
                    templateUrl: 'templates/modals/freeTrialCompletedModal.html',
                    windowTemplateUrl: 'templates/modals/shareModalWindow.template.html',
                    controller: 'Project.planModalController',
                    resolve: {
                    plan: function () {
                        return { };
                    }
                    } 
                });
            }
        });
        
        var token = LocalStorageService.getToken();
        var count = 0;
        initController();
        $scope.teams = {};
        function initController() {
            $scope.$parent.$watch('user', function(newValue, oldValue) {
                // console.log("parent user changed");
                $scope.user = newValue;
            });
        }
        
        socket.removeListener('update_user_response');
        socket.on('update_user_response', function(msg) {
            // console.log('user update response', msg);
            ++count;
            if(msg.success)
            { 
                // if(count == 1) {
                    FlashService.Success('User info updated');  
                // }
            }
            else 
            {
                FlashService.Error('Error happened while user info update');
            }
        });

        $scope.userInfoUpdate = function() {
            // console.log('user info update');
            socket.emit('update_user', {
                'user_id': $scope.user.id,
                'fields': {
                    'name': $scope.user.name,
                    'team_id': $scope.user.team_id,
                    'email': $scope.user.email,
                    'password': $scope.user.password,
                    'team_name': $scope.user.team_name
                },
                'token': token
            });         
        }

        $scope.openAccountPhotoEdit = function(file) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: false,
                ariaLabelledBy: 'Photo',
                ariaDescribedBy: 'Photo',
                templateUrl: 'templates/modals/accountPhotoEdit.html',
                controller: 'AccountPhotoEditController',
                controllerAs: 'accountPhotoEdit',
                size: 'md',
                resolve: {
                    file: function() { return file }
                }
            });

            modalInstance.result.then(function(photo) {
                $scope.$parent.user.photo = photo;
            });
        }
        
        socket.emit('get_teams', {
            token: LocalStorageService.getToken()
        });

        socket.removeListener('get_teams_response');
        socket.on('get_teams_response', function(teams) {
            // console.log('GET_TEAMS_RESPONSE: ', teams);
            $scope.teams = {};
            angular.forEach(teams, function(value, key) {
                if(!$scope.teams[value.id]) {
                    if($scope.user.team_name == '') {
                        $scope.user.team_name = value.name;
                    }
                    $scope.teams[value.id]=value;
                }
            });
        });

        socket.removeListener('get_teams_response');
        socket.on('my_team_response', function(teams) {
            // console.log('GET_My_TEAMS_RESPONSE: ', teams);
            if(teams.length!=0){
                $scope.user.team_name = teams[0].name;            
                $scope.user.team_id = teams[0].id;            
            }
        });
    }
})();