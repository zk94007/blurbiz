(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('Project.IndexController', Controller);

    function Controller($window, $scope, $rootScope, $uibModal, socket, FlashService, LocalStorageService) {
        
        // $scope.projects = {};

        var token = LocalStorageService.getToken();
        var popupShowCount = 1;
        $scope.calcDiff = function(firstDate, secondDate){
            var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds    
            var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
            return diffDays;
        }

        $scope.emptyImg = 'img/empty.png';

        $scope.sort_item = 'project_name';

        $scope.deleteProject = function(id) {
            socket.emit('delete_project', {
                    'project_id': id,
                    'token': token
            });
            $scope.projects = {};
        }

        socket.removeListener('delete_project_response');
        socket.on('delete_project_response', function(msg) {
            
            console.log('received project delete response: ' + JSON.stringify(msg));
            if (msg == null) {
                    console.log('ERROR: msg is null');
                    return;
            }
            if (msg.success == true) {
                    // console.log('TestTest')
                    sendProjectListMessage(token);
                    // return;
            }
            if (msg.err != null && msg.err != '') {
                    console.log('ERROR: ' + err);
                    return;
            }
        });

        $scope.showProjectVideo = function(result_video, representative, title) {
            if (result_video) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/modals/youtubeClipperModalContent.template.html',
                    windowTemplateUrl: 'templates/modals/shareModalWindow.template.html',
                    controller: 'Project.youtubeClipperModalController',
                    size: 'lg',
                    resolve: {
                        url: function () {
                            return {
                                path: result_video,
                                type: 'video',
                                title: title
                            }
                        }
                    }
                });
            }
            else {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/modals/youtubeClipperModalContent.template.html',
                    windowTemplateUrl: 'templates/modals/shareModalWindow.template.html',
                    controller: 'Project.youtubeClipperModalController',
                    size: 'lg',
                    resolve: {
                        url: function () {
                            return {
                                path: representative,
                                type: 'verbose',
                                title: title
                            }
                        }
                    }
                });
            }
        }

        /******************************/

        /** 
         * video &image checker
         */

        $scope.isImage = function(path) {
            if(!path)
                return false;
            return !!path.match(/.+(\.jpg|\.jpeg|\.png|\.gif)$/);
        }

        $scope.isVideo = function(path) {
            if(!path)
                return false;
            return !!path.match(/.+(\.mp4|\.avi|\.mpeg|\.flv|\.mov)$/);
        }


        /**
         * Modal
         */

        $scope.openModal = function() {   
            console.log($scope.is_admin);
            console.log($scope.projectCanCreate, ' ====== '+$scope.projects.length);        
            if($scope.projectCanCreate > $scope.projects.length || $scope.is_admin){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'createProjectModal.html',
                    controller: 'Project.CreateModalController'
                });

                modalInstance.result.then(function (newProjectName) {
                    $scope.newProjectName = newProjectName;
                    console.log(newProjectName);
                });
            }else{
                FlashService.Error('Oops! You have reached your project limit, Please upgrade your plan to create more projects.');
            }
        };

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
        
        initController();

        function initController() {
            sendProjectListMessage(token);
        }

        function sendProjectListMessage(token) {
            console.log('send project list message with token = ' + token);
            
            socket.emit('project_list', {
                'token': token
            });
        }
        
        socket.removeListener('project_list_response');
        socket.on('project_list_response', function(msg) {
            console.log('received project list response: ' + JSON.stringify(msg));
            // localStorage.setItem('')
            if (msg == null) {
                    console.log('ERROR: msg is null');
                    return;
            }
            if (msg.success == true) {
                    if (msg.projects != null) {
                        $scope.projects = msg.projects;                            
                    } else {
                            console.log('ERROR: success == true, but projects field is null');
                    }
                        
                    return;
            }
            if (msg.err != null && msg.err != '') {
                    console.log('ERROR: ' + err);
                    return;
            }
        });

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