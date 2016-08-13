/**
 * Master Controller
 */

angular.module('Blurbiz')
    .controller('ConfirmController', ['$scope', '$stateParams', '$cookieStore', '$state', 'socket', 'AuthService', ConfirmController]);

function ConfirmController($scope, $stateParams, $cookieStore, $state, socket, AuthService) {
    
    // socket.emit('confirmate_email', {
    //     'email_code': $stateParams.uuid,
    //     'token': AuthService.getToken()
    // });

    // socket.on('confirmate_email_response', function(msg) {
    //     debugger;
    //     console.log('received project list response: ' + JSON.stringify(msg));
    //     if (msg == null) {
    //             console.log('ERROR: msg is null');
    //             return;
    //     }
    //     if (msg.success == true) {
    //             AuthService.saveConfirmStatus(true);
    //             return;
    //     }
    //     if (msg.err != null && msg.err != '') {
    //             console.log('ERROR: ' + err);
    //             return;
    //     }
    // });
}