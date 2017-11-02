/**
 * Master Controller
 */

angular.module('Blurbiz')
  .controller('PasswordResetController', ['$scope', '$timeout', '$state', '$stateParams', 'socket', Controller]);

function Controller($scope, $timeout, $state, $stateParams, socket) {
  var reset_code = $stateParams.reset_code;

  $scope.message = {};
  
  $scope.resetPassword = function () {
    socket.emit('reset_password', {
      'password': $scope.password,
      'confirm_password': $scope.confirm_password,
      'reset_code': reset_code
    });
  };

  socket.on('reset_password_response', function (msg) {
    //
    console.log('reset_password_response: ' + JSON.stringify(msg));
    if (msg == null) {
      console.log('ERROR: msg is null');
      return;
    }

    if (msg.success == false) {
      $scope.message = {
        error: msg.msg,
        success: false
      };
      console.log('ERROR: expected answer - { success: true }, err: ' + msg.msg);

    } else {
      $scope.message = {
        error: false,
        success: 'Password Reset!'
      };

      $timeout(function(){
        $state.go('login');
      }, 4000);

      console.log('CORRECT');
    }
  });
} // <-- ConfirmateEmailController