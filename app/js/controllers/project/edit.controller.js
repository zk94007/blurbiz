(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('Project.EditController', Controller);

    function Controller($state, $sce, $stateParams, $scope, $rootScope, $document, $uibModal, $timeout, socket, UploadService, LocalStorageService, SocialConnectService, MediaService, trustUrlFilter, $http, $location, ShareService, $auth, ServiceConnectionStateService) {
        var popupShowCount = 1;
        $scope.calcDiff = function(firstDate, secondDate){
            var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds    
            var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
            return diffDays;
        }

        var token = LocalStorageService.getToken();        
        
         /* $scope.getCurrentUser = function() {            
            socket.emit('check_user_used_free_plan', {
                token: token
            });

            socket.emit('get_current_user', {
              'token': token
            });            
        };  */

        // console.log($scope);
        
        function setObject(key, obj) {
            localStorage.setItem(key, JSON.stringify(obj));
        }

        function getObject(key) {
            return LocalStorageService.get(key);
        }

        function deleteJSON(key, media_id) {
            // console.log(getObject(key));
            if(typeof getObject(key) == 'undefined') {
                return;
            }
            var json = JSON.parse(getObject(key));
            for (var i=0;i<json.length;i++) {
                if (json[i].media_id == media_id) {
                    json.splice(i,1);
                } 
            }
            setObject(key, json);
        }

        /*  $scope.getCurrentUser();  */
        
        $scope.upload_percent = 0;
        /**
         * check services (dropbox, box, google_drive etc )
         */
        $scope.connectionStates = {};
        $scope.customFileType = '';
        $scope.showConnectToService = showConnectToService;

        fileUploader = new SocketIOFileClient(socket);

        getConnectionStates();

        function checkSocialConnection(social) {
            SocialConnectService.isReady(social, function(result) {
                $timeout(function(){
                    $scope.connectionStates[social] = !!result;
                }, 0);
            });
        }

        function getConnectionStates() {
            // ServiceConnectionStateService.getAllConnectionStateByUser()
            //     .then(getCompleted);

            // function getCompleted(response) {
            //     $scope.connectionStates = response;
            // }
            checkSocialConnection('instagram2');
            checkSocialConnection('dropbox');
            checkSocialConnection('box');
            checkSocialConnection('google_drive');
        }

        function showConnectToService(social) {
            // console.log(social);

            var modalInstance = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: "templates/modals/integrationModal.template.html",
                windowClass: 'response_mod',
                resolve: {
                    social: function () {
                        return social
                    }
                },
                controller: function ($uibModalInstance, social, $scope, SocialConnectService) {

                    $scope.connectToSocial = connectToSocial;
                    $scope.social = social;

                    if(social == 'instagram2') {
                        $scope.socialDescription = {
                            icon: 'instagram',
                            text: 'Instagram'
                        }
                    } else if (social == 'dropbox') {
                        $scope.socialDescription = {
                            icon: 'dropbox',
                            text: 'Dropbox'
                        }
                    } else if (social == 'box') {
                        $scope.socialDescription = {
                            icon: 'box',
                            text: 'Box'
                        }
                    } else if (social == 'google_drive') {
                        $scope.socialDescription = {
                            icon: 'drive',
                            text: 'Google Drive'
                        }
                    }

                    function connectToSocial(social) {
                        SocialConnectService.connectSocial(social).then(function() {
                            $uibModalInstance.close(social);
                            SocialConnectService.isReady(social, function(res) {
                                if (res) {
                                    // console.log("Success:", social, " logged in");
                                    // $timeout(function(){
                                    //     disconnectFromSocial
                                    // social original click trigger
                                    angular.element('#' + social + '_first').trigger('click');
                                    // }, 0);
                                } 
                            });
                        });
                    }

                    $scope.ok = function () {
                        debugger;
                        $scope.connectToSocial(social);
                    }
                    $scope.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    }
                }
            })

            modalInstance.result.then(function (res) {
                $scope.connectionStates[social] = true;
            })
        }

        /******************************/


        $scope.sortConfig = {
            animation: 150,
            onSort: function (evt) {
                MediaService.smartOrder(evt.models);
            }
        };

        var token = LocalStorageService.getToken();
        $scope.project_id = $stateParams.id;
        $scope.loading = false;

        if((localStorage.getItem("project_id") == null)) {
            LocalStorageService.put('project_id', $stateParams.id);
        } else {
            if(localStorage.getItem("project_id") != $stateParams.id) {
                localStorage.removeItem('media_files');
                LocalStorageService.put('project_id', $stateParams.id);
            }
        }

        function remove(key, obj) {
            localStorage.setItem(key, JSON.stringify(obj));
        }

        var $controller_scope = $scope;

        $scope.interface = {};
        function processInstagram(token) {
            //If accessToken is present in the stateParams, then load the user media
            $http({
                method: 'JSONP',
                url: 'https://api.instagram.com/v1/users/self/media/recent?access_token=' + token,
                crossDomain: true,
                params: {
                    format: 'jsonp',
                    callback: 'JSON_CALLBACK'
                }
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                // console.log(response);

                //Opening the modal
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    windowClass: 'fixed-modal-window',
                    templateUrl: "templates/modals/instagramModal.html",
                    resolve: {
                        data: function () {
                            return response.data.data
                        }
                    },
                    controller: function ($uibModalInstance, data, $scope) {
                        $scope.data = data;

                        $scope.selectedImagesCount = 0;
                        $scope.selectedImagesData = {};

                        $scope.updateSelectedImagesData = function (imageData) {
                            var imageID = imageData.id;
                            if (imageID !== undefined) {
                                var keys = Object.keys($scope.selectedImagesData);
                                if (keys.indexOf(imageID) === -1) {
                                    $scope.selectedImagesData[imageID] = imageData;
                                    imageData.selected = true;
                                    $scope.selectedImagesCount++;
                                }
                                else {
                                    delete $scope.selectedImagesData[imageID];
                                    imageData.selected = false;
                                    $scope.selectedImagesCount--;
                                }
                            }
                        };

                        $scope.uploadSelectedImages = function () {
                            var keys = Object.keys($scope.selectedImagesData);
                            if (keys.length) {
                                for (var index in keys) {
                                    var key = keys[index];
                                    var imageData = $scope.selectedImagesData[key];
                                    $scope.upload(imageData);
                                }
                            }
                        };

                        $scope.upload = function (image) {
                            var canvas = document.createElement("canvas");
                            canvas.width = image.images.standard_resolution.width;
                            canvas.height = image.images.standard_resolution.height;

                            var img = new Image();
                            img.width = image.images.standard_resolution.width;
                            img.height = image.images.standard_resolution.height;
                            img.crossOrigin = "Anonymous";
                            img.src = image.images.standard_resolution.url;
                            img.name = image.caption.text;

                            img.onload = function () {
                          
                                var ctx = canvas.getContext("2d");
                                ctx.drawImage(img, 0, 0);

                                var dataUrl = canvas.toDataURL("image/jpg");
                                var blob = dataURItoBlob(dataUrl);
                                blob.name = img.name;

                                var preview = fakePreview(blob.name);
                                $controller_scope.media.push(preview);
                                $uibModalInstance.close();
                
                                UploadService.uploadFile(blob, {project_id: $stateParams.id, guid: preview.guid}, function () {
                                    // $scope.cancel();
                                    $scope.$apply();
                                });
                            }
                        }

                        $scope.cancel = function () {
                            $uibModalInstance.close();
                        }

                        function dataURItoBlob(dataURI) {
                            // convert base64/URLEncoded data component to raw binary data held in a string
                            var byteString;
                            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                                byteString = atob(dataURI.split(',')[1]);
                            else
                                byteString = unescape(dataURI.split(',')[1]);

                            // separate out the mime component
                            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

                            // write the bytes of the string to a typed array
                            var ia = new Uint8Array(byteString.length);
                            for (var i = 0; i < byteString.length; i++) {
                                ia[i] = byteString.charCodeAt(i);
                            }

                            return new Blob([ia], {type: mimeString});
                        }
                    }
                });


            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                // console.log(response);
            });
        }

        $scope.instagram = function (disableSharePopup) {
            localStorage.removeItem("instagram_token");

            //Redirect the user to this url
            sessionStorage.setItem("project_id", $scope.project_id);
            var url = "https://api.instagram.com/oauth/authorize/?client_id=6e3e49de0dbf4747a12665fd3c174d14&redirect_uri=" + config.env.frontend + "/&response_type=token";
            var w = window.open(url, 'name', 'height=400,width=600');
            w.onbeforeunload = function () {
                // console.log("Window closed");
                var instagram_token = localStorage.getItem("instagram_token");
                if (!disableSharePopup)
                    processInstagram(instagram_token);
            }

            // setTimeout(function() {
            //   var i = setInterval(function() {
            //     var item = localStorage.getItem("instagram_token");
            //     if(item) {
            //       clearInterval(i);
            //       processInstagram(item);
            //       $scope.$apply();
            //     }
            //   }, 1000);
            // }, 5000);
        }

        $scope.uploadFiles = function (files, cb) {
            if (files && files.length) {
                console.log(files);
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if(file.name.match(/.+(\.mp4|\.avi|\.mpeg|\.flv|\.mov)$/) || file.name.match(/.+(\.jpg|\.jpeg|\.png|\.gif)$/)) {
                        if (!file.$error) {
                            var preview = fakePreview(file.name);

                            $scope.media.push(preview);

                            UploadService.uploadFile(file, {project_id: $stateParams.id, guid: preview.guid}, cb);
                        }
                       
                    } else {
                        $scope.inValidFile();
                    }
                }
            }
        }

        $scope.inValidFile = function(){
            if($scope.invalidModalVisible) return;
            $scope.invalidModalVisible=true; // set Visible unique modal
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/modals/warningModalContent.template.html',
                controller: 'ConfirmModalController',
                size: 'md',
                resolve: {
                    content: function () {
                        return 'An Invalid file type has been upload!';
                    }
                }
            });
            
             modalInstance.result.then(function () {
                 $scope.invalidModalVisible=false; // reset Visible unique modal
             })
        }
        
        socket.on('set_upload_video_inprogress', function (msg, done) {
            $scope.upload_percent = Math.round(msg.percent) + '%';
        });

        /******************************/

        /**
         * Custom Link
         */

        $scope.custm_link_editing = false;

        $scope.url = "";

        $scope.saveCustomFile = function (type) {
            if (type == "youtube")
            {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/modals/youtubeClipperModalContent.template.html',
                    windowTemplateUrl: 'templates/modals/shareModalWindow.template.html',
                    controller: 'Project.youtubeClipperModalController',
                    size: 'lg',
                    resolve: {
                        url: function () {
                            return {
                                path: $scope.url,
                                type: 'youtube',
                                title: $rootScope.pageTitle
                            }
                        }
                    }
                });
                modalInstance.result.then(function (item) {
                    $scope.url = "";
                })
            }
            if (type == "custom") {
                $scope.addImage($scope.url);
                $scope.url = "";
            }
        }

        /******************************/

        /**
         * video &image checker
         */

        $scope.isImage = function (path) {
            return isImage(path);
        }

        $scope.isVideo = function (path) {
            // console.log('---Sam', path);
            return isVideo(path);
        }

        $scope.getUuid = function (path) {
            var arr = path.match(/([^\/]+)(?=\.\w+$)/);
            return (arr && arr.length > 0) ? arr[0] : '';
        }

        $scope.playVideo = function (id) {
            videojs(id).play()
                .on("play", function () {
                    $($document[0].querySelectorAll("[data-for='" + id + "']")).hide();
                })
                .on("pause", function () {
                    $($document[0].querySelectorAll("[data-for='" + id + "']")).show();
                });
        }

        /******************************/

        /**
         * Dropbox File Picker
         */

        $scope.dpfiles = [];
        $scope.$watch('dpfiles.length', function () {
            // console.log("dpfiles watch");

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

        $scope.$watch('boxfiles.length', function () {
            // console.log("boxfiles watch");

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
            // console.log("Google Drive picked");
            var accessToken = gapi.auth.getToken().access_token;

            // var xhr = new XMLHttpRequest();

            angular.forEach(docs, function (file, index) {

                $scope.addGoogleMedia(file.id, accessToken);
                // $scope.addImage("https://drive.google.com/uc?id=" + file.id);
                // $scope.addImage(file.url);

                //
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

        $scope.onGoogleFileLoaded = function () {
            // console.log('Google Drive loaded');
        };

        $scope.onGoogleFileCancel = function () {
            // console.log('Google Drive close/cancel !!');
        };

        $scope.isFake = function (file_path) {
            return file_path == config.image.waitForAdd;
        }

        $scope.addImage = function (file_path) {
            // console.log("addImage run");
            // need to add file name with blank for preview.

            var preview = fakePreview(file_path);

            $scope.media.push(preview);

            socket.emit('media_file_add', {
                'path': file_path,
                'project_id': $scope.project_id,
                'token': token,
                'guid': preview.guid
            });

            // $scope.$apply();
        };

        $scope.addGoogleMedia = function (fileId, accessToken) {

            var preview = fakePreview(fileId);

            $scope.media.push(preview);

            socket.emit('google_file_add', {
                'fileId': fileId,
                'accessToken': accessToken,
                'token': token,
                'project_id': $scope.project_id,
                'guid': preview.guid
            });
        }

        $scope.deleteImage = function (file_path) {
            var media = $scope.media.find(function (item) {
                return item.path == file_path;
            });
            
            media.original_path = media.path;
            media.path = config.image.waitForDelete;

            deleteJSON('media_files', media.id);
            socket.emit('delete_image', {
                'file_path': file_path,
                'token': token
            });

            socket.on('delete_image_response', function (msg) {
                // console.log('project response: ' + JSON.stringify(msg));
                if (msg == null) {
                    // console.log('ERROR: msg is null');
                    return;
                }

                if (msg.success == false) {
                    // console.log('ERROR: expected answer - { success: true }, err: ' + msg.msg);
                    $scope.message = {
                        error: msg.msg,
                        success: false
                    };
                } else {
                    // console.log('CORRECT');
                    $scope.media = $scope.media.filter(function (obj) {
                        return obj.original_path != file_path;
                    });
                    $scope.$apply();
                }
            });
        };

        var selectPageModal = function () {
            socket.emit("get_fb_pages", {
                token: token
            });

            socket.removeListener("get_fb_pages_response");
            socket.on("get_fb_pages_response", function(res) {
                
                if (!res.success) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'templates/modals/facebookPagesModalContent.template.html',
                        windowTemplateUrl: 'templates/modals/facebookPagesModalWindow.template.html',
                        controller: 'Project.facebookPagesModalController'
                    });
                    modalInstance.result.then(function (selectedPageIdToken) {
                        
                        socket.emit('set_fb_pages', {
                            id: selectedPageIdToken,
                            token: token
                        });
                        shareWindow("facebook");
                    })
                }
                else {
                    shareWindow("facebook");
                }
            });
        }

        var shareWindow = function (share) {
            // console.log($rootScope.pageTitle);
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/modals/shareModalContent.template.html',
                windowTemplateUrl: 'templates/modals/shareModalWindow.template.html',
                controller: 'Project.ShareModalController',
                resolve: {
                    project: function () {
                        // debugger;
                        return {
                            project_id: $scope.project_id,
                            title: $rootScope.pageTitle,
                            media: ($scope.result_video ? $scope.result_video : ($scope.media[0] ? $scope.media[0].path : null)),
                            share: share,
                            user: $scope.$parent.user
                        };
                    }
                }
            });

            modalInstance.result.then(function (item) {
                item.title = $rootScope.pageTitle;
                // item.shareNow =  (item.item.date == item.oldDate && item.item.time == item.oldTime) ? item.shareNow = true : item.shareNow = false;
                item.isShareNow = !item.datetimeChanged;
                var date = new Date(item.item.date);
                var time = new Date(item.item.time);

                date = new Date(date.toDateString() + ' ' + time.toTimeString());
                // console.log(date);

                item.item.date = date;
                ShareService.share(item);
            });

        };

        $scope.openShareModal = function (share) {

            SocialConnectService.isReadyForConnection(share, function (result) {
                if (result) {
                    if (share == "facebook") {
                        selectPageModal();
                    } else {
                        shareWindow(share);
                    }
                }
                else {
                    $uibModal.open({
                        animation: true,
                        templateUrl: 'templates/modals/' + share + 'Modal.template.html',
                        windowTemplateUrl: 'templates/modals/shareModalWindow.template.html',
                        controller: 'Project.SocialModalController'
                    }).result.then(function (item) {
                        SocialConnectService.connectSocial(share).then(function () {
                            SocialConnectService.saveConfigToTeamDb();
                            if (share == "facebook") {
                                selectPageModal();
                            } else {
                                shareWindow(share);
                            }
                        });

                    })
                }

            });

        };

        $scope.showVideoModal = function() {
            if ($scope.result_video) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/modals/youtubeClipperModalContent.template.html',
                    windowTemplateUrl: 'templates/modals/shareModalWindow.template.html',
                    controller: 'Project.youtubeClipperModalController',
                    size: 'lg',
                    resolve: {
                        url: function () {
                            return {
                                path: $scope.result_video,
                                type: 'video',
                                title: $rootScope.pageTitle
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
                                path: ($scope.media[0] ? $scope.media[0].path : null),
                                type: 'verbose',
                                title: $rootScope.pageTitle
                            }
                        }
                    }
                });
            }
        }

        socket.on('media_added', function (msg) {
            // console.log(msg, '--Sam');
            $scope.upload_percent = 0;
            // check if this is Valid File
            if(!msg.success)
            {
                if(msg.msg=="unsupported file") {
                    $scope.inValidFile();                
                } else if(msg.msg == "InvalidAccessKeyId: The AWS Access Key Id you provided does not exist in our records.") {
                    // console.log(msg.msg);
                }
                    
            } 

            if ($scope.media.find(function (item) {
                    return (item.guid == msg.guid && !$scope.isFake(item.path));
                })) {
                // console.log('duplication detected');
            } else {
                var media = $scope.media.find(function (item) {
                    return item.guid == msg.guid;
                });

                if (typeof media == 'undefined') 
                {
                    // console.log(media);
                    return;
                }

                if (msg.path) {
                    media.path = msg.path;
                    media.name = msg.name;
                    media.resolution = msg.resolution;
                    media.order_in_project = msg.order_in_project;
                    media.id = msg.media_file_id;
                }
                else {
                    $scope.media.splice($scope.media.indexOf(media), 1);
                }

                // $scope.media.push(msg);
                $scope.$apply();
            }

        });

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
            // $scope.getCurrentUser();
            $scope.$watch('media.length', function () {
                if ($scope.media == undefined || $scope.media.length > 0) {
                    $scope.showProjects = true;
                } else {
                    $scope.showProjects = false;
                }
            });

            socket.emit('project_data_edit', {
                'project_id': $stateParams.id,
                'token': token
            });
            socket.removeListener('project_data_response_edit');
            socket.on('project_data_response_edit', function (msg) {
                // console.log('project response: ' + JSON.stringify(msg));
                if (msg == null) {
                    // console.log('ERROR: msg is null');
                    return;
                }

                if (msg.success == false) {
                    // console.log('ERROR: expected answer - { success: true }, err: ' + msg.msg);
                    $scope.message = {
                        error: msg.msg,
                        success: false
                    };
                } else {
                    // console.log('CORRECT');
                    // $rootScope.pageTitle = $sce.trustAsHtml('<input id="title_editing_input" type="text" value="' + msg.project_data.project_name + '" ><span id="title_editing_span">' + msg.project_data.project_name + '</span>') ;
                    $rootScope.pageTitle = msg.project_data.project_name;
                    $scope.media = msg.media_files.filter(function(obj) {
                        return !obj.deleted;
                    });
                    $scope.result_video = msg.project_data.result_video;
                    $scope.$apply();
                }
            });

            socket.on('schedule_task_inprogress', function () {
                $scope.loading = true;
                // console.log('sharing in progress');
            });

            socket.on('schedule_task_response', function (msg) {

                $timeout(function () {
                    $scope.loading = false;
                    $location.path('/tables');
                }, 500);

            });
        }

    }

})();