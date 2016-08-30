(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('Project.EditController', Controller);

    function Controller($state, $stateParams, $scope, $document, $uibModal, $timeout, socket, Upload, ProjectService, UploadService, LocalStorageService, trustUrlFilter) {

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

        /******************************/

        /**
         * Custom Link
         */

        $scope.custm_link_editing = false;

        $scope.url = "";

        $scope.saveCustomFile = function() {
          $scope.addImage($scope.url);
          $scope.url = "";
        }

        /******************************/

        /** 
         * video &image checker
         */

        $scope.isImage = function(path) {
          return !!path.match(/.+(\.jpg|\.jpeg|\.png|\.gif)$/);
        }

        $scope.isVideo = function(path) {
          return !!path.match(/.+(\.mp4|\.avi|\.mpeg|\.flv|\.mov)$/);
        }

        $scope.getUuid = function(path) {
          return path.match(/([^\/]+)(?=\.\w+$)/)[0];
        }

        $scope.playVideo = function(id) {
          videojs(id).play()
            .on("play", function() {
              $($document[0].querySelectorAll("[data-for='" + id + "']")).hide();
            })
            .on("pause", function() {
              $($document[0].querySelectorAll("[data-for='" + id + "']")).show();
            });
        }

        /******************************/

        /** 
         * Dropbox File Picker
         */

        $scope.dpfiles = [];

        $scope.$watch('dpfiles.length', function() {
          console.log("dpfiles watch");
          
          for (var i = 0; i < $scope.dpfiles.length; i++) {
            // $scope.addImage($scope.dpfiles[i].thumbnailLink);
            $scope.addImage($scope.dpfiles[i].link.replace("?dl=0", "?raw=1"));
          }
          $scope.dpfiles = [];
        });

        /******************************/
        
        /**
         * Box File Picker
         */
        $scope.boxfiles = [];
        
        $scope.$watch('boxfiles.length', function() {
          console.log("boxfiles watch");
          
          for (var i = 0; i < $scope.boxfiles.length; i++) {
            $scope.addImage($scope.boxfiles[i].url);
          }
          $scope.boxfiles = [];
        });

        /******************************/
        
        /**
         * Google Drive File Picker
         */

        $scope.onGoogleFilePicked = function (docs) {
          console.log("Google Drive picked");

          var accessToken =  gapi.auth.getToken().access_token;
          
          // var xhr = new XMLHttpRequest();

          angular.forEach(docs, function(file, index) {

            $scope.addGoogleMedia(file.id, accessToken);
            // $scope.addImage("https://drive.google.com/uc?id=" + file.id);
            // $scope.addImage(file.url);

            // debugger;
            // xhr.open('GET', "https://docs.google.com/uc?id=" + file.id);
            // xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
            // xhr.onload = function() {
            //   var stream = ss.createStream();       
            //   console.log('file selected : '+file.name);
                
            //   // upload a file to the server.
            //   ss(socket).emit('media_file_add', stream, {size: file.sizeBytes , name:file.name, project_id: $scope.project_id}); 

            //   var blobStream = ss.createBlobReadStream(xhr.responseText);
            //   blobStream.on('data', function(chunk) {
            //       // progressHandler(chunk);
            //       console.log(chunk.length);
            //   });         
            //   blobStream.pipe(stream);
            //   blobStream.on('end', function(chunk) {
            //     console.log("Upload successful");
            //   }); 
            // };
            // xhr.onerror = function(error) {
            //   console.log("error happened");
            // };
            // xhr.send();
            
            // socket.emit('google_file_add', {
            //   'path': "https://docs.google.com/uc?id=" + file.id,
            //   'project_id': $scope.project_id,
            //   'token': token
            // });

          });
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

        $scope.addGoogleMedia = function(fileId, accessToken) {
          socket.emit('google_file_add', {
            'fileId': fileId,
            'accessToken': accessToken,
            'token': token,
            'project_id': $scope.project_id
          });
        }

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

            // gapi.load('auth', { 'callback': function() {
            //   window.gapi.auth.authorize(
            //     {
            //       client_id : '944689281546-s3o8lk1e093a3mjetpfgj9hic7r5saae.apps.googleusercontent.com',
            //       scope: ['https://www.googleapis.com/auth/drive'],
            //       immediate: false
            //     },
            //     handleAuthResult
            //   );
            // }});

            // function handleAuthResult(authResult) {
            //   if ( authResult && !authResult.error ) {
            //     $scope.oauthToken = authResult.access_token;
            //   }
            // }


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