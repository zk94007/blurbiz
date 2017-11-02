(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .factory('ShareService', function($http, $q, socket, Socialshare, LocalStorageService , SocialConnectService, $base64, $location, $filter, $timeout) {   
          var service = {
            share:shareItem,
            share_facebook:share_facebook,
            share_twitter:share_twitter,
            share_snapchat:share_snapchat,
            share_instagram:share_instagram,
            share_pinterest:share_pinterest
          }
          
          return service;
        
        function shareItem(item){
            console.log('schedule Share');
            console.log(item);
            service['share_'+item.project.share](item);
        }
        
        function shareNow(item){
            console.log('Share Now');
            item.item.date = distortToDefaultTimezone(new Date());
            item.item.time = distortToDefaultTimezone(new Date());
            console.log(item);
            service['share_'+item.project.share](item);
        }
        
        function scheduleTask(task) {
            var token = LocalStorageService.getToken();
            var date=$filter('date')(task.item.date, 'yyyy-MM-dd HH:mm');
            socket.emit('schedule_task', {
                'project_id': task.project.project_id,
                'start_date': date + ' ' + moment.tz(moment().tz()).format('ZZ'),
                'target_social_network': task.project.share,
                'title': task.title,
                'description': task.item.description,
                'token':token,
                'access_token':task.access_token,
                'oauth_token_secret': task.oauth_token_secret,
                'project_image': task.project.media,
                'isShareNow': task.shareNow,
                'board': task.item.board
            });
        }
        
        function updateTask(task){
            var token = LocalStorageService.getToken();
            var date=$filter('date')(task.item.date, 'yyyy-MM-dd HH:mm');
            socket.emit('update_task', {
                'task_id': task.item.task_id,
                'project_id': task.item.project_id,
                'start_date': date + ' ' + moment.tz(moment().tz()).format('ZZ'),
                'target_social_network': task.project.share,
                'title': task.title,
                'description': task.item.description,
                'token':token,
                'access_token':task.access_token,
                'oauth_token_secret': task.oauth_token_secret,
                'isShareNow':task.item.isShareNow,
                'project_image': task.project.media,
                'board': task.item.board
            });
        }
        
        function share_facebook(item) {
          
          var body = item.title+'\n'+item.item.description;
           console.log('facebook sharing');
           // only update , no login is required as there is no sharing required
           if(item.project.edit && new Date(item.item.date) < distortToDefaultTimezone(new Date())) {
             updateTask(item); 
             return;
           }
          
           var result = SocialConnectService.getResult("facebook");

           if (result && result.access_token) {
              item.access_token = result.access_token;
              if (!item.project.edit)
                scheduleTask(item);
              else 
                updateTask(item);
           }
                       
        }
                
        function share_twitter(item){

            var body = item.item.title+'\n'+item.item.description;
            console.log('twitter sharing');
            // only update , no login is required as there is no sharing required
            if(item.project.edit && new Date(item.item.date) < distortToDefaultTimezone(new Date())){
                updateTask(item); 
                return;
            }

            var result = SocialConnectService.getResult("twitter");

           if (result && result.oauth_token) {
              item.access_token = result.oauth_token;
              item.oauth_token_secret = result.oauth_token_secret;
              if (!item.project.edit)
                scheduleTask(item);
              else 
                updateTask(item);
           }           
           
        }

        function share_instagram(item){
          var body = item.item.title+'\n'+item.item.description;
            console.log('instagram sharing');

            
            // only update , no login is required as there is no sharing required
            if(item.project.edit && new Date(item.item.date) < distortToDefaultTimezone(new Date())){
                updateTask(item); 
                return;
            }

            var result = SocialConnectService.getResult("instagram");

           if (result && result.username) {
              item.access_token = encodeURIComponent(JSON.stringify(result));
              // item.oauth_token_secret = result.oauth_token_secret;

              if (!item.project.edit)
                scheduleTask(item);
              else 
                updateTask(item);
           }  
        }

        function share_pinterest(item){            
            // only update , no login is required as there is no sharing required
            if(item.project.edit && new Date(item.item.date) < distortToDefaultTimezone(new Date())){
                updateTask(item); 
                return;
            }

            var result = SocialConnectService.getResult("pinterest");

            if (result && result.accessToken) {
              item.access_token = result.accessToken;
              if (!item.project.edit)
                scheduleTask(item);
              else 
                updateTask(item);
            }
        }
                
        function share_snapchat(item){
            
            // only update , no login is required as there is no sharing required
            if(item.project.edit && new Date(item.item.date) < distortToDefaultTimezone(new Date())){
                updateTask(item); 
                return;
            }

            var result = SocialConnectService.getResult("snapchat");

           if (result && result.username) {
              item.access_token = encodeURIComponent(JSON.stringify(result));
              // item.oauth_token_secret = result.oauth_token_secret;

              if (!item.project.edit)
                scheduleTask(item);
              else 
                updateTask(item);
           } 
        }
        
        
        
       
    });        

})();