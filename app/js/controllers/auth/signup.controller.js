/**
 * Master Controller
 */

angular.module('Blurbiz')
    .controller('SignupController', ['$scope', '$cookieStore', 'socket', SignupController]);

function SignupController($scope, $cookieStore, socket) {
    $scope.message = {};
    $scope.signup = function() {
        socket.emit('signup', {
            'password': $scope.password,
            'name': $scope.name,
            'company': $scope.company,
            'email': $scope.email,
            'front_path': 'http://localhost:4000/#/confirm/'
        });
    };   

    socket.on('signup_response', function(msg) {
        debugger;
        console.log('signup response: ' + JSON.stringify(msg));
        if (msg == null) {
                console.log('ERROR: msg is null');
                return;
        }

        if (msg.success == false) {
                console.log('ERROR: expected answer - { success: true }, err: ' + msg.msg);
        } else {
                console.log('CORRECT');
                socket.emit('authenticate', {
                    'login': $scope.email,
                    'password': $scope.password
                });

                socket.on('authenticate_response', function(msg) {
                    debugger;
                    console.log("here");
                });
        }
    }); 
}