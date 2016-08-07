var pg = require('pg');

var config = require('./config.js');

var jwt = require('jsonwebtoken');

//TODO use connection pool
function query_pool(text, values, cb) {
      pg.connect(function(err, client, done) {
        client.query(text, values, function(err, result) {
          done();
          cb(err, result);
        })
      });
}

function query(text, values, cb) {
	var client = new pg.Client(config.dbConfig);

	// connect to our database
	client.connect(function (err) {
		if (err) throw err;

		// execute a query on our database
		client.query(text, values, function (err, result) {
			if (err) throw err;

			// disconnect the client
			client.end(function (err) {
				if (err) throw err;
			});
			
			cb(err, result);
		});
	});
}

function successFalseCb(msg, callback) {
	var result = {
        	'success': false,
                'msg': '' + msg
        };
        if (callback != null) {
        	callback(null, result);
        }
}

function mergeJson(obj1, obj2) {
	var result={};
	for(var key in obj1) result[key]=obj1[key];
	for(var key in obj2) result[key]=obj2[key];
	return result;
}

function successCb(callback, additionalParams) {
	var result = {
		'success': true
	}
	if (additionalParams) { 
		result = mergeJson(result, additionalParams);
	}
        if (callback != null) {
                callback(null, result);
        }
}

function createUser(login, password, name, company, email, callback) {
	try {
		console.log('call method createUser: login = ' + login + ', name = ' + name + ', company = ' + company +', email = ' + email);
		isLoginExists(login, function(err, result) {
			if (err) {
				successFalseCb(err, callback);
				return;
			}
			var isLoginEx = result;
			if (isLoginEx) {
				successFalseCb('Login ' + login + '  already exists', callback);
				return;
			}
			query('INSERT INTO public.user(login, password, name, company, email)' +
	                	' VALUES ($1, $2, $3, $4, $5);', [login, password, name, company, email], function(err, result) {
				if (err) {
					successFalseCb(err, callback);
				} else {
					successCb(callback);
				}
			});

		});
	} catch (err) {
		console.log('error in method createUser: ' + err);
		successFalseCb(err, callback);
	}
}

function createProject(userId, projectName, callback) {
        try {
		console.log('call method createProject: userId = ' + userId + ', projectName = ' + projectName);
                isProjectExists(userId, projectName, function(err, result) {
                        if (err) {
                                successFalseCb(err, callback);
                                return;
                        }
                        var isProjectEx = result;
                        if (isProjectEx) {
                                successFalseCb('Project ' + projectName + ' already exists', callback);
                                return;
                        }
                        query('INSERT INTO public.project(user_id, project_name)' +
                                ' VALUES ($1, $2) RETURNING id;', [userId, projectName], function(err, result) {
                                if (err) {
                                        successFalseCb(err, callback);
                                } else {
					var row = result.rows[0];
					var newProjectId = row.id;
					successCb(callback, {
						'new_project_id': newProjectId
					});
                                }
                        });

                });
        } catch (err) {
                console.log('error in method createProject: ' + err);
                successFalseCb(err, callback);
        }
}


function getToken(user) {
	return jwt.sign(user, config.tokenKey);
}

function checkToken(token, callback) {
        jwt.verify(token, config.tokenKey, callback);
}

function checkAuth(login, password, callback) {
	console.log('call method checkAuth');
	try {
		isLoginExists(login, function(err, result) {
			if (err) {
				successFalseCb(err, callback);
				return;
                        }
			var isLoginEx = result;
                        if (!isLoginEx) {
				successFalseCb('Login ' + login + ' doesn\'t exist', callback);
                                return;
                        } else {
				getUserInfo(login, function(err, user) {
					if (err) {
						successFalseCb(err, callback);
                	                	return;
                        		}
					//console.log(JSON.stringify(user));
					if (user.password == password) {
						successCb(callback, {
							'token': getToken(user)
						});
					} else {
						successFalseCb('incorrect password for user ' + login, callback);
					}
				});
			}
		});
	} catch (err) {
		console.log('error in method checkAuth: ' + err);
		successFalseCb(err, callback);
	}
}

