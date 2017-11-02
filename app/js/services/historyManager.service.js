(function () {
    'use strict';

    angular
        .module('Blurbiz')
        .factory('HistoryManager', Service);

    function Service(SessionStorageService) {
        var service = {};
        service.undo = undo;
        service.redo = redo;
        service.log = log;

        return service;

        function undo() {
            var newestAction = SessionStorageService.pop('log');
            if (newestAction == '')
                return '';
            SessionStorageService.push('undo_log', newestAction);
            return newestAction;
        }
        function redo() {
            var newestUndo = SessionStorageService.pop('undo_log');
            return newestUndo;
        }
        function log(key, value) {
            SessionStorageService.push('log', key + ' ' + value);
        }
    }

})();