(function () {
    'use strict';

    angular
        .module('Blurbiz')
        .factory('MediaService', Service);

    function Service(socket) {
        var service = {};
        service.smartOrder = smartOrder;
        
        return service;

        function smartOrder(models) {
            var itemOrder = {};
            models.forEach(function(item, index) {
                itemOrder[item.id] = index + 1;
                models[index].order_in_project = index + 1;
            });
            socket.emit('update_media_order', itemOrder);
        }

    }

})();