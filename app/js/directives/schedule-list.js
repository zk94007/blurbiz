angular
    .module("Blurbiz")
    .directive("scheduleList", function() {
        return {
            restrict: "E",
            templateUrl: "templates/scheduleList.html",
            scope: {
                tasks: "=",
                color: "@",
                title: "@",
                users: "=",
                editTask: "&",
                deleteTask: "&",
                shareTaskNow: "&"
            },
            controller: ['$scope', function($scope, element, attrs) {
                $scope.showTasks = true;
                $scope.platforms = ['facebook', 'instagram', 'twitter', 'snapchat', 'pinterest'];
                $scope.orderByDateReverse = true;
                $scope.setOrderByDateReverse = setOrderByDateReverse;
                $scope.filterObj = {"target_social_network": '', "user_id": '', 'fileType': ''};
                $scope.setFilter = setFilter;
                $scope.getUserNameById = getUserNameById;

                $scope.isImage = isImage;
                $scope.isVideo = isVideo;


                /////

                function setOrderByDateReverse(reverse) {
                    $scope.orderByDateReverse = reverse;
                }

                function setFilter(prop, val) {
                    $scope.filterObj[prop] = val;
                }

                function getUserNameById(userId) {
                    if (!!$scope.users && !!userId) {
                        for (var i=0; i<$scope.users.length; i++) {
                            if ($scope.users[i].id == userId) {
                                return $scope.users[i].name;
                            }
                        }
                    }
                }
            }]
        }
    });