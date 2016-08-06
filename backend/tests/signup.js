var io = require('socket.io-client')
var socket = io.connect('http://localhost:3040');

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}


var nowDate = new Date();
var userData = 'TestUser' + nowDate.getTime() + '_' + randomIntInc(100, 10000);

console.log('send signup message: create user ' + userData);

socket.emit('signup', {
        'login': userData,
        'password': userData,
        'name': 'Test Name',
        'company': 'Test',
        'email': 'test@gmail.com'
});

socket.on('signup_response', function(msg) {
	console.log('singup response: ' + JSON.stringify(msg));
	if (msg == null) {
                console.log('ERROR: msg is null');
                return;
        }

	if (msg.success == false) {
		console.log('ERROR: expected answer - { success: true }, err: ' + err);
	} else {
		console.log('CORRECT');
	}
});
