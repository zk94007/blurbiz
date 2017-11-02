(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('Project.ShareConfirmModalController', Controller);

    function Controller($scope, $uibModalInstance, share, SocialConnectService, $timeout)
    {
        $scope.share=share;

        if (share == "facebook" || share == "twitter" || share == "instagram")
        {
            SocialConnectService.getResult(share).me().done(function(data) {
                $scope.username = data.name || data.alias;
                $scope.$apply();
            });
        }

        $scope.ok = function() {   
            $uibModalInstance.close(share);
        };       

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();