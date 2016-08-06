var io = require('socket.io-client')
var socket = io.connect('http://localhost:3040');

console.log('send authenticate message: user TestUserBase');

socket.emit('authenticate', {
        'login': 'TestUserBase',
        'password': 'Test'
});

socket.on('authenticate_response', function(msg) {
        console.log('authenticate response: ' + JSON.stringify(msg));
	if (msg == null) {
		console.log('ERROR: msg is null');
		return;
	}
	if (msg.success == true && msg.token != null) {
		console.log('CORRECT');
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
