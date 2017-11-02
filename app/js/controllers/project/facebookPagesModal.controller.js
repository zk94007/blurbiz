(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('Project.facebookPagesModalController', Controller);

    function Controller($scope, $uibModalInstance, $timeout, socket, SocialConnectService, LocalStorageService) {
        
        // $scope.pages = [{
        //     title: "Ttile",
        //     description: "Description",
        //     img: "/img/avatar.jpg"
        // }]

        $scope.pages = [];

        $scope.profile = null;

        $scope.waitImg = config.image.waitForAdd;

        // $scope.facebook_option = "profile";

        // $scope.$watch("facebook_option", function(newVal, oldVal) {
        //   if (newVal == "profile")
        //   {
        //     $scope.pages.forEach(function (page){
        //       page.selected = false
        //     });
        //   }
        // });

        var result = SocialConnectService.getResult("facebook");

        if (result && result.access_token) {
          socket.emit('get_facebook_pages', {
            token: LocalStorageService.getToken(),
            access_token: result.access_token
          });  

          socket.emit('get_profile_info', {
            token: LocalStorageService.getToken(),
            access_token: result.access_token
          });
        }

        socket.on('get_facebook_pages_response', function(res) {
          
          if(!res.error)
          {
            $scope.pages = res.data;
            $scope.pages.forEach(function (page){
              page.selected = false
            });
          }
        });

        socket.on('get_profile_info_response', function(res) {
          if(!res.error)
          {
            $scope.profile = res.data;
            $scope.profile.selected = true;
          }
        });
        
        
        $scope.connect = function() {
            var selectedPage = _.find($scope.pages, function (page){
              if(page.selected){return page}
            });
            if($scope.profile.selected == true) {
              
              $uibModalInstance.close("me," + result.access_token);
            }
            else if(selectedPage){
              
              $uibModalInstance.close(selectedPage.id + "," + selectedPage.access_token);
            }
        };       

        $scope.selectPage = function(selectedPage) {
          $scope.pages.forEach(function (page){
            page.selected = false
          });
          $scope.profile.selected = false;
          selectedPage.selected = true   
        };       

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
               
    }

})();