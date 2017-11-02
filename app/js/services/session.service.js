(function () {
    'use strict';

    angular
        .module('Blurbiz')
        .factory('SessionService', Service);

    function Service($state, LocalStorageService, socket) {
        var service = {};
        service.checkAccess = checkAccess;

        return service;

        function checkAccess(event, toState, toParams, fromState, fromParams) {
            if (toState && toState.data && toState.data.isAdmin) {
                var token = LocalStorageService.getToken();
                socket.emit('get_current_user', {
                    'token': token
                });
                socket.on('get_current_user_response', function(msg) {
                    if (token && msg.is_enabled != 1) {
                        return $state.go('login');
                    }
                    if (token && msg.is_admin) {
                        return $state.go(toState.name, toParams);
                    } else {
                        event.preventDefault();
                        return $state.go(fromState.name || 'project.index', fromParams);
                    }
                });
            }
            return undefined;
        }

    }

})();