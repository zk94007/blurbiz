var io = require('socket.io-client')
var socket = io.connect('http://localhost:3040');

console.log('send authenticate message: user TestUserBase@gmail.com');

socket.emit('authenticate', {
        'login': 'TestUserBase@gmail.com',
        'password': 'Test'
});

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}


var nowDate = new Date();
var projectData = 'test_project_' + nowDate.getTime() + '_' + randomIntInc(100, 10000);

function sendCreateProjectMessage(data, token) {
	console.log('send create project message with project_name = ' + data + ', token = ' + token);
	socket.on('create_project_response', function(msg) {
		console.log('received create project response: ' + JSON.stringify(msg));
		if (msg == null) {
			console.log('ERROR: msg is null');
	                return;
		}
		if (msg.success == true) {
			if (msg.new_project_id != null) {
				sendDeleteProjectMessage(msg.new_project_id, token);
			} else {
				console.log('ERROR: success == true, but new_project_id is null');
			}
			return;
		}
		if (msg.err != null && msg.err != '') {
                	console.log('ERROR: ' + err);
			return;
	        }
	});
	socket.emit('create_project', {
		'project_name': data,
		'token': token
	});
}

function sendDeleteProjectMessage(projectId, token) {
        console.log('send delete_project message with project_id = ' + projectId + ', token = ' + token);
        socket.on('delete_project_response', function(msg) {
                console.log('received delete project response: ' + JSON.stringify(msg));
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
        socket.emit('delete_project', {
                'project_id': projectId,
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
                sendCreateProjectMessage(projectData, msg.token);
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

