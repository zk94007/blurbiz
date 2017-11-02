(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('IntegrationsController', IntegrationsController);

    function IntegrationsController(Facebook, $scope, $timeout, LocalStorageService,  SocialConnectService, socket, $uibModal) {
        var popupShowCount = 1;
        $scope.calcDiff = function(firstDate, secondDate){
            var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds    
            var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
            return diffDays;
        }

        var token = LocalStorageService.getToken();        
        
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
        
        var vm = this;

        vm.disconnectFromSocial = disconnectFromSocial;
        vm.connectToSocial = connectToSocial;

        vm.connectionStates = {};

        checkSocialConnection('instagram2');
        checkSocialConnection('dropbox');
        checkSocialConnection('box');
        checkSocialConnection('google_drive');

        function checkSocialConnection(social) {
            SocialConnectService.isReady(social, function(result) {
                $timeout(function(){
                    vm.connectionStates[social] = !!result;
                }, 0);
            });
        }

        function connectToSocial(social) {
            SocialConnectService.connectSocial(social).then(function() {
                SocialConnectService.saveConfigToDb();
                $timeout(function(){
                    vm.connectionStates[social] = true;
                }, 0);
            });
        }

        function disconnectFromSocial(social) {
            SocialConnectService.clearCache(social);
            SocialConnectService.saveConfigToDb();
            vm.connectionStates[social] = false;
        }

        function connectToDropbox() {
            // Dropbox.authenticate().then(
            //     function success(oauth) {
            //         if (oauth.uid) {
            //             vm.dropboxConnected = true;
            //             setServiceConnectionState('dropbox', true);
            //         } else {
            //             console.log('That\'s weird! Missing oauth token!');
            //         }
            //     }, function error(reason) {
            //         console.log(reason)
            //     });

        }


        function connectBox() {
            Box.authenticate().then(
                function success(oauth) {
                    if (oauth.accessToken) {
                        vm.boxConnected = true;
                        setServiceConnectionState('box', true);
                    } else {
                        console.error('Error! Access Token not found');
                    }
                }, function error(reason) {
                    console.error(reason)
                });
        }


        function connectToGoogleDrive() {
            var clientId = lkGoogleSettings.clientId,
                scopes = lkGoogleSettings.scopes;

            authorize();

            function authorize() {
                gapi.auth.authorize({
                    client_id: clientId,
                    scope: scopes,
                    immediate: false
                }, authorizeComplete);

                function authorizeComplete(oauth) {
                    if (oauth.status.signed_in) {
                        $scope.$apply();
                        setServiceConnectionState('google_drive', true);
                    }
                }
            }
        }


        function connectToInstagram() {
            SocialConnectService.connectSocial('instagram').then(function () {
                SocialConnectService.isReady('instagram', function (res) {
                    if (res) {
                        console.log("Success:", 'instagram', " logged in");
                        $timeout(function () {
                            setServiceConnectionState('instagram', true);
                        }, 0);
                    } else {
                        console.log("Error:", 'instagram', " Login failed");
                    }
                });
            });
        }
    }
})
();