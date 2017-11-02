(function () {
    'use strict';

    angular
        .module('Blurbiz.project')
        .controller('TimezoneController', TimezoneController);


    function TimezoneController(LocalStorageService, socket, $scope, FlashService) {
        var vm = this;

        vm.timeZones = timezone_from_google_calendar;
        vm.newTimeZone = undefined;
        vm.autoTz = getAuthTz();
        vm.onUpdateTimeZone = onUpdateTimeZone;
        vm.setAutoTz = setAutoTz;
        vm.error = false;
        vm.successfully = false;

        $scope.$watch(function () {
            return vm.newTimeZone
        }, function (n) {
            vm.successfully = false;
            if (n != null || n != undefined) {
                vm.error = false;
            }
        });

        $scope.$watch('expire_free_trial', function(value) {
            if(value) {
                $uibModal.open({
                    animation: true,
                    backdrop: false,                  
                    keyboard : false,
                    backdropClick : false,
                    templateUrl: 'templates/modals/freeTrialCompletedModal.html',
                    windowTemplateUrl: 'templates/modals/shareModalWindow.template.html',
                    controller: 'Project.planModalController',
                    resolve: {
                        plan: function () {
                            return { };
                        }
                    } 
                });
            }
        });

        function setNewTimeZoneByStr(timeZoneStr) {
            if (timeZoneStr == undefined) return;

            angular.forEach(vm.timeZones, function (tzs, country) {
                angular.forEach(tzs, function (tzText, tz) {
                    if (tz == timeZoneStr) {
                        vm.country = tzs;
                        vm.countryTimeZones = tzs;
                        vm.newTimeZone = tz;
                        return
                    }
                })
            });
        }


        function setAutoTz() {
            setNewTimeZoneByStr(vm.autoTz);
        }


        function getAuthTz() {
            return jstz.determine().name();
        }


        function onUpdateTimeZone() {
            if (vm.newTimeZone == null || vm.newTimeZone == undefined) {
                vm.error = true;
                // FlashService.Error('Please choose one timezone');
                return;
            }

            updateTimeZone();
        }


        socket.on('update_timezone_response', function (msg) {
            console.log('update_timezone_response: ' + JSON.stringify(msg));
            if (msg == null) {
                console.log('ERROR: msg is null');
                FlashService.Error('Error happened while timezone update');
                return;
            }

            if (msg.success == false) {
                console.log('ERROR: expected answer - { success: true }, err: ' + msg.msg);
                $scope.message = {
                    error: msg.msg,
                    success: false
                };
                FlashService.Error('Error happened while timezone update');
            } else {
                vm.successfully = true;
                $scope.$parent.newTimeZone = vm.newTimeZone;
                moment.tz.setDefault(vm.newTimeZone);

                FlashService.Success('Timezone updated');
                console.log('CORRECT');
            }
        });


        function updateTimeZone() {
            socket.emit('update_timezone', {
                newTimeZone: vm.newTimeZone,
                token: LocalStorageService.getToken()
            });
        }


        $scope.$parent.$watch('newTimeZone', function (newValue, oldValue) {
            console.log("parent newTimezone changed");
            setNewTimeZoneByStr(newValue);
        });
    }
})();