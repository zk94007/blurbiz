(function () {
    'use strict';

    angular
        .module('Blurbiz')
        .factory('ServiceConnectionStateService', ServiceConnectionStateService);

    function ServiceConnectionStateService($q, socket, LocalStorageService) {
        var service = {
            setConnectionState: setConnectionState,
            getAllConnectionStateByUser: getAllConnectionStateByUser
        };

        return service;


        ///////


        function setConnectionState(social, state) {
            return $q(function (resolve, reject) {
                socket.emit('update_service_connection_state', {
                    social: social,
                    state: state,
                    token: LocalStorageService.getToken()
                });

                socket.on('update_service_connection_state_response', function (msg) {
                    console.log('update_service_connection_state response: ' + JSON.stringify(msg));
                    if (msg == null) {
                        console.log('ERROR: msg is null');
                        reject('ERROR: msg is null');
                    }

                    if (msg.success == false) {
                        console.log('ERROR: expected answer - { success: true }, err: ' + msg.msg);
                        var message = {
                            error: msg.msg,
                            success: false
                        };
                        reject(message);
                    } else {
                        console.log('CORRECT');
                        resolve(msg);
                    }
                });
            });
        }

        function getAllConnectionStateByUser() {
            return $q(function (resolve, reject) {
                socket.emit('get_all_service_connection_state', {
                    token: LocalStorageService.getToken()
                });

                socket.on('get_all_service_connection_state_response', function (msg) {
                    console.log('get_all_service_connection_state_state response: ' + JSON.stringify(msg));
                    if (msg == null) {
                        console.log('No data of user services');
                        reject({});
                    }
                    else {
                        console.log('CORRECT');
                        resolve(msg);
                    }
                });
            });
        }
    }
})();