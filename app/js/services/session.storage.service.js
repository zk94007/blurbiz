(function () {
    'use strict';

    angular
        .module('Blurbiz')
        .factory('SessionStorageService', Service);

    function Service($window) {
        var service = {};
        service.put = put;
        service.get = get;
        service.delete = remove;
        service.clear = clear;
        service.push = push;
        service.pop = pop;

        return service;

        function put(key, value) {
            $window.sessionStorage.setItem(key, value);
        }

        function get(key) {
            return $window.sessionStorage.getItem(key);
        }

        function remove(key) {
            $window.sessionStorage.removeItem(key);
        }

        function clear() {
            $window.sessionStorage.clear();
        }

        function push(key, value) { // it's for stack
            var stack = this.get(key);
            if (!stack) {
                this.put(key, value + ';');
            }
            else {
                this.put(key, value + ';' + stack);
            }
        }

        function pop(key) {
            var stack = this.get(key);
            if (!stack)
                return '';
            this.put(key, stack.substr(stack.indexOf(";") + 1));
            return stack.split(';')[0];
        }

    }

})();