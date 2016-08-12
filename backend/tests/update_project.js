var io = require('socket.io-client')
var socket = io.connect('http://localhost:3040');

console.log('send authenticate message: user TestUserBase@gmail.com');

socket.emit('authenticate', {
        'login': 'TestUserBase@gmail.com',
        'password': 'Test'
});

function sendUpdateProjectMessage(token) {
        console.log('send update_project message with token = ' + token);
        socket.on('update_project_response', function(msg) {
                console.log('received update_project_response: ' + JSON.stringify(msg));
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
        socket.emit('update_project', {
                'project_id': '3',
		'fields' : [
			{
				'name': 'project_name',
				'value': 'project_name_test_1'
			}
		],
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
                sendUpdateProjectMessage(msg.token);
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

