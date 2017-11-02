(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('Project.ShareModalController', Controller);

    function Controller($scope, socket, $uibModalInstance, project, $timeout, $uibModal, $state, LocalStorageService, SocialConnectService) {
        $scope.project=project;
        $scope.video = {
          sources: [
            {
              src: project.media,
              type: 'video/mp4'
            }
          ]
        };
        var token = LocalStorageService.getToken();
        // console.log($scope.project);
        this.isCalenderOpen=false;
        this.isTimerOpen=false;
        $scope.currentShare = project.share;
        
        // $scope.sharedItem=(project.sharedItem)?project.sharedItem:{date:new Date(),time:new Date()};

        $scope.sharedItem = (project.sharedItem) ? project.sharedItem : { date: new Date(), time: new Date() };
        $scope.datetimeChanged = false;

        $scope.sharedItem.date = $scope.oldDate = distortToDefaultTimezone($scope.sharedItem.date);
        $scope.sharedItem.time = $scope.oldTime = distortToDefaultTimezone($scope.sharedItem.time);

        // moment(new Date()).tz(moment().tz()).format()
        
        // $scope.dateOptions = {
        //         formatYear: 'yyyy',
        //         maxDate: new Date(2020, 5, 22),
        //         minDate: new Date(),
        //         startingDay: 1
        //       };
        
        // $scope.timeOption = {
        //         hstep: [1, 2, 3],
        //         mstep: [1, 5, 10, 15, 25, 30]
        //       };

        $scope.validateData = {
          instagram:{
            characters        : 2200,
            tags              : 30,
            currentCharacters : 0,
            currentTags       : 0
          },
          twitter:{
            characters        : 140,
            currentCharacters : 0,
          }
        }

        $scope.$watch('sharedItem.date', function(newValue, oldValue) {
          if(newValue != oldValue)
            $scope.datetimeChanged = true;
        });
        
        $scope.$watch('sharedItem.time', function(newValue, oldValue) {
          if(newValue != oldValue)
            $scope.datetimeChanged = true;
        });
        
        $scope.ok = function() {   
            $uibModalInstance.close({
                item: $scope.sharedItem,
                project: $scope.project,
                datetimeChanged: $scope.datetimeChanged
            });
        };       

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.editContent = function() {
            socket.removeListener('project_data_response');
            socket.emit('project_data', {
              'project_id': $scope.project.project_id,
              'token': token
            })

            socket.on('project_data_response', function(msg) {
              if (msg.success == false) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/modals/warningModalContent.template.html',
                    controller: 'ConfirmModalController',
                    size: 'md',
                    resolve: {
                        content: function () {
                            return 'This project cannot be edited as it no longer exists and has been deleted by the user.';
                        }
                    }
                });
                
                modalInstance.result.then(function () {
                });
              }
              else {
                socket.removeListener('project_data_response');
                $uibModalInstance.dismiss('cancel');
                $state.go('project.detail', { id: $scope.project.project_id });
              }
            });
        }
               
        $scope.openCalendar = function(e) {
            $timeout(function() {
                $scope.isCalenderOpen = true;
            });
        };

        /******************************/

        /**
         * video &image checker
         */

        $scope.isImage = function (path) {
            return isImage(path);
        }

        $scope.isVideo = function (path) {
            return isVideo(path);
        }
        
        $scope.openTimer = function() {
            $timeout(function() {
                $scope.isTimerOpen = true;
            });
        };
        
        $scope.changeDesc = function (shareType){
          switch(shareType) {
            case 'facebook':  
              console.log("is facebook")
              break
            case 'instagram':  
              var desc = $scope.sharedItem.description;
              var len  = desc ? desc.length : 0;
              var tags = 0;
              
              if(desc)
              {
                var regexp = /(\s|^)\#\w\w+\b/gm;
                var result = desc.match(regexp);
                if (result) {
                    tags = result.length
                }  
              }
              $scope.validateData[shareType].currentCharacters = len
              $scope.validateData[shareType].currentTags = tags
              if(tags > $scope.validateData[shareType].tags){
                $scope.validateData[shareType].errTags = true
              }else{
                $scope.validateData[shareType].errTags = false
              }

              if(len > $scope.validateData[shareType].characters){
                $scope.validateData[shareType].errCharacters = true
              }else{
                $scope.validateData[shareType].errCharacters = false
              }
            
              break
            case 'twitter':  
              var desc = $scope.sharedItem.description;
              var len  = desc ? desc.length : 0;
              $scope.validateData[shareType].currentCharacters = len;
              // console.log("is twitter")
              break
            case 'snapchat':  
              console.log("is snapchat")
              break

        };
        
    }

    $scope.openShareModal = function(share) {
        SocialConnectService.isReadyForConnection(share, function(result) {
            if (result) {
              project.share = share;
              if(share=='pinterest')
                $scope.get_pinterest_boards();
              console.log("project.share", project.share);
              console.log("Success:", share, " logged in");
            } else {
              $uibModal.open({
                  animation: true,
                  templateUrl: 'templates/modals/' + share + 'Modal.template.html',
                  windowTemplateUrl: 'templates/modals/shareModalWindow.template.html',
                  controller: 'Project.SocialModalController'
              }).result.then(function (item) {
                console.log(item);
                  SocialConnectService.connectSocial(share).then(function() {
                      SocialConnectService.saveConfigToTeamDb();
                      project.share = share;
                      // SocialConnectService.isReady(share, function(res) {
                      //     if (res) {
                      //       project.share = share;
                      //       console.log("Success:", share, " logged in");
                      //     } else {
                      //       console.log("Error:", share, " Login failed");
                      //     }
                      // });
                  });
              }, function (){
                $scope.currentShare = project.share
                angular.element(".edit-social-share > div").blur()
              })
            }
        });
    }
    
    $scope.openShareModal(project.share);
    
    /**
     * Pinterest Board
     */
    $scope.pinterest_boards=[];
    $scope.selected_pinterest_board={};
    $scope.pinterestPopover = {
        is_open:false,
        newboard:'',
          boards: [{name:'board1',image:'/img/icons/pin-gray.png'},{name:'board2',image:'/img/icons/pin.png'}],
          templateUrl: 'pinterestPopoverTemplate.html'
        };
    $scope.get_pinterest_boards = function(){
      console.log('get pinterest board calling');

    SocialConnectService.get_pinterest_boards().then(function(result) {
      $scope.pinterest_boards=result.data;
      $scope.pinterestPopover.boards=$scope.pinterest_boards;
      // selected board
      console.log('sharedItem');
      console.log($scope.sharedItem);
      if($scope.sharedItem && $scope.sharedItem.board){
        angular.forEach($scope.pinterest_boards, function(value, key) {
          if(value.id==$scope.sharedItem.board){
            $scope.selected_pinterest_board=value;
            $scope.sharedItem.board=value.id;
            return value;
          }            
        });
      }
      else
      $scope.selected_pinterest_board=$scope.pinterest_boards[0];
      
      $scope.sharedItem.board=$scope.selected_pinterest_board.id;
    });
  }  
    
    $scope.select_pinterest_board = function(item){
      $scope.selected_pinterest_board=item;
      $scope.sharedItem.board=item.id;
      $scope.pinterestPopover.is_open=false;
    }
    
    $scope.create_pinterest_board = function(name){     
      SocialConnectService.create_pinterest_boards(name).then(function(result) {
      $scope.pinterest_boards=result.data;
      $scope.pinterestPopover.boards=$scope.pinterest_boards;
      $scope.selected_pinterest_board=$scope.pinterest_boards[0];
      $scope.pinterestPopover.newboard='';
      $scope.$apply();
    });
    }

  }
        

})();