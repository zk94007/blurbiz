(function () {
    'use strict';

    angular
        .module('Blurbiz.socket')
        .factory('socket', Service);

    function Service(socketFactory) {
        var socket = io.connect(config.env.backend, {secure: true});
        return socketFactory({
            ioSocket: socket
        });
    }

})();