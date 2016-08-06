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

function createUser(login, password, name, company, email, callback) {
	try {
		isLoginExists(login, function(err, result) {
			if (err) {
				var result = {
                                	'success': false,
					'msg': err
                                };
				if (callback != null) {
                                        callback(null, result);
                                }
				return;
			}
			var isLoginEx = result;
			if (isLoginEx) {
                                var result = {
                                        'success': false,
                                        'msg': 'Login already exists'
                                };
                                if (callback != null) {
                                        callback(null, result);
                                }
                                return;
                        } else {
				query('INSERT INTO public.user(login, password, name, company, email)' +
	                                ' VALUES ($1, $2, $3, $4, $5);', [login, password, name, company, email], function(err, result) {
					var result = {
		                                'success': true
                       			};
					if (err) {
						result.success = false;
						result.msg = err;
					}
		                        if (callback != null) {
                       			        callback(null, result);
		                        }
				});
			}

		});
	} catch (err) {
                var result = {
			'success': false,
                        'msg': err
                };
		if (callback != null) {
			callback(null, result);
		}
	}
}

function getToken(user) {
	var token = jwt.sign(user, config.tokenKey);
	return token;
}

function checkAuth(login, password, callback) {
	console.log('call method checkAuth');
	try {
		isLoginExists(login, function(err, result) {
                        if (err) {
                                var result = {
                                        'success': false,
                                        'msg': err
                                };
                                if (callback != null) {
                                        callback(null, result);
                                }
                                return;
                        }
			var isLoginEx = result;
                        if (!isLoginEx) {
                                var result = {
                                        'success': false,
                                        'msg': 'Login ' + login + ' doesn\'t exist'
                                };
                                if (callback != null) {
                                        callback(null, result);
                                }
                                return;
                        } else {
				getUserInfo(login, function(err, user) {
					if (err) {
		                                var result = {
        	                        	        'success': false,
                	        	                'msg': err
                        		        };
                	                	if (callback != null) {
		                                       	callback(null, result);
	        	                        }
                	                	return;
                        		}
					//console.log(JSON.stringify(user));
					if (user.password == password) {
						var result = {
                        	        	        'success': true,
                	        	                'msg': null,
							'token': getToken(user)
		                                };
				                if (callback != null) {
                        		                callback(null, result);
			                        }
					} else {
						 var result = {
                                                        'success': false,
                                                        'msg': 'incorrect password for user ' + login
                                                };
                                                if (callback != null) {
                                                        callback(null, result);
                                                }
					}
				});
			}
		});
	} catch (err) {
		console.log('error in method checkAuth: ' + err);
                var result = {
                        'success': false,
                        'msg': err
                };
                if (callback != null) {
                        callback(null, result);
                }
	}
}

function getUserInfo(login, callback) {
	console.log('call method getUserInfo: login = ' + login);
	try {
		query('SELECT * from public.user where login = $1', [login], function(err, result) {
                        if (err) {
                                var result = {
                                        'success': false,
                                        'msg': err
                                };
                                if (callback != null) {
                                        callback(null, result);
                                }
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
		var result = {
                        'success': false,
                        'msg': err
                };
                if (callback != null) {
                        callback(null, result);
                }
	}
}

function isLoginExists(login, callback) {
	console.log('call method isLoginExists');
	try {
               	query('SELECT count(*) from public.user where login = $1', [login], function(err, result) {
			if (err) {
                       	        var result = {
               	                        'success': false,
       	                                'msg': err
                                };
                               	if (callback != null) {
                       	                callback(null, result);
               	                }
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
		var result = {
                        'success': false,
                        'msg': err
                };
                if (callback != null) {
                        callback(null, result);
                }
		console.log('error: ' + err);
	}
}

var io1 = require('socket.io').listen(3040);

io1.on('connection', function(socket1) {
	console.log("client connected");

	//signup method
	socket1.on('signup', function(message)      {
	        console.log('received singup message: ' + JSON.stringify(message));
		if (message == null) {
			socket1.emit('signup_response', {
				'success': false,
				'msg': 'message is empty'
			});
			return;
		}
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

	//authenticate method
        socket1.on('authenticate', function(message) {
		console.log('received authenticate message: ' + JSON.stringify(message));
                if (message == null) {
                        socket1.emit('authenticate_response', {
                                'success': false,
                                'msg': 'message is empty'
                        });
                        return;
                }
		var login = message.login;
                var password = message.password;
				
		checkAuth(login, password, function(err, result) {
			console.log('send authenticate result: ' + JSON.stringify(result));
			socket1.emit('authenticate_response', result);
		});
	});
});

