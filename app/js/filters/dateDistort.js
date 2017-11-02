(function () {
    'use strict';
	angular
        .module('Blurbiz')
		.filter("dateDistort", [function () {
	        return function (originalDate) {
	            return distortToDefaultTimezone(new Date(originalDate));
	        };
	    }]);
})();