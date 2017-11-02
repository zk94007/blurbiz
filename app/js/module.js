angular.module('Blurbiz.socket', ['btford.socket-io']);
angular.module('Blurbiz.timepickerpopup', ['sy.bootstrap.timepicker', 'template/syTimepicker/timepicker.html', 'template/syTimepicker/popup.html', 'ps.inputTime']);
angular.module('Blurbiz.project', ['ui.bootstrap', 'ngFileUpload', 'lk-google-picker','ngDialog','ng-sortable','ngMaterial','720kb.socialshare', 'base64', 'satellizer', 'ngImgCrop', 'facebook', 'rzModule', 'Blurbiz.timepickerpopup', 'dropbox', 'angular.chosen', 'vjs.video', 'com.2fdevs.videogular', 'com.2fdevs.videogular.plugins.controls', 'com.2fdevs.videogular.plugins.overlayplay', 'com.2fdevs.videogular.plugins.poster', 'angularUtils.directives.dirPagination', 'nya.bootstrap.select']);
angular.module('Blurbiz.admin', ['ui.select']);
angular.module('Blurbiz.social', []);
angular.module('Blurbiz', ['ui.bootstrap', 'ui.router', 
'ngCookies', 'ngSanitize', 'ngFlash', 'Blurbiz.socket', 
'Blurbiz.project', 'Blurbiz.admin', 'Blurbiz.social',
'angular-meditor','aCKolor', 'ngDialog', 'ngMaterial']);