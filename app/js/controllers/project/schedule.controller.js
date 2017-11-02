(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('Project.ScheduleController', Controller)
        .controller('Project.confirmModalController', ConfirmModalController);    

    function Controller($scope, socket,  LocalStorageService , ShareService , $uibModal) {
        var popupShowCount = 1;
        $scope.calcDiff = function(firstDate, secondDate){
            var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds    
            var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
            return diffDays;
        }

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
        
        /* $scope.getCurrentUser = function() {            
            socket.emit('check_user_used_free_plan', {
                token: token
            });

            socket.emit('get_current_user', {
              'token': token
            });            
        };
        $scope.getCurrentUser(); */

        var token = LocalStorageService.getToken();     
        $scope.showPastPosts=false;
        $scope.post_class='';
        $scope.project_img = 'http://' + config.env.frontend + '/img/empty.png';
        $scope.sortDayData = {
          'Mon':{}, 
          'Tue':{}, 
          'Wed':{}, 
          'Thu':{}, 
          'Fri':{}, 
          'Sat':{}, 
          'Sun':{}
        };
        
        $scope.currentView = LocalStorageService.get('currentView');
        if(!$scope.currentView){
          $scope.currentView = "icons";
        }
        $scope.scheduledTasks = [];
        $scope.publishedTasks = [];
        $scope.team_users = [];
        $scope.showScheduledTasks = true;
        $scope.showPublishedTasks = true;

        socket.emit('get_same_team_members', {
            token: token
        });

        socket.on('get_same_team_members_response', function(msg) {
            if(msg.success) {
              $scope.teamMembers = msg.users;
            }
        });


        socket.emit('get_subscription_plans', {
            token: LocalStorageService.getToken()
        });

        /*socket.on('get_subscription_plans_response', function(msg) {
            console.log('Yogesh Coding CORRECT');
            if(msg.success) {
              $scope.subscriptionPlans = msg.subscription_plans;
            }
        });*/
        
        /**
         * video &image checker
         */

        $scope.isImage = function (path) {
            return isImage(path);
        }

        $scope.isVideo = function (path) {
            return isVideo(path);
        }

        $scope.isGif = function (path) {
            return isGif(path);
        }
        
        $scope.togglePastPost=function(){
            $scope.showPastPosts=!$scope.showPastPosts;
            $scope.post_class=($scope.showPastPosts)?'post-div-small':'post-div';
        }
        
        initController();

        function initController() {            
             sendTaskListMessage(token);
        }
        
       
        function sendTaskListMessage(token) {
            console.log('send task list message with token = ' + token);
            socket.on('task_list_response', function(msg) {
                console.log('received task list response: ' + JSON.stringify(msg));
                if (msg == null) {
                        console.log('ERROR: msg is null');
                        return;
                }
                if (msg.success == true) {
                        if (msg.tasks != null) {
                            if(msg.tasks == '') {
                                $scope.showTask = 0;
                            } else {
                                $scope.showTask = 1;
                                console.log('CORRECT');
                                var taskSortByDay = _.groupBy(msg.tasks, function(task){
                                  return (new moment(task.scheduled_start_date)).format("ddd")
                                });
                                var today = distortToDefaultTimezone(new Date());
                                _.range(7).forEach(function (i){
                                  var momentDay = (new moment($scope.sortDate.start)).add("day", i)
                                  var keyDay = momentDay.format("ddd")
                                  
                                  $scope.sortDayData[keyDay].isToday= false;
                                  if (momentDay.isSame(new moment(today), "days"))
                                  {
                                    $scope.sortDayData[keyDay].isToday = true;  
                                  }
                                  $scope.sortDayData[keyDay].dayText = momentDay.format("dddd DD")
                                  $scope.sortDayData[keyDay].dayShortText = momentDay.format("ddd DD")
                                  $scope.sortDayData[keyDay].dayExtraShortText = momentDay.format("dd").substring(0,1) + momentDay.format(" DD")
                                  
                                  $scope.sortDayData[keyDay].tasks = taskSortByDay[keyDay]
                                })

                                $scope.tasks = msg.tasks;

                                angular.forEach($scope.tasks, function (task) {
                                    task.fileType = getFileTypeByUrl(task.img_path);
                                });

                                $scope.scheduledTasks = getScheduledTasks($scope.tasks);
                                $scope.publishedTasks = getPublishedTasks($scope.tasks);
                            }       
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
            socket.emit('task_list', {
                'token': token
            });
        }
       
       function getFileTypeByUrl (url) {
           if (isGif(url)) {
            return 'gif';
           }
           if (isImage(url)) {
            return 'image';
           }
           else if (isVideo(url)) {
               return 'video';
           }
           else {
               return 'other';
           }
       }
        
        $scope.deleteTask = function(id) {
        
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'confirmModal.html',
                controller: 'Project.confirmModalController',
                size: 'sm',
            });
            
            modalInstance.result.then(function (confirmItem) {
              console.log("confirmItem", confirmItem)
              if(!confirmItem) return
              socket.on('delete_task_response', function(msg) {
                  console.log('received task delete response: ' + JSON.stringify(msg));
                  if (msg == null) {
                          console.log('ERROR: msg is null');
                          return;
                  }
                  if (msg.success == true) {
                      sendTaskListMessage(token);
                  }
                  if (msg.err != null && msg.err != '') {
                          console.log('ERROR: ' + err);
                          return;
                  }
              });
              socket.emit('delete_task', {
                      'task_id': id,
                      'token': token
              });
            })
        }
        socket.on('share_now_response', function(msg) {
            console.log('received task update response: ' + JSON.stringify(msg));
            if (msg == null) {
                    console.log('ERROR: msg is null');
                    return;
            }
            if (msg.success == true) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'successShare.html',
                        controller: 'Project.confirmModalController',
                        size: 'sm',
                    });             
            }
            if (msg.err != null && msg.err != '') {
                    console.log('ERROR: ' + err);
                    return;
            }
        });  
        socket.on('scheduled_share_response', function(msg) {
            console.log('received task update response: ' + JSON.stringify(msg));
            if (msg == null) {
                    console.log('ERROR: msg is null');
                    return;
            }
            if (msg.success == true) {
                sendTaskListMessage(token);
            }
            if (msg.err != null && msg.err != '') {
                    console.log('ERROR: ' + err);
                    return;
            }
        });  
        socket.on('update_task_response', function(msg) {
            console.log('received task update response: ' + JSON.stringify(msg));
            if (msg == null) {
                    console.log('ERROR: msg is null');
                    return;
            }
            if (msg.success == true) {
                sendTaskListMessage(token);
            }
            if (msg.err != null && msg.err != '') {
                    console.log('ERROR: ' + err);
                    return;
            }
        });     
        
        $scope.shareTaskNow = function(item) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'confirmShare.html',
                controller: 'Project.confirmModalController',
                size: 'sm',
            });

            modalInstance.result.then(function (confirmItem) {
                if(confirmItem){
                    var date = distortToDefaultTimezone(new Date());
                    date.setSeconds(date.getSeconds()+5);
                    
                    var sharedItem={task_id:item.id,
                            title:item.title,
                            description:item.description,
                            date:date,
                            time:date,
                            share:item.target_social_network,
                            project_id:item.project_id,
                            user_id:item.user_id,
                            isShareNow:true,
                            board:item.board,
                            dateOption: {
                                showWeeks:'false',
                            }
                        };
                    var project={project_id:item.project_id,media: item.img_path,share:sharedItem.share,edit:true,sharedItem:sharedItem};
                                 
                    ShareService.share({item:sharedItem,project:project});
                }
                        
            });         
                
        }

        $scope.changeSortDate = function (type){
          if(type == "low"){
            $scope.sortDate.end = (new moment($scope.sortDate.start)).add("day", -1).endOf('day');
            $scope.sortDate.start = (new moment($scope.sortDate.end)).add("day", -6).startOf('day');
          }else{
            $scope.sortDate.start = (new moment($scope.sortDate.end)).add("day", +1).startOf('day');
            $scope.sortDate.end = (new moment($scope.sortDate.start)).add("day", +6).endOf('day');
          }
          var today = distortToDefaultTimezone(new Date());
          _.range(7).forEach(function (i){
              var momentDay = (new moment($scope.sortDate.start)).add("day", i)
              var keyDay = momentDay.format("ddd")
              $scope.sortDayData[keyDay].isToday= false;
              if (momentDay.isSame(new moment(today), "days"))
              {
                $scope.sortDayData[keyDay].isToday = true;  
              }
              $scope.sortDayData[keyDay].dayText = momentDay.format("dddd DD")
              $scope.sortDayData[keyDay].dayShortText = momentDay.format("ddd DD")
              $scope.sortDayData[keyDay].dayExtraShortText = momentDay.format("dd").substring(0,1) + momentDay.format(" DD")
          })
        }
        
        $scope.filterByDate = function (item){

          var itemDate = new moment(distortToDefaultTimezone(new Date(item.scheduled_start_date)));
          
          if(itemDate.isBetween($scope.sortDate.start, $scope.sortDate.end)){
            return item
          }
        }
        
        $scope.sortDate = {
          start: moment().add("day", -1).startOf('week').add("day",1),
          end: moment().add("day", -1).endOf('week').add("day", 1)
        }
        
        $scope.getCalendarTextDate = function (){
          var textStart = $scope.sortDate.start.format("MMMM DD")
          var textEnd   = $scope.sortDate.end.format("MMMM DD, YYYY")
          return textStart + " - " + textEnd
        }

        $scope.getCalendarShortTextDate = function (){
          var textStart = $scope.sortDate.start.format("MMM DD")
          var textEnd   = $scope.sortDate.end.format("MMM DD, YYYY")
          return textStart + " - " + textEnd
        }
        
        $scope.changeView = function (type){
          $scope.currentView = type;
          LocalStorageService.put('currentView', type)
        }
        
        $scope.editTask = function(item) {
            // console.log(item);
            var sharedItem={
                            task_id:item.id,
                            title:item.title,
                            description:item.description,
                            date:new Date(item.scheduled_start_date),
                            time:new Date(item.scheduled_start_date),
                            share:item.target_social_network,
                            project_id:item.project_id,
                            user_id:item.user_id,
                            isShareNow:false,
                            board:item.board,
                            dateOption: {
                                showWeeks:'false'
                            } 
                        };
                // $scope.project.title = item.title;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/modals/shareModalContent.template.html',
                windowTemplateUrl: 'templates/modals/shareModalWindow.template.html',
                controller: 'Project.ShareModalController',
                resolve: {
                    project: function () {
                      return {
                        project_id:item.project_id,
                        media: item.img_path,
                        share:sharedItem.share,
                        edit:true,
                        sharedItem:sharedItem,
                        user: $scope.$parent.user
                      };
                    }
                  } 
            });

            modalInstance.result.then(function (response) {
                
                response.item.date= new Date(response.item.date).toDateString();
                response.item.time= new Date(response.item.time).toTimeString();

                var date= new Date(response.item.date + ' ' + response.item.time);
                console.log(date);
                response.item.date=date;  
                response.item.time = date;                       
                ShareService.share(response);               
            });             
    
        };        
    }
    
    function ConfirmModalController($scope, $uibModalInstance) {
        
        $scope.ok = function() {   
             $uibModalInstance.close(true);
        };       

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };        
        
    }

    function getScheduledTasks(allTasks) {
        return allTasks.filter(function (task) {
            if (task.is_finished == false) return true;
        })
    }

    function getPublishedTasks(allTasks) {
        return allTasks.filter(function (task) {
            if (task.is_finished == true) return true;
        })
    }


})();