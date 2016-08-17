(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('Project.EditController', Controller);

    function Controller($state, $stateParams, $scope, $uibModal, $timeout, socket, Upload, ProjectService, FlashService, LocalStorageService) {

        var token = LocalStorageService.getToken();

        $scope.interface = {};

        $scope.uploadFiles = function (files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                  var file = files[i];
                  if (!file.$error) {
                    Upload.upload({
                        url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                        data: {
                          file: file  
                        }
                    }).then(function (resp) {
                        $timeout(function() {
                            $scope.log = 'file: ' +
                            resp.config.data.file.name +
                            ', Response: ' + JSON.stringify(resp.data) +
                            '\n' + $scope.log;

                            $scope.result = response.data;
                        });
                    }, null, function (evt) {
                        var progressPercentage = parseInt(100.0 *
                                evt.loaded / evt.total);
                        $scope.log = 'progress: ' + progressPercentage + 
                            '% ' + evt.config.data.file.name + '\n' + 
                          $scope.log;
                    });
                  }
                }
            }
        }

        initController();

        function initController() {
            // get current user
            // ProjectService.GetAll($rootScope.user._id).then(function (projects) {
            //     $scope.projects = projects;
            // });

            socket.emit('project_data', {
                'project_id': $stateParams.id,
                'token': token
            });

            socket.on('project_data_response', function(msg) {
                console.log('project response: ' + JSON.stringify(msg));
                if (msg == null) {
                  console.log('ERROR: msg is null');
                  return;
                }

                if (msg.success == false) {
                  console.log('ERROR: expected answer - { success: true }, err: ' + msg.msg);
                  $scope.message = {
                    error: msg.msg,
                    success: false
                  };
                } else {
                  console.log('CORRECT');
                  $state.$current.data.title = msg.project_data.project_name;
                }
            });

            

        }
    }

})();