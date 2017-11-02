angular
    .module("Blurbiz")
    .directive('focusMe', function($timeout) {
        return {
            link: function(scope, element, attrs) {
                scope.$watch(attrs.focusMe, function(value) {
                    $timeout(function() {
                        if(value === true) {
                            
                            element[0].focus();
                            element[0].select();
                        }
                    });
                });
            }
        };
});