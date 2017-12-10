(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('Project.DetailController', Controller);

    function Controller($rootScope, $scope, $filter, $http, $q, $window, $state, $stateParams, $sce, $timeout, $location, LocalStorageService, HistoryManager, UploadService, FlashService, MediaService, socket, SocialConnectService, $uibModal, ShareService) {
        var token = LocalStorageService.getToken();
        var popupShowCount = 1;
        $scope.calcDiff = function(firstDate, secondDate){
            var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds    
            var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
            return diffDays;
        }
        
       /*  var windowRe = angular.element($window);
        windowRe.on('beforeunload', function (event) {
            //Do Something
            console.log('after reload');
            //After this will prevent reload or navigating away.
            // event.preventDefault();
        }); */

        // var token = LocalStorageService.getToken();        
         
        $scope.durationTotal = 0;
        socket.emit('project_details', {project_id: $stateParams.id});

        socket.removeListener('project_media_response');
        socket.on('project_media_response', function(media) {
            // console.log(media);
            $scope.time_limit_per_video_in_seconds = media.videoTotalTime;
            var mediaFiles = JSON.parse(JSON.stringify(media.mediaFile));
            // console.log(localStorage.getItem("media_files"), 'Emit !@#$');
            if((localStorage.getItem("media_files") == null)) {
                LocalStorageService.put('media_files', JSON.stringify(media.mediaFile));
                // console.log(JSON.stringify(media.mediaFile));
                var durationItem = JSON.parse(getObject('media_files'));
                $scope.durationTotal = 0;
                durationItem.forEach(function(element) {
                    if(isImage(element.path)) {
                        $scope.durationTotal += element.durationImage;
                    } else {
                        if(typeof element.seekTime == 'undefined') {
                             
                            $scope.durationTotal += element.duration;
                        } else {
                            $scope.durationTotal += element.duration;
                            $scope.durationTotal -= element.seekTime;
                        }
                    }
                }, this);
                $scope.totalTimeDuration = timeFormat($scope.durationTotal); //$scope.durationTotal.toFixed(2).toString().replace('.', ':');
            } else {
                var obj = [];
                var newMedia;
                for(var i=0; i<mediaFiles.length; i++) {
                    obj = JSON.parse(getObject('media_files'));
                    // console.log(obj);
                    var count = 0;
                    for(var j=0; j<obj.length; j++) {
                        if(mediaFiles[i].media_id == obj[j].media_id) {
                            newMedia = true;
                            break;
                        } else {
                            newMedia = false;
                        }
                    }
                    count++;
                    // console.log(mediaFiles[i].media_id, count);
                    if(!newMedia) {
                        updateJSON('media_files', mediaFiles[i]);
                    }

                    var durationItem = JSON.parse(getObject('media_files'));
                    $scope.durationTotal = 0;
                    durationItem.forEach(function(element) {
                        if(isImage(element.path)) {
                            $scope.durationTotal += element.durationImage;
                        } else {
                            if(typeof element.seekTime == 'undefined') {
                                //  console.log(element.seekTime, '33333');
                                $scope.durationTotal += element.duration;
                            } else {
                                $scope.durationTotal += element.duration;
                                $scope.durationTotal -= element.seekTime;
                            }
                        }
                    }, this);
                    // console.log($scope.durationTotal.toFixed(2), 'RTest');
                    $scope.totalTimeDuration = timeFormat($scope.durationTotal); //$scope.durationTotal.toFixed(2).toString().replace('.', ':');
                }
            }
        });
        
        function setObject(key, obj) {
            localStorage.setItem(key, JSON.stringify(obj));
        }

        function getObject(key) {
            return LocalStorageService.get(key);
        }

        function updateItem(key, media_id, property, value)
        {
            var obj = JSON.parse(getObject(key));
            for(var i=0; i < obj.length; i++) {
                if(media_id == obj[i].media_id) {
                    // console.log(media_id, obj[i]);
                    obj[i][property] = value;
                }
            }
            setObject(key, obj);
        }

        function updateAllItem(key, property, value) {
            var obj = JSON.parse(getObject(key));
            for (var i = 0; i < obj.length; i++) {
                obj[i][property] = value;
            }
            setObject(key, obj);
        }

        function objectValue(key, media_id, property) {
            var obj = JSON.parse(getObject(key));
            for(var i=0; i<obj.length; i++) {
                if(media_id == obj[i].media_id) {
                    // console.log(media_id, obj[i]);
                }
            }
        }

        function updateJSON(key, item) {
            var obj = JSON.parse(getObject(key));
            obj.push(item);
            setObject(key, obj);
        }

        function deleteJSON(key, media_id) {
            var json = JSON.parse(getObject(key));
            for (var i=0;i<json.length;i++) {
                if (json[i].media_id == media_id) {
                    json.splice(i,1);
                } 
            }
            setObject(key, json);
        }

        function filterJSON(key, media_id) {
            // console.log(key);
            var json = JSON.parse(getObject(key));
            // console.log(getObject(key));
            // console.log(json);
            for(var i=0; i<json.length; i++) {
                if(json[i].media_id == media_id) {
                    return json[i];
                }
            }
        }

        this.currentTime = 0;
        this.totalTime = 0;
        this.state = null;
        this.volume = 1;
        this.isCompleted = false;
       
        $scope.$API = null;
        $scope.loadingData = '';
        $scope.project_id = $stateParams.id;
        $scope.downloadVideo = '';
        $scope.progress_percent = 0;
        $scope.progress_text = '';
        // $scope.main_item = { id: $stateParams.media_id, path: '' };
        $scope.loading = false;
        $scope.timer = {
            isopen: false
        };

        if (getObject('main_item')) {
            $scope.main_item = {
                id: JSON.parse(getObject('main_item')), 
            };
        } else {
            $scope.main_item = {
                id: $stateParams.media_id,
                path: ''
            };
            setObject('main_item', $stateParams.media_id);
        }
        // $scope.zoomLevel = 0;
        $scope.config = {
            isCropping: false,
            cropstep: 1,
            cropImage: '',
            currentZoom: 100,
            // boundary: {width: 711, height:400},
            // cropData: {},
            cropperOptions: {
                aspectRatio: 16 / 9,
                viewport: {width: 710, height:400},
                boundary: {width:711, height:400},
                url: '',
                
            //     center: false,
            //     zoomOnWheel: true,
            //     zoomOnTouch: false,
            //     crop: function (e) {
            //         $scope.config.cropData = e;
            //         // console.log(e)
                // }
            },
            croppieOptions: {
                mouseWheelZoom: true,
                enforceBoundary: true
            },
            videoSource: '',
            isLoadedVideo: false,
            // ratio: '169',
            height: '100%',
            width: '100%',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0'
        };
        
        
        $scope.minSlider = {
            value : 10,
            options: {
                floor: 1,
                ceil: 30,
                step: 1,
            }
        }

        $scope.zoomslider = {
            value: 0,
            options: {
                floor: 0,
                ceil: 5,
                step: 0.1,
                // precision: 1,
                hideLimitLabels: true,
                hidePointerLabels: true,
                translate: function (value) {
                    // var zoom = (!isNaN(min))?(min+(value*ratio)):1;
                    var zoom = Math.pow(1.35, value - 5);
                    // console.log("Zoom: ", value);
                    // $scope.cropImage.setZoom(value); 
                },
            }
        }

        $scope.textEditor = {
            header: null,
            footer: null,
            body: null,
            selected: null,   //Selected Element ID
            isDragging: true, //Are we currently Dragging
            startX: null,     //Last Drag Position
            startY: null,     //last Drag Posiiton
            isEditMode : false,
            toolbarX: 0,
            toolbarY: 0,
            //Clears the current selected element
            clearSelection: function () {
                $scope.textEditor.selected = null;
                $scope.textEditor.isEditMode =  null;

            },
            clearSelectionPrevent: function ($event) {
                $event.stopPropagation();

            },
            updateTextOverlay: function(item) {
                // console.log(item);
                var overlay = angular.copy(item);
                // console.log(overlay);
                $scope.contenteditable = 'false';
                overlay.time_range=JSON.stringify((overlay.time_range)?overlay.time_range:{startTime:'00:00', endTime:'59:59'});
                overlay.token = token;
                if(overlay.overlay_type != 'png') {
                    var overlay_test = document.getElementById('text_overlay_'+overlay.id);
                    domtoimage.toPng(overlay_test.getElementsByClassName('angular-meditor-content')[0])
                    .then(function (dataUrl) {
                        overlay.base64 = dataUrl;
                        if(dataUrl != 'data:,') {
                            socket.emit('update_text_overlay', overlay);
                        }
                        // console.log("Update Text Overlay invoked", dataUrl);
                    })
                    .catch(function (error) {
                        console.error('oops, something went wrong!', error);
                    });
                } else {
                    socket.emit('update_text_overlay', overlay);
                    // console.log("Update PNG Overlay invoked", overlay);
                }
                
            },
            deleteTextOverlay: function(overlay) {
                // console.log(overlay);
                overlay.token = token;
                socket.removeListener('delete_text_overlay_response');
                socket.emit('delete_text_overlay', overlay);
                socket.on('delete_text_overlay_response', function(msg) {
                    if (msg.success)
                    {
                        $scope.main_item.texts = $scope.main_item.texts.filter(function (obj) {
                            return obj.id != overlay.id;
                        });
                    }
                });
            },
            setEditable : function(t,$event)
            {
                $scope.textEditor.isEditMode =  t;
                $event.stopPropagation();
            },
            setText : function(t, $event){
                console.warn("Set Text");
                $scope.textEditor.selected.html = $event.value;
            },
            // angular.element($window).bind("keyup", function($event) {
            keydown: function ($event) {
                if ($event.keyCode == 46) // Delete Key
                {
                    $scope.main_item.texts = $scope.main_item.texts.filter(function(obj) {
                        return obj != $scope.textEditor.selected;
                    });
                    $scope.textEditor.selected = null;  
                     $scope.textEditor.isEditMode = false;
                }
            },
            mouseDown: function (textOverlay, $event) //0 header, 1 body  2 footer
            {
                // if ( $scope.textEditor.isEditMode)
                //     return;
                //  $scope.textEditor.selected = textOverlay;
                // if ($scope.textEditor.selected == textOverlay) {
                //     $scope.textEditor.startX = $event.screenX;
                //     $scope.textEditor.startY = $event.screenY;
                // console.log($scope.textEditor.isDragging)    
                $scope.textEditor.isDragging = true;
                    
                //     return;
                // }
                // $event.stopPropagation();
            },

            mouseUp: function ($event) {
                // $scope.textEditor.updateTextOverlay(textOverlay);
                // console.log(item, $scope.textEditor.isDragging);
                
                $scope.textEditor.isDragging = false;
            },
            mouseMove: function ($event) {
                 if (!$scope.textEditor.isDragging) {
                    //  console.log($scope.textEditor.isDragging);
                    return;
                 }
                    
                    
                // var deltax = $event.screenX - $scope.textEditor.startX;
                // var deltay = $event.screenY - $scope.textEditor.startY;
                // $scope.textEditor.startX = $event.screenX;
                // $scope.textEditor.startY = $event.screenY;
                // //TODO::(MOURA) Messy way of doing this.

                // $scope.textEditor.selected.Left += deltax;
                // $scope.textEditor.selected.Top += deltay;
                // $scope.textEditor.toolbarX = $scope.textEditor.selected.Left - 192 / 2;
                // $scope.textEditor.toolbarY = $scope.textEditor.selected.Top - 80;
                //                 $event.stopPropagation();

            },
            colorPick: function() {
                
            }
        }

        $scope.deleteOverlay = function(overlay) {
            overlay.token = token;
            socket.removeListener('delete_text_overlay_response');
            socket.emit('delete_text_overlay', overlay);
            socket.on('delete_text_overlay_response', function(msg) {
                if (msg.success)
                {
                    $scope.main_item.texts = $scope.main_item.texts.filter(function (obj) {
                        return obj.id != overlay.id;
                    });
                }
            });
        }

        $scope.insertNewTextOverlay = function(position) {
            var playgroundPos = $('#text-editor-playground').offset();
            var newOverlay = { 
                media_id: $scope.main_item.id,
                content: 'Click twice here to edit text', 
                o_width: 240,
                o_height: 80,
                // fontSize: '60px',
                // fontWeight: 'normal',
                fontStyle: 'normal',
                o_left: Math.round($('#text-editor-playground').width() / 2 - 120),
                o_degree: 0,
                time_range:JSON.stringify({startTime:'00:00', endTime: convertSecondsToStopWatchString($scope.main_item.slider.max)})
            };

            switch(position) 
            {
                case "header":
                    newOverlay.o_top = 20;
                    break;
                case "body":
                    newOverlay.o_top = Math.floor($('#text-editor-playground').height() / 2 - 40);
                    break;
                case "footer":
                    newOverlay.o_top = Math.floor($('#text-editor-playground').height() - 20);
                    break;
            }

            updateItem('media_files', $scope.main_item.id, 'overlay', newOverlay);
            
            newOverlay.token = token;
            socket.removeListener('create_text_overlay_response');
            socket.emit('create_text_overlay', newOverlay);
            socket.on('create_text_overlay_response', function(msg) {
                if (msg.success)
                {
                    if (!$scope.main_item.texts)
                        $scope.main_item.texts = [];
                    newOverlay.id = msg.id;
                    newOverlay.time_range=JSON.parse(newOverlay.time_range);
                    $scope.main_item.texts.push(newOverlay);
                }
            });
        }

        $scope.zoomslider2 = {
            value: 100,
            options: {
                floor: 100,
                ceil: 300,
                step: 10,
                hideLimitLabels: true,
                hidePointerLabels: true,
            }
        }

        socket.on('processData', function(data) {
            $scope.loadingData = data;
        });

        socket.on('processData1', function(data) {
            console.log(data);
        });

        socket.on('ProcessPercentage', function(data) {
            $scope.loadingPer = parseInt(data);
        });

        $scope.video_config = {
            theme: "components/videogular-themes-default/videogular.css"
        };

        $scope.isImage = function (path) {
            return isImage(path);
        }

        $scope.isVideo = function (path) {
            return isVideo(path);
        }

        $scope.getUuid = function (path) {
            var arr = path.match(/([^\/]+)(?=\.\w+$)/);
            return (arr && arr.length > 0) ? arr[0] : '';
        }

        var timeFormat = function(time) {
            if(typeof time != 'undefined') {
                var hours = parseInt( time / 3600 );
                hours = hours < 10 ? '0'+hours : hours; 
                var minutes = parseInt( time / 60 ); 
                minutes = minutes < 10 ? '0'+minutes : minutes;
                var seconds = (time % 60).toFixed(2);
                seconds = seconds < 10 ? '0'+seconds : seconds;
                return (hours+':'+minutes+':'+seconds);
            }
        }

        $scope.$watch('main_item.id', function (newval, oldval) {
            var item = filterJSON('media_files', newval);
            if(newval == oldval) {
                $scope.config.ratio = item.crop_ratio;
            }
            console.log($scope.config.ratio);
            
            if(typeof item != 'undefined')
                $scope.main_item.style = item.style;

            if(isVideo(item.path)) {
                $(".controls-container span.rz-vislow").hide();
                $(".controls-container span.rz-vishigh").hide();
                $scope.main_item.duration = item.duration;
                console.log(timeFormat(item.durationVideo));
                $scope.main_item.videoDuration = timeFormat(item.durationVideo); //$scope.main_item.durationVideo.toFixed(2).toString().replace('.', ':');
                
                $scope.minRangeSlider.max = item.duration; 
                $scope.minRangeSlider.min = item.seekTime;

                switch($scope.config.ratio) {
                    case '169': $scope.main_item.pathAspect = $scope.main_item.ratio169; 
                                if($scope.main_item.ratio169 != null && $scope.main_item.ratio169 != '') {
                                    $scope.main_item.pathAspect =  $scope.main_item.ratio169;
                                    // console.log('$scope.main_item.ratio169');
                                } else {
                                    $scope.main_item.pathAspect = $scope.main_item.path;
                                    // console.log('$scope.main_item.path');
                                }
                                break;
                    case '11': $scope.main_item.pathAspect = $scope.main_item.ratio11;
                                if($scope.main_item.ratio11 != null && $scope.main_item.ratio11 != '') {
                                    $scope.main_item.pathAspect =  $scope.main_item.ratio1;
                                } else {
                                    $scope.main_item.pathAspect =  $scope.main_item.path;
                                }
                                break;
                    case '916': $scope.main_item.pathAspect = $scope.main_item.ratio916;
                                if($scope.main_item.ratio916 != null && $scope.main_item.ratio916 != '') {
                                    $scope.main_item.pathAspect =  $scope.main_item.ratio916;
                                } else {
                                    $scope.main_item.pathAspect =  $scope.main_item.path;
                                }
                                break;
                }

                // $scope.config.isCropping = false;
                $scope.video_config.sources = [
                    { src: $sce.trustAsResourceUrl($scope.main_item.pathAspect), type: "video/mp4" }
                ];
                // console.log($scope.main_item);
                // console.log('data')
            } else {
                
                $scope.main_item.duration = item.durationImage;
                $scope.minSlider.value = item.durationImage;
                
                switch($scope.config.ratio) {
                    case '169': $scope.main_item.pathAspect = item.ratio169; 
                                break;
                    case '11': $scope.main_item.pathAspect = item.ratio11;
                                console.log(item.ratio11);
                                break;
                    case '916': $scope.main_item.pathAspect = item.ratio916;
                                break;
                }
            }
            // console.log(newval, oldval, 'Emit Data');
            // console.log($scope.durationTotal);
                        
            if (newval === oldval) return;
            
        });

        $scope.$watch('currentTimer', function (newval, oldval) {
            // console.log("currentTimer changed: ", newval, oldval);
            $scope.download = $scope.main_item.representative;
            if ($scope.main_item && $scope.main_item.slider) {
                $scope.main_item.slider.max = Number(newval);
                // console.log($scope.main_item)
            }
            // set Maximum end timer for Text Overlay
            // $scope.maxtimer=(Number(newval)<10)?'0'+newval+':00':newval+':00';
        });

        $scope.$watch('minSlider.value', function(newval, oldval) {
                if(newval === oldval) {
                    return;
                }

                // $scope.durationTotal += (newval - oldval);
                if(typeof newval != 'undefined' && newval != null) {
                    // console.log(newval, oldval, 'Media Slider');
                    $scope.minSlider.value = newval;
                    updateItem('media_files', $scope.main_item.id, 'durationImage', newval);
                } 
                
                var durationItem = JSON.parse(getObject('media_files'));
                $scope.durationTotal = 0;
                durationItem.forEach(function(element) {
                    if(isImage(element.path)) {
                        $scope.durationTotal += element.durationImage;
                    } else {
                        if(typeof element.seekTime == 'undefined') {
                            //  console.log(element.seekTime, '44444');
                            $scope.durationTotal += element.duration;
                        } else {
                            $scope.durationTotal += element.duration;
                            $scope.durationTotal -= element.seekTime;
                        }
                    }
                }, this);
                $scope.totalTimeDuration = timeFormat($scope.durationTotal); //$scope.durationTotal.toFixed(2).toString().replace('.', ':');
        });

        /* $scope.$watch('config.isCropping', function (newval, oldval) {
            console.log($scope.main_item);
            switch($scope.config.ratio) {
                case '169': 
                            if($scope.main_item.ratio169 != null && $scope.main_item.ratio169 != '') {
                                $scope.main_item.pathAspect = $scope.main_item.ratio169;
                                
                            } else if (typeof $scope.main_item.ratio169 == 'undefined') {
                                console.log($scope.main_item.id);
                                console.log('Test Case 12', $scope.main_item.pathAspect, 'Test');
                            } else {
                                console.log($scope.main_item.path);
                                $scope.main_item.pathAspect = $scope.main_item.path;
                                console.log('Test Case 1');
                            }
                            
                            break;
                case '11': 
                            if($scope.main_item.ratio11 != null && $scope.main_item.ratio11 != '') {
                                $scope.main_item.pathAspect =  $scope.main_item.ratio11;
                            } else {
                                $scope.main_item.pathAspect = $scope.main_item.path;
                            }
                            console.log('Test Case 2');
                            break;
                case '916': 
                            if($scope.main_item.ratio916 != null && $scope.main_item.ratio916 != '') {
                                $scope.main_item.pathAspect =  $scope.main_item.ratio916;
                            } else {
                                $scope.main_item.pathAspect = $scope.main_item.path;
                            }
                            console.log('Test Case 3');
                            break;
            }
            if (newval == true) {
                console.log($scope.main_item.pathAspect);
                $scope.config.videoSource = $scope.main_item.pathAspect;

                $timeout(function () {
                    $scope.video_config.sources = [
                        { src: $sce.trustAsResourceUrl($scope.main_item.pathAspect), type: "video/mp4" }
                    ];
                    $scope.$API.clearMedia();
                    $scope.video_config.sources = [
                        { src: $sce.trustAsResourceUrl($scope.config.videoSource), type: "video/mp4" }
                    ];
                    $scope.$API.changeSource($scope.video_config.sources);
                }, 0);
                if ($scope.main_item.representative && isVideo($scope.main_item.representative)) {
                    $timeout(function () {
                        $scope.video_config.download = [
                            { src: $sce.trustAsResourceUrl($scope.main_item.representative), type: "video/mp4" }
                        ];

                    }, 0);
                }
            }
            else {
                console.log($scope.main_item.pathAspect);
                $scope.config.videoSource = $scope.main_item.pathAspect;
                // $scope.main_item.representative ? $scope.main_item.representative : $scope.main_item.path;
                // $timeout(function () {
                //     // $scope.$API.clearMedia();
                //     $scope.video_config.sources = [
                //         { src: $sce.trustAsResourceUrl($scope.config.videoSource), type: "video/mp4" }
                //     ];
                //     // $scope.$API.changeSource($scope.video_config.sources);
                // }, 0);
                if ($scope.main_item.representative && isVideo($scope.main_item.representative)) {
                    $timeout(function () {
                        $scope.video_config.download = [
                            { src: $sce.trustAsResourceUrl($scope.main_item.representative), type: "video/mp4" }
                        ];

                    }, 0);
                }
            }
        }); */

        $scope.keyup = function ($event) {
            if ($event.keyCode == 17) // control key
                $scope.ctrlDown = false;

            // $scope.$apply();
        };

        // angular.element($window).bind("keydown", function($event) {
        $scope.keydown = function ($event) {
            if ($event.keyCode == 17) // control key
                $scope.ctrlDown = true;
            if ($scope.ctrlDown && $event.keyCode == 90) // ctrl + z
            {
                $event.preventDefault();
                // console.log('ctrl + z clicked');
                $scope.undo();
            }
            if ($scope.ctrlDown && $event.keyCode == 89) // ctrl + y
            {
                $event.preventDefault();
                // console.log('ctrl + y clicked');
                $scope.redo();
            }
            // $scope.$apply();
        };

        angular.element($window).bind("resize", function ($event) {
            $scope.refreshSlider();
            $scope.$apply();
        });

        $scope.refreshSlider = function () {
            $timeout(function () {
                // console.log('refreshSlider');
                $scope.$broadcast('rzSliderForceRender');
            }, 500);
        };

        $scope.deleteMedia = function (medium) {
            socket.emit('set_media_deleted', {
                id: medium.id,
                value: 1,
                token: token
            });

            deleteJSON('media_files', medium.id);

            var candidate;
            if ($scope.media.findIndex(function (obj) { return obj.id == medium.id }) > 0)
                candidate = $scope.media[$scope.media.findIndex(function (obj) { return obj.id == medium.id }) - 1];
            else
                candidate = $scope.media[1];
            $scope.setMainItemAs(candidate);

            $scope.media = $scope.media.filter(function (obj) {
                return medium.id != obj.id;
            });

            HistoryManager.log('delete', JSON.stringify(medium));
        }

        $scope.playVideo = function() {
            $scope.$API.playPause();
            $('#videoPlayer').toggleClass('fa-play fa-pause');
        }

        $scope.cloneMedia = function (medium) {
            
            if(isVideo(medium.path))
            {
                var preview = { name: medium.name, path: medium.path, representative: medium.representative, guid: guid(), id: 0, slider: { min: medium.slider.min, max: medium.slider.max } };
                preview.slider.options = medium.slider.options;
            } else {
                var preview = { name: medium.name, path: medium.path, representative: medium.representative, guid: guid(), id: 0, slider: medium.slider };
            }

            $scope.media.splice($scope.media.indexOf(medium) + 1, 0, preview);

            // socket.removeListener('clone_media_response');
            socket.emit('clone_media', {
                id: medium.id,
                guid: preview.guid,
                token: token
            });

            socket.removeListener('clone_media_response');
            socket.on('clone_media_response', function (msg) {
                if (msg.success) {
                    var clonee = $scope.media.find(function (item) {
                        return item.guid && (item.guid == msg.guid);
                    });
                    if (clonee) {
                        clonee.path = msg.path;
                        clonee.name = msg.name;
                        clonee.resolution = msg.resolution;
                        clonee.deleted = msg.deleted;
                        clonee.range = msg.range;
                        clonee.id = msg.id;
                        if(isVideo(msg.path)) {
                            updateJSON('media_files', {media_id: msg.id, path: msg.path, representative: '', resolution: msg.resolution, crop_data: '', crop_ratio: '', seekTime: 0, ratio169: msg.ratio169, ratio11: msg.ratio11, ratio916: msg.ratio916});
                        } else {
                            updateJSON('media_files', {media_id: msg.id, path: msg.path, representative: '', resolution: msg.resolution, crop_data: '', crop_ratio: '', durationImage: 10, ratio169: msg.ratio169, ratio11: msg.ratio11, ratio916: msg.ratio916});
                        }
                    }

                    // console.log(clonee, 'clonee');
                    $scope.setMainItemAs(clonee);
                    HistoryManager.log('clone', JSON.stringify([medium, clonee]));
                    MediaService.smartOrder($scope.media);
                }
            });

        }

        socket.removeListener('preview_download');
        socket.on('preview_download', function(url) {
            $scope.downloadVideo = url; 
            $scope.downloadVideoSrc = [
                { src: $sce.trustAsResourceUrl(url), type: "video/mp4" }
            ];
            $scope.video_loading = false; 
        });

        var getIndexFromMedia = function (medium, media) {
            for (var i = 0; i < media.length; i++) {
                if (media[i].order_in_project > medium.order_in_project)
                    return i;
            }
            return media.length;
        }

        $scope.undo = function () {
            var newestAction = HistoryManager.undo();
            switch (newestAction.split(' ')[0]) {
                case 'delete':
                    var medium = JSON.parse(newestAction.substring(newestAction.indexOf(' ') + 1));
                    socket.emit('set_media_deleted', {
                        id: medium.id,
                        value: 0,
                        token: token
                    });
                    $scope.media.splice(getIndexFromMedia(medium, $scope.media), 0, medium);
                    $scope.setMainItemAs(medium);
                    break;
                case 'move':
                    var indexArray = JSON.parse(newestAction.substring(newestAction.indexOf(' ') + 1));
                    var oldIndex = indexArray[0];
                    var newIndex = indexArray[1];
                    var temp = $scope.media[newIndex]; // get newIndexed
                    $scope.media = $scope.media.filter(function (obj) {
                        return obj.id != temp.id;
                    });
                    $scope.media.splice(oldIndex, 0, temp);

                    MediaService.smartOrder($scope.media);
                    break;
                case 'clone':
                    var cloneArray = JSON.parse(newestAction.substring(newestAction.indexOf(' ') + 1));
                    var cloned = $scope.media[$scope.media.findIndex(function (obj) {
                        return obj.id == cloneArray[0].id
                    })];
                    var clonee = $scope.media[$scope.media.findIndex(function (obj) {
                        return obj.id == cloneArray[1].id
                    })];

                    socket.emit('set_media_deleted', {
                        id: clonee.id,
                        value: 1,
                        token: token
                    });

                    $scope.setMainItemAs(cloned);
                    $scope.media = $scope.media.filter(function (obj) {
                        return obj.id != clonee.id;
                    });

                    break;
            }
        };

        $scope.redo = function () {
            var newestUndo = HistoryManager.redo();
            switch (newestUndo.trim().split(' ')[0]) {
                case 'delete':
                    var medium = JSON.parse(newestUndo.substring(newestUndo.indexOf(' ') + 1));
                    $scope.deleteMedia(medium);
                    break;
                case 'move':
                    var indexArray = JSON.parse(newestUndo.substring(newestUndo.indexOf(' ') + 1));
                    var oldIndex = indexArray[0];
                    var newIndex = indexArray[1];
                    var temp = $scope.media[oldIndex];
                    $scope.media = $scope.media.filter(function (obj) {
                        return obj.id != temp.id;
                    });
                    $scope.media.splice(newIndex, 0, temp);

                    MediaService.smartOrder($scope.media);
                    HistoryManager.log('move', JSON.stringify([oldIndex, newIndex]));
                    break;
                case 'clone':
                    var cloneArray = JSON.parse(newestUndo.substring(newestUndo.indexOf(' ') + 1));
                    var clonedIndex = $scope.media.findIndex(function (obj) {
                        return obj.id == cloneArray[0].id
                    });
                    $scope.media.splice(clonedIndex + 1, 0, cloneArray[1]);
                    $scope.setMainItemAs(cloneArray[1]);
                    socket.emit('set_media_deleted', {
                        id: cloneArray[1].id, // clonee
                        value: 2,
                        token: token
                    });
                    HistoryManager.log('clone', JSON.stringify([cloneArray[0], cloneArray[1]]));
                    break;
            }
        };

        $scope.location = function (media_id) {
            $location.search('media_id', media_id);
        }


        var smartTextTimes = function(medium) {
            // console.log("------------1111111111----------", medium);
            if(medium.texts) {
                angular.forEach(medium.texts, function(value, key) {
                    try {
                        if ((typeof value.time_range) == "string")
                            value.time_range=JSON.parse(value.time_range);
                        if(!angular.isObject(value.time_range))
                        {
                            // debugger;
                            value.time_range={startTime:'00:00', endTime:'59:59'};
                        }
                        else{
                            value.time_range.endTime=(value.time_range.endTime)?value.time_range.endTime:'59:59';
                            value.time_range.startTime=(value.time_range.startTime)?value.time_range.startTime:'00:00';

                            // console.log("media time range: ", value.time_range);
                        }
                        
                    } catch (e) {
                        // debugger;
                        value.time_range={startTime:'00:00', endTime:'59:59'};
                    }
                    // console.log(value.time_range);                  
                });
            }
            // return medium;
        }

        $scope.setMainItemAs = function (medium) {
            
            $timeout(function () {
                if (!medium)
                    return;

                setObject('main_item', medium.id);
                // $scope.config.isCropping = false;
                $scope.main_item = $scope.media[$scope.media.findIndex(function (obj) { return medium.id == obj.id })];
                
                console.log(medium, 'Data 123');
                // console.log(medium.slider, 'Data 123');

                if(isVideo(medium.path)) {
                    $scope.minRangeSlider.max = Number(medium.slider.max);
                    $scope.minRangeSlider.min = Number(medium.slider.min);
                    $scope.minRangeSlider.options.ceil = Number(medium.slider.options.ceil);
                } else {
                    $scope.minSlider.value = Number(medium.slider.value);
                }
                
                $scope.config.videoSource = medium.path;
                $scope.config.preview = medium.representative;
                
                smartTextTimes($scope.main_item);
 
                if (isVideo(medium.path)) {
                    var obj = filterJSON('media_files', medium.id);
                    $scope.main_item.videoDuration = timeFormat(obj.durationVideo);
                    switch(medium.aspect_ratio) {
                        case '169':
                            // console.log(obj.ratio169);
                            if (obj.ratio169 == null || typeof obj.ratio169 == 'undefined') {
                                // console.log('Test Case 1');
                                $scope.main_item.pathAspect = obj.path;
                            } else {
                                $scope.main_item.pathAspect = obj.ratio169;
                            }
                            break;
                        case '11':
                            if (obj.ratio11 == null || typeof obj.ratio11 == 'undefined') {
                                $scope.main_item.pathAspect = obj.path;
                            } else {
                                $scope.main_item.pathAspect = obj.ratio11;
                            }
                            break;
                        case '916':
                            if (obj.ratio916 == null || typeof obj.ratio916 == 'undefined') {
                                $scope.main_item.pathAspect = obj.path;
                            } else {
                                $scope.main_item.pathAspect = obj.ratio916;
                            }
                            break;
                    }
                        // console.log($scope.main_item.pathAspect);
                        $scope.video_config.sources = [
                            { src: $sce.trustAsResourceUrl($scope.main_item.pathAspect), type: "video/mp4" }
                        ];
                    
                    /* if (medium.representative && isVideo(medium.representative)) {
                        $timeout(function () {
                            $scope.video_config.download = [
                                { src: $sce.trustAsResourceUrl(medium.representative), type: "video/mp4" }
                            ];

                        }, 0);
                    } */
                } else {
                    var obj = filterJSON('media_files', medium.id);
                    // console.log(obj);
                    switch (medium.aspect_ratio) {
                        case '169':
                            if (obj.ratio169 == null || typeof obj.ratio169 != 'undefined') {
                                $scope.main_item.pathAspect = obj.path;
                            } else {
                                $scope.main_item.pathAspect = obj.ratio169;
                            }
                            break;
                        case '11':
                            if (obj.ratio11 == null || typeof obj.ratio11 != 'undefined') {
                                $scope.main_item.pathAspect = obj.path;
                            } else {
                                $scope.main_item.pathAspect = obj.ratio11;
                            }
                            break;
                        case '916':
                            if (obj.ratio916 == null || typeof obj.ratio916 == 'undefined') {
                                $scope.main_item.pathAspect = obj.path;
                            } else {
                                $scope.main_item.pathAspect = obj.ratio916;
                            }
                           
                            break;
                    }
                }
                $scope.config.isCropping = false;
            }, 0);
            // if($scope.currentTimer!=null && $scope.main_item)
            //     $scope.main_item.slider.max=$scope.currentTimer; // save currentTimer

        }
        

        $scope.timerInvoke = function ($event, medium) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.timer.isopen = true;
            $scope.setMainItemAs(medium);
            // $scope.main_item = medium;
            // if (isVideo(medium.path))
            // {
            //     $timeout(function(){
            //         $scope.video_config.sources = [
            //             {src: $sce.trustAsResourceUrl(medium.path), type: "video/mp4"}
            //         ];
            //     }, 0);
            // }
        }

        $scope.inValidFile = function () {
            if ($scope.invalidModalVisible) return;
            $scope.invalidModalVisible = true; // set Visible unique modal
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
                $scope.invalidModalVisible = false; // reset Visible unique modal
            })
        }

        var replaceMainItemWith = function (media) {
            $scope.replace_inProgress = false;
            $scope.setMainItemAs(media);
        };
        
        socket.removeListener('media_added');
        socket.on('media_added', function (msg) {
           
            // console.log(msg);

            // check if this is Valid File
            if (!msg.success || msg.msg == "unsupported file") {
                
                $scope.inValidFile();
            }

            if ($scope.media.find(function (item) {
                return (item.id == msg.id && !$scope.isFake(item.path));
            })) {
                // console.log('duplication detected');
            } else {
                var media = $scope.media.find(function (item) {
                    return item.guid == msg.guid;
                });

                if (typeof media == 'undefined') {
                    // console.log('media error happened!');
                    return;
                }

                if (msg.path) {
                    media.path = msg.path;
                    media.name = msg.name;
                    media.resolution = msg.resolution;
                    media.order_in_project = msg.order_in_project;
                    media.id = msg.media_file_id;
                    
                    if (isVideo(media.path)) {
                        var video = document.createElement('video');
                        video.preload = 'metadata';
                        video.onloadedmetadata = function () {
                            window.URL.revokeObjectURL(this.src);
                            var duration = Math.floor(video.duration);
                            var range = (media.range) ? media.range.split(',') : [0, duration];
                            // debugger;

                            var mediaData = filterJSON('media_files', media.id);
                            media.slider = {
                                min: mediaData.seekTime,
                                max: mediaData.duration,
                                options: {
                                    floor: 0,
                                    ceil: mediaData.durationVideo,
                                    step: 1
                                }
                            };
                            if ($scope.replace_inProgress)
                                replaceMainItemWith(media);
                            
                        }
                        video.src = media.path;
                    }
                    else {
                        var range = (media.range) ? media.range.split(',') : [0, 3];
                        media.slider = {
                            max: range[1],
                            min: range[0]
                        };
                        if ($scope.replace_inProgress)
                            replaceMainItemWith(media);
                    }

                }
                else {
                    $scope.media.splice($scope.media.findIndex(function (obj) { return obj.id == media.id }), 1);
                }

                // $scope.media.push(msg);
                $scope.$apply();
            }
        });

        $scope.isFake = function (file_path) {
            return file_path == config.image.waitForAdd;
        }

        $scope.uploadFiles = function (files, cb) {
            if (files && files.length) {
                $scope.replace_inProgress = true;
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (!file.$error) {
                        var preview = fakePreview(file.name);
                        preview.order_in_project = $scope.main_item.order_in_project;
                        $scope.media.push(preview);
                        $scope.$apply();
                        UploadService.uploadFile(file, { project_id: $stateParams.id, guid: preview.guid, order_in_project: $scope.main_item.order_in_project });
                    }
                }
                if (cb)
                    cb();
            }
        }

        $scope.uploadPngFiles = function (files, cb) {
            var newOverlay = { 
                media_id: $scope.main_item.id,
                o_width: 240,
                o_height: 80,
                o_left: $('#text-editor-playground').width() / 2 - 120,
                o_top: Math.floor($('#text-editor-playground').height() / 2 - 40),
                o_degree: 0,
                time_range:{}
            };

            newOverlay.token = token;

            if (files && files.length) {
                $scope.replace_inProgress = true;
       
                if(files[0].type!='image/png') {
                    alert("Please upload only png image");
                    // var modalInstance = $uibModal.open({
                    //     animation: true,
                    //     templateUrl: 'templates/modals/warningModalContent.template.html',
                    //     controller: 'ConfirmModalController',
                    //     size: 'md',
                    //     resolve: {
                    //         content: function () {
                    //             return 'Please upload only png image.';
                    //         }
                    //     }
                    // });
                    return false;
                }

                $("#overlay_image_add_button_id").parent().removeClass("show").addClass("hide");
                $("#overlay_image_loading_id").removeClass("hide").addClass("show");

                //for (var i = 0; i < files.length; i++) {
                    var i = 0;
                    var file = files[i];
                    if (!file.$error) {
                        var preview = fakePreview(file.name);
                        UploadService.uploadFile(file, { newOverlay: newOverlay, project_id: $stateParams.id, guid: preview.guid, order_in_project: $scope.main_item.order_in_project, overlay: true });
                    }
                //}
                   
                if (cb){
                    cb();
                }
            }
        }

        function inArray(array, key, data) {
            var count = array.length;
            var i=0;
            // console.log(count);
            var r = array.forEach(function(value) {
                if(value[key] != data) {
                    //console.log('00000000----',i);
                    i++;
                    // if(i == count) {
                    //     console.log('00000000----',i);
                    //     return true;
                    // }
                }
            });
            if(i != count) {
                return false;
            }else {
                // console.log('00000000----',i);
                return true;
            }
            // console.log(array, key);
        }

        socket.removeListener('pngOverlay');
        socket.on('pngOverlay', function(msg) {
            // console.log("-----", msg.id)
            var newOverlay = { 
                id: msg.id,
                media_id: msg.media_id,
                content: msg.content, 
                o_width: msg.o_width,
                o_height: msg.o_height,
                o_left: msg.o_left,
                o_top: msg.o_top,
                o_degree: msg.o_degree,
                overlay_type: msg.overlay_type,
                time_range: msg.time_range,
                base64: msg.base64
            };
      
            if(inArray($scope.main_item.texts, 'id', msg.id)) {
                // console.log('123');
                $scope.main_item.texts.push(newOverlay);
            }
            
            $("#overlay_image_add_button_id").parent().removeClass("hide").addClass("show");
            $("#overlay_image_loading_id").removeClass("show").addClass("hide");
            // console.log($scope.main_item.texts);
        });

        $scope.replaceWithUploadedFiles = function (files) {
            // var orderedMedia = $filter('orderBy')($scope.media, 'order_in_project');
            // MediaService.smartOrder(orderedMedia);
            for (var index = 0; index < orderedMedia.length; index++) {
                if (orderedMedia[index].id == $scope.main_item.id) {
                    $scope.main_item.order_in_project = index + 1;
                    break;
                }
            }

            $scope.uploadFiles(files, function () {
                socket.emit('set_media_deleted', {
                    id: $scope.main_item.id,
                    value: 1,
                    token: token
                });
                socket.removeListener('set_media_deleted_response');
                $scope.main_item.deleted = 1;
                $scope.$apply();
            });
        }

        $scope.sortConfig = {
            animation: 150,
            onSort: function (evt) {
                MediaService.smartOrder(evt.models);
                $scope.media = evt.models;
                HistoryManager.log('move', JSON.stringify([evt.oldIndex, evt.newIndex]));
            }
        };

        socket.removeListener('set_project_video_response');
        socket.on('set_project_video_response', function (msg) {
            $scope.video_loading = false;
            //Developer Testing - true;
            if (msg.success) {
                // $scope.config.videoSource = msg.result_video;
                // console.log(msg, '111');
                // $timeout(function () {
                //     $scope.video_config.sources = [
                //         { src: $sce.trustAsResourceUrl($scope.config.videoSource), type: "video/mp4" }
                //     ];
                // }, 0);
            }
        });

        // socket.removeListener('set_crop_video_response');
        socket.on('set_crop_video_response', function (msg) {
            // console.log('Data -1212123');
            //Developer Testing - true;
            // console.log(msg, '--Sam');
            if (msg.success) {
                $scope.config.videoSource = msg.result_video;
                $scope.download = msg.result_video;
                $scope.main_item.representative = $scope.config.videoSource;
                $scope.config.isCropping = false;
                // console.log(msg);
                // $timeout(function(){
                //     $scope.video_config.sources = [
                //         {src: $sce.trustAsResourceUrl($scope.config.videoSource), type: "video/mp4"}
                //     ];
                // }, 0);
                $scope.video_loading = false;
                $scope.reposition = false;
            }
            else {
                FlashService.Error('Cannot make video with your crop area, don\'t trifle!');
            }
        });

        socket.removeListener('set_project_video_inprogress');
        socket.on('set_project_video_inprogress', function (msg) {
            $scope.loadingData = '';
            $scope.video_loading = true;
            // console.log(msg.progress);
            $scope.progress_percent = msg.percent + '%';
            // $scope.progress_text = msg.text;
            
            // debugger;
        });

        $scope.checkIfMainItem = function(medium) {
                // console.log($scope.main_item.id, 'Test', medium.id);
            return parseInt($scope.main_item.id) == parseInt(medium.id);
        }

        $scope.replace_project_video = function () {
            if ($scope.config.isCropping)
                return;
            var spec_array = [];
            
            var playgroundRect = document.getElementById("text-editor-playground").getBoundingClientRect();
            // console.log(playgroundRect, 'CHange Spec Array');

            var getOverlayDataAsPngFormat = function(textOverlay) {
                var overlay = document.getElementById("text_overlay_" + textOverlay.id);
                var d = $q.defer();
                domtoimage.toPng (overlay.getElementsByClassName('angular-meditor-content')[0])
                    .then(function (dataUrl) {
                        // console.log(dataUrl);
                        d.resolve({
                            content: dataUrl,
                            left: Math.floor(textOverlay.o_left),
                            top: Math.floor(textOverlay.o_top),
                            newLeft: Math.floor(textOverlay.newLeft),
                            newTop: Math.floor(textOverlay.newTop),
                            degree: textOverlay.o_degree,
                            start: stopWatchStringToSeconds(textOverlay.time_range.startTime),
                            end: stopWatchStringToSeconds(textOverlay.time_range.endTime)
                        });
                    })
                    .catch(function (error) {
                        // console.error('oops, something went wrong!', error);
                        d.reject('Greeting ' + name + ' is not allowed.');
                    });
                return d.promise;
            }

            var getSpecArray = function(medium) {
                var overlay_array = [];
                var d = $q.defer();

                angular.forEach(medium.texts, function(textOverlay) {
                    this.push(getOverlayDataAsPngFormat(textOverlay));
                }, overlay_array);

                $q.all(overlay_array).then(function(pngData) {
                    d.resolve({ 
                      id: medium.id, 
                      start: medium.slider.min, 
                      end: medium.slider.max, 
                      pngData: pngData
                    });
                }, function(reason) {
                    d.reject(reason);
                });
                return d.promise;
            }

            var spec_function_array = [];

            angular.forEach($scope.media, function (medium) {
                this.push(getSpecArray(medium));
            }, spec_function_array);

            $q.all(spec_function_array).then(function(spec_array) {
                // console.log(playgroundRect, spec_array, 'CHange Spec Array');
                // debugger;
                socket.emit('set_project_video', {
                    'spec_array': spec_array,
                    'playground': {
                        width: playgroundRect.width,
                        height: playgroundRect.height,
                        left: playgroundRect.left,
                        top: playgroundRect.top
                    },
                    'project_id': $stateParams.id,
                    'token': token
                });
                
            }, function(reason) {
                console.error(reason);
            });
        }

        socket.on('project_data_response_update1', function (msg) {
            
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
                
                $scope.media = msg.media_files.filter(function (obj) {
                    return !(obj.deleted == 1);
                });

                angular.forEach($scope.media, function (medium) {
                    smartTextTimes(medium);
                });
                // console.log('22222222');
            }
        });

        socket.removeListener('consoleData');
        socket.on('consoleData', function(data) {
            // console.log(data);
        }) 

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

            $rootScope.isBared = true;
            $scope.$watch('media.length', function () {
                if ($scope.media == undefined || $scope.media.length > 0) {
                    $scope.showProjects = true;
                } else {
                    $scope.showProjects = false;
                }
            });

            socket.emit('project_data', {
                'project_id': $stateParams.id,
                'is_need_text_overlay': true,
                'token': token
            });
            socket.removeListener('project_data_response');
            socket.on('project_data_response', function (msg) {
                // console.log('project response: ' + JSON.stringify(msg.media_files));
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
                    $scope.config.ratio = msg.project_data.ratio;
                    setAspectRatio(msg.project_data.ratio);

                    // $scope.config.videoSource = msg.project_data.result_video;
                    // $scope.video_config = {
                    //    sources: [
                    //        {src: $sce.trustAsResourceUrl($scope.config.videoSource), type: "video/mp4"}
                    //    ],
                    //    theme: "components/videogular-themes-default/videogular.css"
                    // };

                    $scope.media = msg.media_files.filter(function (obj) {
                        return !(obj.deleted == 1);
                    });

                    if (!$scope.main_item.id) {
                        $scope.main_item.id = $scope.media[0].id;
                    }
                    // console.log($scope.media);
                    angular.forEach($scope.media, function (medium) {
                        // console.log(medium.duration);
                        // $scope.total_time += medium.duration;
                        if (isVideo(medium.path)) {
                            // console.log(medium.path);
                            var videoRepresentative = medium.path;
                            // medium.representative ? medium.representative : medium.path;
                            var video = document.createElement('video');
                            video.preload = 'metadata';
                            // socket.emit('get_video_duration', videoRepresentative);
                            // socket.on('set_video_duration', function(duration){
                            
                            var mediumData = filterJSON('media_files', medium.id);
                            // console.log(mediumData, 'var Data');
                            mediumData.seekTime = mediumData.seekTime != null?mediumData.seekTime:0
                            // console.log(duration);
                            var durationVideo = mediumData.durationVideo;
                            medium.durationVideo = mediumData.durationVideo;

                            medium.slider = {
                                min: mediumData.seekTime,
                                max: mediumData.duration,
                                options: {
                                    floor: 0,
                                    ceil: mediumData.durationVideo,
                                    step: 1
                                }
                            };
                            

                            if (medium.id == $scope.main_item.id) {
                                $scope.setMainItemAs(medium);
                            }
                            // });
                            video.src = videoRepresentative;
                           
                        }
                        else {
                            var mediumData = filterJSON('media_files', medium.id);

                            var range = (medium.range) ? medium.range.split(',') : [1, 3];
                            medium.slider = {
                                value: mediumData.durationImage,
                                options: {
                                    floor: 1,
                                    ceil: 30,
                                    step: 1
                                }
                            };

                            if (medium.id == $scope.main_item.id) {
                                $scope.setMainItemAs(medium);
                            }
                        }
                        
                        smartTextTimes(medium);
                        // console.log('1111111111');
                    });
                    $scope.$apply();
                }
            });
        }

        $scope.onPlayerReady = function ($API) {
            $scope.$API = $API;
            console.log('Testttt')
            $scope.$API.seekTime($scope.minRangeSlider.min, false);
        };

        $scope.onUpdateState = function (state) {
            console.log(state);
            $scope.state = state;
        };

        $scope.vgUpdateState = function (state) {
            if (state == 'play') {
                $scope.config.isCropping = false;
            }
        }

        $scope.vgChangeSource = function (source) {
            // $scope.video_config.sources = source;
            // console.log(source);
        }

        $scope.vgUpdateTime = function (currentTime, totalTime) {
            $scope.currentTime = currentTime;
        }

        // $scope.vgSeeking = function(currentTime, totalTime) {
        //     $scope.seeked.Temp = currentTime;
        //     $scope.seeked.duration = duration;
        // }

        // $scope.vgSeeked = function(currentTime, totalTime) {
        //     $scope.seeked.Temp = currentTime;
        //     $scope.seeked.duration = duration;
        // }

        $scope.vgCanPlay = function () {
            $scope.config.isLoadedVideo = true;
        }
   
        $scope.cancel = function () {
            $scope.reposition = false;
            $scope.player = false;
            // $scope.cropImage.destroy();
            if ($scope.config.isCropping)
                $scope.config.isCropping = false;
        }

        $scope.preview = function () {
            if($scope.durationTotal > $scope.time_limit_per_video_in_seconds && $scope.is_admin == false) {    
                alert('Time duration of video exceeds the allowable limit for your current plan. Please upgrade to create longer videos.');
                return;
            }

            // $scope.textEditor.updateTextOverlay(item);
            var cropViewPortRect = {top: 243.5, right: 869, left: 469, bottom: 468, width:223, height: 399}
            var crImage = {
                width: 400,
                height: 400
            }; 
            // var playgroundRect = {top: 156, right: 1025, left: 314, bottom: 556, width:711, height: 400}

            var media_files = JSON.parse(localStorage.getItem('media_files'));

            var data = {
                ratio : $scope.config.ratio,
                project_id : $stateParams.id,
                media_files : media_files,
                cropViewPortRect : cropViewPortRect,
                crImage : crImage,
                // playground : playgroundRect,
                token : token
            }
            $scope.loadingData = '';
            $scope.video_loading = true;
            socket.emit('video_preview', data);
            $scope.player = true;
        }

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
        if ($scope.main_item.seekTime !== undefined){
            $scope.minRangeSlider = {
                min: $scope.main_item.seekTime,
                max: $scope.main_item.duration,
                options: {
                    floor: 0,
                    ceil: 100,
                    step: 0.1,
                    precision: 1,
                    minRange: 1,
                    pushRange: true,
                    noSwitching: true,
                    translate: function (value) {
                        return value + ' Lakhs';
                    }
                }
            };

        }

        var shareWindow = function (share) {
            
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
                            media: ($scope.result_video ? $scope.result_video : ($scope.media[0] ? $scope.media[0].path : null)),
                            share: share,
                            user: $scope.$parent.user
                        };
                    }
                }
            });

            modalInstance.result.then(function (item) {
                // console.log(item);
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

        // $scope.video_loading = true;
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
        
        $scope.minRangeSlider = {
            min: $scope.main_item.seekTime,
            max: $scope.main_item.duration,
            options: {
                floor: 0,
                ceil: 100,
                step: 0.1,
                precision: 1,
                minRange: 1,
                pushRange: true,
                noSwitching: true,
                translate: function (value) {
                    return timeFormat(value);
                }
            }
        };

        $scope.$watch('minRangeSlider.min', function (newval, oldval) {
            if (newval === oldval) {
                // $(".controls-container span.rz-vislow").hide();
                // $(".controls-container span.rz-vishigh").hide();
                $scope.minRangeSlider.min = $scope.main_item.seekTime;
                return;
            }

            // $(".controls-container span.rz-vislow").addClass("rz-active");
            // $(".controls-container span.rz-vishigh").hide();

            if(isVideo($scope.main_item.path)) {
                
                if($scope.$API != null) {
                    $scope.$API.seekTime(newval, false);    
                }
                
                $scope.minRangeSlider.min = Number(newval);
                updateItem('media_files', $scope.main_item.id, 'seekTime', newval);
               
                var durationItem = JSON.parse(getObject('media_files'));
                $scope.durationTotal = 0;
                durationItem.forEach(function(element) {
                    if(isImage(element.path)) {
                        $scope.durationTotal += element.durationImage;
                    } else {
                        // if ($scope.main_item.seekTime == 0) {
                        //     $(".controls-container span.rz-vislow").hide();
                        // }
                        if(typeof element.seekTime == 'undefined') {
                            // console.log(element.seekTime, '11111');
                            $scope.durationTotal += element.duration;
                        } else {
                            $scope.durationTotal += element.duration;
                            $scope.durationTotal -= element.seekTime;
                        }
                        
                    }
                }, this);
                $scope.totalTimeDuration = timeFormat($scope.durationTotal);// $scope.durationTotal.toFixed(2).toString().replace('.', ':');
                
                
            } else {
                return;
            }
            
        });

        $scope.$watch('minRangeSlider.max', function (newval, oldval) {
            if (newval === oldval) {
                // $(".controls-container span.rz-vislow").hide();
                // $(".controls-container span.rz-vishigh").hide();    
                return;
            } 
            $scope.minRangeSlider.max = Number(newval);

            // $(".controls-container span.rz-vislow").hide();
            // $(".controls-container span.rz-vishigh").show();

            
            // updateItem('media_files', $scope.main_item.id, 'durationVideo', newval);
            var durationItem = JSON.parse(getObject('media_files'));
            $scope.durationTotal = 0;
            durationItem.forEach(function(element) {
                if(isImage(element.path)) {
                    $scope.durationTotal += element.durationImage;
                } else {
                    // if (newval == $scope.main_item.duration) {
                    //     $(".controls-container span.rz-vishigh").hide();
                    // }
                    if(typeof element.seekTime == 'undefined') {
                        // console.log(element.seekTime, '11111');
                        $scope.durationTotal += element.duration;
                    } else {
                        $scope.durationTotal += element.duration;
                        $scope.durationTotal -= element.seekTime;
                    }
                    
                }
            }, this);
            $scope.totalTimeDuration = timeFormat($scope.durationTotal);// $scope.durationTotal.toFixed(2).toString().replace('.', ':'); 
            updateItem('media_files', $scope.main_item.id, 'duration', newval);
        });

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

        $scope.completed = function () {
            if ($scope.config.isCropping) {
                
                $scope.config.isCropping = false;
            }    
            else
                $state.go('project.edit', { id: $scope.project_id });
            
        }

        
        
        $scope.startCrop = function (noPause) {
            $scope.video_loading = true;
            $scope.reposition = true;
            // console.log($scope.cropImage, 'CropImage');
            if(typeof $scope.cropImage != 'undefined') {
                $scope.cropImage.destroy();
            }
            
            // need to show original path instead of representative video
            if (!noPause && $scope.$API)
                $scope.$API.pause();

            var filepath = $scope.main_item.path;
            // $scope.main_item.representative ? $scope.main_item.representative : $scope.main_item.path;
            // console.log($scope.main_item);
            socket.emit('get_current_image', {
                currentTime: $scope.currentTime,
                path: filepath,
                // path: $scope.main_item.path,
                token: token
            });

        }

        // $scope.downloadVideo = function() {
        //     console.log($scope.download);
        //     socket.emit('set_request_download', {
        //         path: $scope.download
        //     });
        // }   

        function downloadPath(path) {
            $scope.download = path;
        }

        var cropedImage = jQuery("#cropedImage");
        var zoomRate = 1.1;
        $scope.zoomIn = function () {
            $scope.config.currentZoom = parseInt($scope.config.currentZoom / zoomRate);
            if ($scope.config.currentZoom > 95 && $scope.config.currentZoom < 105)
                $scope.config.currentZoom = 100;
            document.getElementById('video-canvas').style.zoom = $scope.config.currentZoom / 100;
        }
        $scope.zoomOut = function () {
            $scope.config.currentZoom = parseInt($scope.config.currentZoom * zoomRate);
            if ($scope.config.currentZoom > 95 && $scope.config.currentZoom < 105)
                $scope.config.currentZoom = 100;
            document.getElementById('video-canvas').style.zoom = $scope.config.currentZoom / 100;
        }


        $scope.cropVideo = function () {
            $scope.loadingData = '';
            $scope.reposition = true;
            $scope.video_loading = true;
            
            var cropData = $scope.cropImage.get();
            
            if (!$scope.config.isCropping) {
                return;
            }

            var cropViewPortRect = document.getElementsByClassName("cr-viewport")[0].getBoundingClientRect();
            var crImage = {
                width: $('.cr-image')[0].width,
                height: $('.cr-image')[0].height
            };
           
            var videoSourcePath = $scope.config.videoSource;
            var data = {
                media_spec: { id: $scope.main_item.id, start: $scope.minRangeSlider.min, end: $scope.minRangeSlider.max },
                crop_ratio: $scope.config.ratio,
                path: videoSourcePath,
                startX: cropData.points[0],
                startY: cropData.points[1],
                endX: cropData.points[2],
                endY: cropData.points[3],
                token: token,
                // pngData: pngData,
                viewport: {
                    width: Math.floor(cropViewPortRect.width),
                    height: Math.floor(cropViewPortRect.height)
                },
                crImage: crImage
            };

            
            socket.emit('crop_video', data);
        }

        // socket.removeListener('videoCroped');
        socket.on('videoCroped', function(msg) {
            
            $scope.main_item.pathAspect = msg.newPath;
            // console.log($scope.main_item.pathAspect);
            $scope.reposition = false;
            $scope.config.isCropping = false;
            $scope.video_loading = false;
            $scope.video_config.sources = [
                { src: $sce.trustAsResourceUrl(msg.newPath), type: "video/mp4" }
            ];
            
            switch($scope.config.ratio) {

                case '169': updateItem('media_files', $scope.main_item.id, 'ratio169', msg.newPath);
                            // $scope.onPlayerReady($API);
                            /* $timeout(function () {
                                console.log('123');
                                $scope.setAspectRatio('169');
                            }, 300); */
                            break;

                case '11': updateItem('media_files', $scope.main_item.id, 'ratio11', msg.newPath);
                            // $scope.onPlayerReady($API);
                            /* $timeout(function () {
                                console.log('123');
                                $scope.setAspectRatio('11');
                            }, 300); */
                            break;

                case '916': updateItem('media_files', $scope.main_item.id, 'ratio916', msg.newPath);
                            // $scope.onPlayerReady($API);
                           /*  $timeout(function () {
                                console.log('123');
                                $scope.setAspectRatio('916');
                            }, 300); */
                            break;
            }

            $timeout(function() {
                $window.location.reload(true);
            }, 1000);
            
        });

        $scope.testCrop = function() {
            $scope.loadingData = '';
            $scope.video_loading = true; 
            $scope.cropImage.result({type:'base64', format: 'jpeg'}).then(function(res) {

                if($scope.config.cropperOptions.aspectRatio > 1) {
                    var ratio = '169';
                } else if($scope.config.cropperOptions.aspectRatio == 1) {
                    var ratio = '11';
                } else {
                    var ratio = '916';
                }
                var data = {
                    imageBlob: res,
                    ratio: ratio,
                    media_id: $scope.main_item.id,
                    token: token
                }
                socket.emit('setcropedImage', data);
            });
        }

        socket.on('rescropedImage', function(msg) {
            if($scope.main_item.id == msg.media_id) {
                $scope.main_item.pathAspect = msg.cropImage;
                $scope.main_item['ratio'+msg.ratio] = msg.cropImage;

                updateItem('media_files', msg.media_id, 'ratio'+msg.ratio, msg.cropImage);
            }
            $scope.loading = false;
            $scope.reposition = false;
            $scope.config.isCropping = false;
            $scope.video_loading = false;
        });

        socket.on('videoPreviewError', function(msg) {
            // $scope.preview = false;
            $scope.player = false;
            $scope.video_loading = false;
            FlashService.Error(msg);
        });
        
        socket.removeListener('get_current_image_response');
        socket.on('get_current_image_response', function (msg) {
            $scope.config.isCropping = true;
            $scope.config.cropstep = 1;
            $scope.dimensions = msg.dimensions;
            $scope.video_loading = false;
            
            // console.log(msg);
            
            // $scope.element = (msg.for == 'image') ? $("#primary-image") : $("#primary-video");
            //             cropedImage.attr('src', msg.filepath)
            // if ($scope.element.height() / $scope.element.width() < msg.dimensions.height / msg.dimensions.width) {
            //     var width = msg.dimensions.width / msg.dimensions.height * $scope.element.height();
            //     var height = $scope.element.height();
            // } else {
            //     var height = msg.dimensions.height / msg.dimensions.width * $scope.element.width();
            //     var width = $scope.element.width();
            // }
            // var width = msg.dimensions.width / msg.dimensions.height * $scope.element.height();
            // var height = $scope.element.height();
            // console.log('Width: ', width);
            // console.log('Height: ', height);
            // var left = ($scope.element.width() - width) / 2;
            // var top = ($scope.element.height() - height) / 2;

            var el = document.getElementById('crop-container');
            $scope.cropImage = new Croppie(el, {
                viewport: $scope.config.cropperOptions.viewport,
                boundary: {width:711, height:400},
                showZoomer: true,
                mouseWheelZoom: true,
                enforceBoundary: false,
            // enableResize: true,
                enableOrientation: true
            });
            
            $scope.cropImage.bind({
                url: msg.filepath,
            });
            // console.log(el);
            // $("#crop-container").width(711)
            // $("#crop-container").height(400)
            // $("#crop-container").css('left', left + "px")
            // $("#crop-container").css('top', top + "px")

            // var el = document.getElementById('crop-container');
            // $scope.cropImage = new Croppie(el, {
            //     viewport: {
            //         width: width,
            //         height: height
            //     },
            //     boundary: {
            //         width: 711, height: 400
            //     }
            // });
            
            // $scope.cropImage.bind({
            //     url: msg.filepath,
            // });

            // $scope.config.croppieOptions.url = msg.filepath;
            // $scope.config.croppieOptions.viewport = $scope.getViewportSize(width, height);
            // $scope.config.croppieOptions.boundary = $scope.getViewportSize(100, 100);
            // $scope.config.croppieOptions.viewport = { width: 200, height: 200 };
            // $scope.config.croppieOptions.boundary = { width: 300, height: 300 };

            //             $scope.config.croppieOptions.boundary = {
            //                 width: $("#primary-video").width(),
            //                 height: $("#primary-video").height(),
            //             };
            // $("#crop-container").croppie('result');
            // $("#crop-container").croppie('destroy').croppie($scope.config.croppieOptions);
                // $("#crop-container").croppie('destroy');
                
            //             cropedImage.cropper('destroy').cropper($scope.config.cropperOptions)

            //            
            //            var canvas = document.getElementById('canvas');
            //            
            //            var ctx = canvas.getContext('2d');
            //            var videogular = document.getElementById('primary-video');
            //            ctx.drawImage(videogular.getElementsByTagName('video')[0], 0, 0, canvas.width, canvas.height);

            //            videogular.getElementsByTagName('video')[0].addEventListener('play', function() {
            //                var $this = this; //cache
            //                (function loop() {
            //                    if (!$this.paused && !$this.ended) {
            //                        ctx.drawImage($this, 0, 0, canvas.width, canvas.height);
            //                        setTimeout(loop, 1000 / 24); // drawing at 30fps
            //                    }
            //                })();
            //            }, 0);
        });
        

        $scope.getViewportSize = function (width, height) {
            var w, h;
            if (width / height > $scope.config.cropperOptions.aspectRatio) {
                h = height;
                w = h * $scope.config.cropperOptions.aspectRatio;
            }
            else {
                w = width;
                h = w / $scope.config.cropperOptions.aspectRatio;
            }

            return { width: w, height: h };
        }

        var setAspectRatio = function (ratio) {
            $scope.config.ratio = ratio;
            var dataRatio = {
                aspectRatio: ratio, project_id: Number($scope.project_id)
            }
            
            switch (ratio) {
                
                case '169': 
                    updateAllItem('media_files', 'crop_ratio', '169');
                    var item_data = filterJSON('media_files', $scope.main_item.id);
                    $scope.main_item.pathAspect = '';
                    if(item_data.ratio169 == null || typeof item_data.ratio169 == 'undefined') {  
                        $scope.main_item.pathAspect = item_data.path;
                    } else {
                        $scope.main_item.pathAspect = item_data.ratio169;
                    }

                    $scope.video_config.sources = [
                        { src: $sce.trustAsResourceUrl($scope.main_item.pathAspect), type: "video/mp4" }
                    ];
                    
                    socket.emit('update_aspect_ratio', dataRatio);
                    $scope.config.cropperOptions.viewport = {width: 710, height: 400};
                    $scope.config.cropperOptions.boundary = {width: 711, height: 400};
                    $scope.config.cropperOptions.aspectRatio = 16 / 9;
                    $scope.config.height = '100%';
                    $scope.config.width = '100%';
                    $scope.config.top= '0';
                    $scope.config.left= '0';
                    $scope.config.right= '0';
                    $scope.config.bottom= '0';
                    break;

                case '11':
                    updateAllItem('media_files', 'crop_ratio', '11');
                    var item_data = filterJSON('media_files', $scope.main_item.id);
                    $scope.main_item.pathAspect = '';
                    if(item_data.ratio11 == null || typeof item_data.ratio11 == 'undefined') {
                        $scope.main_item.pathAspect = item_data.path;
                    } else {
                        $scope.main_item.pathAspect = item_data.ratio11;
                    }
                    console.log($scope.main_item.pathAspect);
                    $scope.video_config.sources = [
                        { src: $sce.trustAsResourceUrl($scope.main_item.pathAspect), type: "video/mp4" }
                    ];
                    
                    socket.emit('update_aspect_ratio', dataRatio);
                    $scope.config.cropperOptions.viewport = {width: 400, height: 400};
                    $scope.config.cropperOptions.boundary = {width: 711, height: 400};
                    
                    $scope.config.cropperOptions.aspectRatio = 1;
                    $scope.config.height = '100%';
                    $scope.config.width = '56.25%';
                    $scope.config.top= '0';
                    $scope.config.left= '21.875%';
                    $scope.config.right= '0';
                    $scope.config.bottom= '0';
                    break;

                case '916':
                    updateAllItem('media_files', 'crop_ratio', '916');
                    var item_data = filterJSON('media_files', $scope.main_item.id);
                    $scope.main_item.pathAspect = '';
                    if(item_data.ratio916 == null || typeof item_data.ratio916 == 'undefined') {
                        $scope.main_item.pathAspect = item_data.path;
                    } else {
                        $scope.main_item.pathAspect = item_data.ratio916;
                    }
                   
                    $scope.video_config.sources = [
                        { src: $sce.trustAsResourceUrl($scope.main_item.pathAspect), type: "video/mp4" }
                    ];

                    socket.emit('update_aspect_ratio', dataRatio);
                    $scope.config.cropperOptions.viewport = {width: 224, height: 400};
                    $scope.config.cropperOptions.boundary = {width: 711, height: 400};
                    
                    $scope.config.cropperOptions.aspectRatio = 9 / 16;
                    $scope.config.height = '100%';
                    $scope.config.width = '31.6%';
                    $scope.config.top= '0';
                    $scope.config.left= '34.2%';
                    $scope.config.right= '0';
                    $scope.config.bottom= '0';
                    
                    break;
            }
        }

        $scope.setAspectRatio = function (ratio) {
            console.log('data not valid');
            setAspectRatio(ratio);
            socket.emit('set_project_ratio', {
                project_id: $scope.project_id,
                ratio: ratio,
                token: token
            });
        } 
    }

})();