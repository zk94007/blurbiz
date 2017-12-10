/**
 * Master Controller
 */

angular.module('Blurbiz')
  .controller('AuthController', ['$scope', '$state', '$cookies', 'LocalStorageService', 'socket', AuthController]);

function AuthController($scope, $state, $cookies, LocalStorageService, socket, $stateParams) {

  var invite_id = $state.params.idInvite

  $scope.message = {};
  initController();

  function initController() {
    LocalStorageService.delete('jwtToken');
    LocalStorageService.delete('is_confirmed');    
  }

  $scope.login = function () {
    socket.emit('authenticate', {
      'login': $scope.email,
      'password': $scope.password,
    });
  };

  $scope.backToLogin = function() {
    $state.go('login');
  }

  socket.on('authenticate_response', function (msg) {
    //
    console.log('authenticate response: ' + JSON.stringify(msg));
    if (msg.success == false) {
      $scope.message = {
        error: msg.msg,
        success: false
      };
      return;
    }
    if (msg == null) {
      console.log('ERROR: msg is null');
      return;
    }
    if (msg.success == true && msg.token != null) {
      console.log('CORRECT');
      LocalStorageService.saveToken(msg.token);
      LocalStorageService.put('is_confirmed', msg.is_confirmed);
      $state.go('project.index');
      return;
    }
    if (msg.success == true && msg.token == null) {
      console.log('ERROR: token is null');
      return;
    }
    if (msg.err != null && msg.err != '') {
      console.log('ERROR: ' + err);
    }
  });
  
  $scope.signup = function () {
    socket.emit('signup', {
      'password': $scope.password,
      'name': $scope.name,
      'company': $scope.company,
      'email': $scope.email,
      'timezone': getLocalTimezoneName(),
      'front_path': config.env.frontend + '/#/confirm/'
    });
  };

  $scope.emailValidate = function() {
    socket.emit('emailValidate', {
      'email': $scope.email
    });

    socket.removeListener('emailValidationResponse');
    socket.on('emailValidationResponse', function(msg) {
      console.log(msg);
      if(msg.success == false) {
        $scope.isDisabled = true;
        $scope.message.error = msg.msg;
      } else {
        $scope.isDisabled = false;
        $scope.message.error = '';
      }
    });
  };

  socket.on('signup_response', function (msg) {
    //
    console.log('singup response: ' + JSON.stringify(msg));
    if (msg == null) {
      console.log('ERROR: msg is null');
      return;
    }

    if (msg.success == false) {
      console.log('ERROR: expected answer - { success: true }, err: ' + msg.msg);
      $scope.message = {
        error: msg.msg,
        success: false
      };
    } else {
      console.log('CORRECT');

      socket.emit('authenticate', {
        'login': $scope.email,
        'password': $scope.password
      });
    }
  });

  $scope.forgot_password = function () {
    socket.emit('forgot_password', {
      'email': $scope.email,
      'front_path': config.env.frontend + '/#/password/reset/'
    });
  };

  socket.on('forgot_password_response', function (msg) {
    console.log('forgot password response: ' + JSON.stringify(msg));
    if (msg == null) {
      console.log('ERROR: msg is null');
      return;
    }

    if (msg.success == false) {
      console.log('ERROR: expected answer - { success: true }, err: ' + msg.msg);
      $scope.message = {
        error: msg.msg,
        success: false
      };
    } else {
      console.log('CORRECT');

      $scope.message = {
        success: 'Just now we sent password reset mail to you. please check your mail box.'
      };
    }
  });

  $scope.finishInvite = function (){
    socket.emit('finish_invite', {
      'userId'  : $scope.userId,
      'password': $scope.password,
      'name'    : $scope.name,
      'timezone': getLocalTimezoneName()
    });
  }


  if(invite_id){
    socket.removeListener('get_all_teams_res');
    socket.removeListener('finish_invite_res');
    socket.emit('get_all_teams');

    socket.on('finish_invite_res', function (msg) {
        if(msg.success){
          socket.emit('authenticate', {
            'login': $scope.email,
            'password': $scope.password
          });
        }else{
          console.error("Error get teams")
        }
    })


    socket.on('get_all_teams_res', function (msg) {
        if(msg.success){
          $scope.companyList = msg.teams
          socket.emit('user_by_invite', {invite_id:invite_id});
        }else{
          console.error("Error get teams")
        }
    })

    socket.on('user_by_invite_res', function (msg) {
      if(msg.success){
        if(!msg.user){
          $scope.linkStatus = 'expired'
        }else{
          $scope.linkStatus = 'allow'
          $scope.email   = msg.user.email
          $scope.userId = msg.user.id
        }
      }else{
        console.error("Error get user")
      }
      
      $scope.companyList.forEach(function (company){
        if(company.id == msg.user.team_id){
          $scope.company = company.name
        }
      })
    })
  }

}
