angular.module('Blurbiz.socket', ['btford.socket-io']);
angular.module('Blurbiz.project', ['ui.bootstrap']);
angular.module('Blurbiz', ['ui.bootstrap', 'ui.router', 'ngCookies', 'Blurbiz.socket', 'Blurbiz.project']);