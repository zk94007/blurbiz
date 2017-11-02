(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('ConnectionsController', ConnectionsController);

    function ConnectionsController(Facebook, $scope, $timeout, LocalStorageService,  SocialConnectService, socket) {
        var vm = this;

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

        // vm.connectToFacebook = connectToFacebook;
        // vm.checkSocialConnection = checkSocialConnection;
        vm.disconnectFromSocial = disconnectFromSocial;
        vm.connectToSocial = connectToSocial;

        vm.connectionStates = {};

        // checkSocialConnection('facebook');
        // checkSocialConnection('twitter');
        // checkSocialConnection('instagram');

        // function checkSocialConnection(social) {
        //     SocialConnectService.isReadyForTeam(social, function(result) {
        //         $timeout(function(){
        //             vm.connectionStates[social] = !!result;
        //         }, 0);
        //     });
        // }
        var socials = [
            "facebook",
            "twitter",
            "instagram",
            "snapchat", 
            "pinterest"
        ];

        socket.removeListener('get_team_social_info_response');
        socket.emit('get_team_social_info', {
            token: LocalStorageService.getToken()
        });

        socket.on('get_team_social_info_response', function(msg) {
            if (!msg.success)
            {
                console.error("team social info getting failed");
            } else {
                var config = angular.fromJson(msg.integrations_and_connections);
                angular.forEach(socials, function(social) {
                    var key = "oauthio_provider_" + social;
                    vm.connectionStates[social] = !!config[key];
                })
            }
        });

        function connectToSocial(social) {
            SocialConnectService.connectSocial(social).then(function() {
                
                vm.connectionStates[social] = true;
                SocialConnectService.saveConfigToTeamDb();

                // SocialConnectService.isReady(social, function(res) {
                //     if (res) {
                //         console.log("Success:", social, " logged in");
                //         $timeout(function(){
                //             vm.connectionStates[social] = true;
                //         }, 0);
                //     } else {
                //         console.log("Error:", social, " Login failed");
                //     }
                // });
            });
        }

        function disconnectFromSocial(social) {
            SocialConnectService.clearCache(social);
            SocialConnectService.saveConfigToTeamDb();
            if(social == 'facebook')
            {
                socket.emit('set_fb_pages', {
                    id: "",
                    token: LocalStorageService.getToken()
                });
            }
            vm.connectionStates[social] = false;
        }

    }
})();