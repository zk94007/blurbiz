var io = require('socket.io-client')
var socket = io.connect('http://localhost:3040');

console.log('send authenticate message: user TestUserBase@gmail.com');

socket.emit('authenticate', {
        'login': 'TestUserBase@gmail.com',
        'password': 'Test'
});

function sendConfirmateEmailMessage(token) {
        console.log('send confirmate_email message with token = ' + token);
        socket.on('confirmate_email_response', function(msg) {
                console.log('received confirmate_email_response: ' + JSON.stringify(msg));
                if (msg == null) {
                        console.log('ERROR: msg is null');
                        return;
                }
                if (msg.success == true) {
			console.log('CORRECT');
                }
                if (msg.err != null && msg.err != '') {
                        console.log('ERROR: ' + err);
                        return;
                }
        });
        socket.emit('confirmate_email', {
                'email_code': '68080683-37ea-4f7f-ae64-7476312222d8',
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
                sendConfirmateEmailMessage(msg.token);
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

