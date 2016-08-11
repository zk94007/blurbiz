var io = require('socket.io-client')
var socket = io.connect('http://localhost:3040');

console.log('send authenticate message: user TestUserBase@gmail.com');

socket.emit('authenticate', {
        'login': 'TestUserBase@gmail.com',
        'password': 'Test'
});

function sendProjectListMessage(token) {
	console.log('send project list message with token = ' + token);
	socket.on('project_list_response', function(msg) {
		console.log('received project list response: ' + JSON.stringify(msg));
		if (msg == null) {
			console.log('ERROR: msg is null');
	                return;
		}
		if (msg.success == true) {
			if (msg.projects != null) {
				console.log('CORRECT');
			} else {
				console.log('ERROR: success == true, but projects field is null');
			}
			return;
		}
		if (msg.err != null && msg.err != '') {
                	console.log('ERROR: ' + err);
			return;
	        }
	});
	socket.emit('project_list', {
		'token': token
	});
}

socket.on('authenticate_response', function(msg) {
        console.log('authenticate response: ' + JSON.stringify(msg));
        if (msg == null) {
                console.log('ERROR: msg is null');
                return;
        }
        if (msg.success == true && msg.token != null) {
                sendProjectListMessage(msg.token);
                return;
        }
        if (msg.success == true && msg.token == null) {
                console.log('ERROR: token is null');
                return;
        }
        if (msg.err != null && msg.err != '') {
                console.log('ERROR: ' + err);
        }
});

