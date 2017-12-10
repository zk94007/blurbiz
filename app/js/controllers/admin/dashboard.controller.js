(function () {
    'use strict';

    angular
        .module('Blurbiz.admin')
        .controller('Admin.DashboardController', Controller);

    function Controller($scope, socket, $uibModal, LocalStorageService, FlashService) {

        socket.on('set_connection_in_team_response', function(msg) {
            if (msg) {
                setSocialStatusInViewModel(msg.teamId, msg.social, msg.status)

                socket.emit('get_current_user', {
                    'token': LocalStorageService.getToken()
                });
            }

            function setSocialStatusInViewModel(teamId, social, status) {
                angular.forEach($scope.teams, function (team) {
                    if (team.id == teamId) {
                        angular.forEach(team.social_items, function (social_item) {
                            if (social_item.name == social) {
                                social_item.status = status;
                            }
                        })
                    }
                })
            }
        });

        $scope.teams = [];

        socket.emit('get_teams', {
            token: LocalStorageService.getToken()
        });

        socket.on('get_teams_response', function(teams) {
            // console.log('GET_TEAMS_RESPONSE: ', teams);
            //$scope.teams = msg;

            var newTeams = {};
            _.each(teams, function (t) {
                if (!newTeams[t.id]) {
                    // console.log(t);
                    newTeams[t.id] = {
                        id: t.id,
                        name: t.name,
                        members: [],
                        plan_id: t.plan_id,
                        plan_selection: t.monthly_plan,
                        social_items: [
                            {
                                name: 'snapchat',
                                status: t.snapchat
                            },
                            {
                                name: 'facebook',
                                status: t.facebook
                            },
                            {
                                name: 'twitter',
                                status: t.twitter
                            },
                            {
                                name: 'instagram',
                                status: t.instagram
                            },
                            {
                                name: 'pinterest',
                                status: t.pinterest
                            }
                        ]
                    }
                }
                if(t.member_email)
                {
                    newTeams[t.id].members.push({
                        photo: t.member_photo,
                        name: t.member_name,
                        email: t.member_email,
                        created_at: t.member_created_at,
                        last_seen: t.member_last_seen,
                        is_enabled: t.member_is_enabled,
                        member_id: t.member_id
                    });
                }
            });
            $scope.teams = _.values(newTeams);
            console.log($scope.teams);
        });

        socket.on('update_team_plan_response', function(msg) {
            if(!msg.success){
                FlashService.Error('Error happened while update team plan.');
            }else{
                FlashService.Success(msg.name +' Team plan updated.');
            }
        })

        $scope.planUpdate = function (teamId, plan_selected) {
            // console.log(teamId, plan_selected);
            socket.emit('update_team_plan', { 'teamId': teamId, 'plan_selected': plan_selected, 'token': LocalStorageService.getToken() });
        }

        $scope.setConnectionInTeam = function (teamId, social, status) {
            socket.emit('set_connection_in_team', {
                'teamId': teamId,
                'social': social,
                'status': status,
                'token': LocalStorageService.getToken()
            });
        };

        socket.emit('get_subscription_plans', {
            token: LocalStorageService.getToken()
        });

        // socket.removeListener('get_subscription_plans_response');
        socket.on('get_subscription_plans_response', function (msg) {
            if (msg.success) {
                $scope.plan_options = [
                    { id: 1, plan_id: 0, plan_name: 'Free' }
                ];
                msg.subscription_plans.forEach(function(plans) {
                    if(plans.plan_name == 'Free Trial') {
                        $scope.plan_options.push({ id: plans.id, plan_id: plans.id, plan_name: 'Free ' + plans.number_of_days_free_trial +' Day Trial' })
                    } else {
                        $scope.plan_options.push({ id: plans.id, plan_id: plans.id, plan_name: plans.plan_name+' Plan' })
                    }
                }, this);
            }
        });

        socket.on('payment_method_not_add', function (msg) {
            if(msg.success) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'templates/modals/confirmModal.html',
                    controller: 'ConfirmModalController',
                    size: 'sm',
                    resolve: {
                        content: function () {
                            return msg.msg;
                        }
                    }
                });
                return modalInstance.result;
            }
        });

        $scope.is_enabled_options = [
            {label: 'Enable User', value: 1},
            {label: 'Disable User', value: 2},
            {label: 'Remove User', value: 3}
        ];

        $scope.ago = function(timestamp) {
            if (timestamp == undefined)
                timestamp = '';
            return moment(timestamp).fromNow() == "Invalid date" ? "Not yet" : moment(timestamp).fromNow();
        }

        $scope.onPermanentlyDeleteAccount = function (teamId) {
            showConfirmDialog("Are you sure you want to Permanently Delete the account all users and assets will removed?")
                .then(function(){
                    PermanentlyDeleteAccount(teamId);
                });
        };

        socket.on('delete_team_response', function (msg) {
            console.log('delete_team_response: ' + JSON.stringify(msg));
            if (msg == null) {
                console.log('ERROR: msg is null');
                FlashService.Error('Error happened while delete_team');
                return;
            }

            if (msg.success == false) {
                console.log('ERROR: expected answer - { success: true }, err: ' + msg.msg);
                $scope.message = {
                    error: msg.msg,
                    success: false
                };
                FlashService.Error('Error happened while delete team');
            } else {
                var deletedTeam = $scope.teams.filter(function(obj) {
                    return obj.id == msg.team_id;
                })[0];

                FlashService.Success(deletedTeam.name + ' team deleted.');
                console.log('CORRECT');
                $scope.teams = $scope.teams.filter(function(obj) {
                    return obj.id != msg.team_id;
                });
            }
        });

        function PermanentlyDeleteAccount(teamId) {
            socket.emit('delete_team', {
                token: LocalStorageService.getToken(),
                teamId: teamId
            });            
        }

        function showConfirmDialog(msg) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'templates/modals/confirmDeleteModal.html',
                controller: 'ConfirmModalController',
                size: 'sm',
                resolve: {
                    content: function () {
                        return msg
                    }
                }
            });
            return modalInstance.result;
        }
        
        $scope.openNewUserModal = function (share) {
          $uibModal.open({
              animation: true,
              templateUrl: 'templates/modals/userModal.template.html',
              windowTemplateUrl: 'templates/modals/userModalWindow.template.html',
              controller: 'Admin.UserModalController'
          }).result.then(function (user) {
            console.log("Success create ", user);
            var team_of_new_user = $scope.teams.filter(function(obj) {
                return obj.name == user.company
            })[0];

            $scope.teams[$scope.teams.indexOf(team_of_new_user)].members.push({
                member_id: user.id,
                name: user.name,
                email: user.email,
                is_enabled: 1,
                created_at: user.created_at // fake to avoid complexity
            });
          });
        }

        $scope.openInviteUserModal = function (share) {
          $uibModal.open({
              animation: true,
              templateUrl: 'templates/modals/inviteUserModal.template.html',
              windowTemplateUrl: 'templates/modals/userModalWindow.template.html',
              controller: 'Admin.UserModalController'
          }).result.then(function (user) {
            console.log("Success create ", user)
          })
        }

        socket.on('delete_user_response', function(msg) {
            if(!msg.success){
                FlashService.Error('Error happened while delete user.');
            }else{
                FlashService.Success('Remove user succeed.');
                var team_of_removed_user = $scope.teams.filter(function(obj) {
                    return obj.id == msg.teamId;
                })[0];
                $scope.teams[$scope.teams.indexOf(team_of_removed_user)].members = $scope.teams[$scope.teams.indexOf(team_of_removed_user)].members.filter(function(obj) {
                    return obj.member_id != msg.userId;
                });
            }
        });

        $scope.updateUserEnableInfo = function(member) {
            console.log('updateUserEnableInfo', member);

            if (member.is_enabled === 3) {

                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/modals/confirmDeleteModal.html',
                    controller: 'ConfirmModalController',
                    size: 'sm',
                    resolve: {
                        content: function() {
                            return 'Are you sure you want to delete this user from team?';
                        }
                    }
                });

                modalInstance.result.then(function(confirmItem) {
                    console.log('MODAL_RESULT', arguments);
                    if (confirmItem) {

                        socket.emit('delete_user', {
                            token: LocalStorageService.getToken(),
                            user_id: member.member_id
                        });

                    }
                }, function(dismissItem) {
                    member.is_enabled = null;
                });

            } else {
                socket.emit('update_user', {
                    'user_id': member.member_id,
                    'fields': {
                        'is_enabled': member.is_enabled
                    },
                    'token': LocalStorageService.getToken()
                });
            }
        };

        // Edit Plan Data
        $scope.editPlan = function(planData) {            
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'updatePlanModal.html',
                controller: 'Admin.planModalController',
                resolve: {
                    plan: function () {
                        return planData
                    }
                }
            });
        };        
    }

})();
