/**
 * Master Controller
 */

angular.module('Blurbiz')
    .controller('MasterCtrl', ['$scope', '$cookieStore', 'UserService', MasterCtrl]);

function MasterCtrl($scope, $cookieStore, UserService) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    UserService.GetCurrent().then(function(user) {
        $scope.user = user;
    });

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };
}