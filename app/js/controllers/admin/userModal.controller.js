(function () {
    'use strict';

    angular
        .module('Blurbiz.admin')
        .controller('Admin.UserModalController', Controller);

    function Controller($scope, socket, $uibModalInstance) {
      socket.removeListener('admin_create_user_res');
      socket.removeListener('admin_invite_user_res');
      socket.removeListener('get_all_teams_res');
      socket.emit('get_all_teams', $scope.newUser);
      
      $scope.newUser = {
        is_confirmed : true,
        timezone     : getLocalTimezoneName(),
      };
      
      $scope.companyList = [
      ];
      
      $scope.create = function (){
        $scope.error = ""
        socket.emit('admin_create_user', $scope.newUser);
      }
      
      $scope.sendInvite = function (){
        $scope.error = ""
        socket.emit('admin_invite_user', $scope.newUser);
      }
      
      socket.on('admin_create_user_res', function (msg) {
          if(!msg.success){
            $scope.error = msg.msg
          }else{
            $scope.newUser.created_at = msg.created_at;
            $uibModalInstance.close($scope.newUser);
          }
      })
      
      socket.on('get_all_teams_res', function (msg) {
          if(msg.success){
            $scope.companyList = msg.teams
          }else{
            console.error("Error get teams")
          }
      })


      socket.on('admin_invite_user_res', function (msg) {
          if(!msg.success){
            $scope.error = msg.msg
          }else{
            $uibModalInstance.close($scope.newUser);
          }
      })

      $scope.getCompaniesList = function(search) {
        var newCompanies = [];
        var index = 0;
        _.each($scope.companyList, function (t) {
          newCompanies[index++] = t.name;
        }).slice();
        if (search && newCompanies.indexOf(search) == -1) {
          newCompanies.unshift(search);
        }
        return newCompanies;
      }
      

    }

})();