function getUserInfo(login, callback) {
	console.log('call method getUserInfo: login = ' + login);
	try {
		query('SELECT * from public.user where login = $1', [login], function(err, result) {
                        if (err) {
				successFalseCb(err, callback);
                                return;
                        }
			var user = result.rows[0];
			//console.log(JSON.stringify(user));
			if (callback != null) {
                        	callback(null, user);
        		}
		});
	} catch (err) {
		console.log('error in method getUserInfo: ' + err);
		successFalseCb(err, callback);
	}
}

function isLoginExists(login, callback) {
	console.log('call method isLoginExists, login = ' + login);
	try {
               	query('SELECT count(*) from public.user where login = $1', [login], function(err, result) {
			if (err) {
				successFalseCb(err, callback);
       	                        return;
                        }

			//console.log(count);

			var count = result.rows[0];
			var loginExists = count.count != 0;
			console.log('result of method isLoginExists: ' + loginExists);
	                if (callback != null) {
       	                        callback(null, loginExists);
                        }
		});
	} catch (err) {
	        console.log('error in method isLoginExists: ' + err);
		successFalseCb(err, callback);
	}
}

function isProjectExists(userId, projectName, callback) {
        console.log('call method isProjectExists, userId = ' + userId + ', projectName = ' + projectName);
	
        try {
                query('SELECT count(*) from public.project where user_id = $1 and project_name = $2', [userId, projectName], function(err, result) {
                        if (err) {
				successFalseCb(err, callback);
				return;
			}
                        //console.log(count);

                        var count = result.rows[0];
                        var projectExists = count.count != 0;
                        console.log('result of method isProjectExists: ' + projectExists);
                        if (callback != null) {
                                callback(null, projectExists);
                        }
                });
        } catch (err) {
                console.log('error in method isProjectExists: ' + err);
		successFalseCb(err, callback);
        }
}

var io1 = require('socket.io').listen(3040);

function checkIfNotEmptyMessage(socket, message, methodName, cb) {
	if (message == null) {
		socket.emit(methodName, {
                	'success': false,
                        'msg': 'message is empty'
                });
		return;
	}
	//if message is not empty - proceed
	if (cb != null) {
		cb();
	}
}

io1.on('connection', function(socket1) {
	console.log("client connected");

	//signup method
	socket1.on('signup', function(message)      {
	        console.log('received singup message: ' + JSON.stringify(message));
		checkIfNotEmptyMessage(socket1, message, 'signup_response', function() {
			var login = message.login;
        	        var password = message.password;
	                var name = message.name;
                	var company = message.company;
        	        var email = message.email;
	                createUser(login, password, name, company, email, function(err, result) {
                	        console.log('send singup result: ' + JSON.stringify(result));
        	                socket1.emit('signup_response', result);
	                });
		});
	});

	//authenticate method
        socket1.on('authenticate', function(message) {
		console.log('received authenticate message: ' + JSON.stringify(message));
		checkIfNotEmptyMessage(socket1, message, 'authenticate_response', function() {
			var login = message.login;
	                var password = message.password;
				
			checkAuth(login, password, function(err, result) {
				console.log('send authenticate result: ' + JSON.stringify(result));
				socket1.emit('authenticate_response', result);
			});
		});
	});

	//create_project
        socket1.on('create_project', function(message) {
                console.log('received create_project message: ' + JSON.stringify(message));
		checkIfNotEmptyMessage(socket1, message, 'authenticate_response', function() {
	                var projectName = message.project_name;
        	        var token = message.token;
			checkToken(token, function(err, result) {
				if (err) {
					socket1.emit('create_project_response', {
	                        	        'success': false,
        	        	                'msg': 'check token error: ' + err
        		                });
	                	        return;
				}
				var userInfo = result;
				console.log('Token parse result: ' + JSON.stringify(result));
				
				createProject(userInfo.id, projectName, function(err, result) {
                        	        console.log('send create project response: ' + JSON.stringify(result))
                                	socket1.emit('create_project_response', result);
				});
			});
		});
        });
});

