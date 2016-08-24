(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('Project.EditController', Controller);

    function Controller($state, $stateParams, $scope, $uibModal, $timeout, socket, Upload, ProjectService, UploadService, LocalStorageService) {

        var token = LocalStorageService.getToken();
        $scope.project_id = $stateParams.id;
            
        $scope.interface = {};

        $scope.uploadFiles = function (files, cb) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                  var file = files[i];
                  if (!file.$error) {
                    UploadService.uploadFile(file, $stateParams.id, cb);
                  }
                }
            }
        }

        $scope.onGoogleFilePicked = function (docs) {
          console.log("Google Drive picked");
          angular.forEach(docs, function(file, index) {
            $scope.addImage("https://docs.google.com/uc?id=" + file.id);
          })
        };

        $scope.onGoogleFileLoaded = function() {
          console.log('Google Drive loaded');
        };

        $scope.onGoogleFileCancel = function() {
          console.log('Google Drive close/cancel !!');
        };

        $scope.addImage = function(file_path) {
          socket.emit('media_file_add', {
            'path': file_path,
            'project_id': $scope.project_id,
            'token': token
          });
        };

        $scope.deleteImage = function(file_path) {
            socket.emit('delete_image', {
              'file_path': file_path,
              'token': token
            });

            socket.on('delete_image_response', function(msg) {
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
                $scope.media = $scope.media.filter(function(obj) {
                  return obj.path != file_path;
                });
                $scope.$apply();
              }
            });
        };

        initController();

        function initController() {
            // get current user
            // ProjectService.GetAll($rootScope.user._id).then(function (projects) {
            //     $scope.projects = projects;
            // });
            $scope.media = [];

            $scope.$watch('media.length', function() {
                if($scope.media.length > 0) {
                    $scope.showProjects = true;
                } else {
                    $scope.showProjects = false;
                }
            });

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
                  $scope.media = msg.media_files;
                  $scope.$apply();
                }
            });

            socket.on('media_added', function(msg) {
                console.log(msg);
                $scope.media.push(msg);
                $scope.$apply();
                // location.reload();
            });
        }

    }

})();