angular.module('Blurbiz.socket', ['btford.socket-io']);
angular.module('Blurbiz.project', ['ui.bootstrap', 'ngFileUpload', 'lk-google-picker']);
angular.module('Blurbiz', ['ui.bootstrap', 'ui.router', 'ngCookies', 'Blurbiz.socket', 'Blurbiz.project']);