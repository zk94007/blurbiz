(function () {
    'use strict';

    angular
        .module('Blurbiz')
        .factory('AuthService', Service);

    function Service($window, socket) {
        var service = {};
        service.saveToken = saveToken;
        service.getToken = getToken;
        service.saveConfirmStatus = saveConfirmStatus;
        service.getConfirmStatus = getConfirmStatus;
        service.login = login;
        service.logout = logout;
        service.signup = signup;
        service.confirmation = email_confirmation;

        return service;

        function saveToken(token) {
            $window.localStorage['jwtToken'] = token;
        }

        function getToken() {
            return $window.localStorage['jwtToken'];
        }

        function saveConfirmStatus(status) {
            $window.localStorage['is_confirmed'] = status;
        }

        function getConfirmStatus() {
            return $window.localStorage['is_confirmed'] == "true";
        }

        function logout() {
            $window.localStorage.removeItem('jwtToken');
            $window.localStorage.removeItem('is_confirmed');
        }

        function login(email, password) {
        	socket.emit('authenticate', {
	            'login': 'TestUserBase@gmail.com',
	            'password': 'Test'
	        });	
        }  

        function signup() {
        	socket.emit('signup', {
		    	'password': userData,
		    	'name': 'Test Name',
		    	'company': 'Test',
		    	'email': userData,
		    	'front_path': 'http://www.blurbiz.com/confirm/'
			});
        } 

        function email_confirmation() {
        	socket.emit('confirmate_email', {
            	'email_code': '68080683-37ea-4f7f-ae64-7476312222d8',
            	'token': token
    		});
        }     
    }

})();