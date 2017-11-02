(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('Project.youtubeClipperModalController', Controller);

    function Controller($scope, $uibModalInstance, $window, url, trustUrlFilter) {
        $scope.url = url;
        
        if (url.type == 'youtube')
        {
            $scope.options = { 
                "techOrder": ["youtube", "html5"], 
                "sources": [{ 
                    "type": "video/youtube", 
                    "src": url.path
                }] 
            };
        }
        else 
        {
            $scope.options = {
                "sources": [{
                    "src": url.path
                }]
            };
        }

        $scope.isImage = function (path) {
            return isImage(path);
        }

        $scope.isVideo = function (path) {
            return isVideo(path);
        }

        $scope.ok = function() {
            $uibModalInstance.close();
        }

        // var tag = document.createElement('script');
        // tag.src = "https://www.youtube.com/iframe_api";
        // var firstScriptTag = document.getElementsByTagName('script')[0];
        // firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // $window.onYouTubeIframeAPIReady = function() {
        //     $scope.player = new YT.Player('youtube-player', {
        //       height: '180',
        //       width: '180',
        //       events: {
        //         'onReady': onPlayerReady,
        //         'onStateChange': onPlayerStateChange
        //       },
        //       playerVars: { 
        //         'controls': 0,
        //         'showinfo': 0
        //       }
        //     });
        // }

        // // The API will call this function when the video player is ready.
        // function onPlayerReady(event) {
        //     $scope.player.loadVideoById({mediaContentUrl:'chElHV99xak',
        //                startSeconds:53,
        //                endSeconds:59});
        // }

        // function onPlayerStateChange(event) {

        // }

    }

})();