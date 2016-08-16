var io = require('socket.io-client')
var socket = io.connect('http://localhost:3040');
var baseTest = require('./base_auth_test.js');

baseTest.baseAuth(socket, function(token) {
	baseTest.checkResponse('project_data', token, socket, function(msg) {
		console.log('project_data: ' + msg);
		if (msg.id == 1) {
			console.log('SUCCESS');
		}
	});
	socket.emit('project_data', {
                'project_id': '1',
                'token': token
        });
});

