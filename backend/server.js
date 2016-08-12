var pg = require('pg');
var config = require('./config.js');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var uuidGen = require('node-uuid');

var transporter = nodemailer.createTransport({
	'service': 'gmail',
	'auth': config.mailConfig.auth
});

var mailOptions = config.mailConfig.template;

function sendConfirmationEmail(email, userId, link, cb) {
	if (cb == null) {
		throw new Error('no callback in sendMail method');
	}
	console.log('call sendMail method: email = ' + email);
	var from = mailOptions.from;
	var to = email;
	var subject = mailOptions.subject;
	var html = mailOptions.html;
	html = html.replace('link_placeholder', link);
	
	var options = {
	        'from': from,
	        'to': to,
        	'subject': subject,
	        'html': html
	}

	transporter.sendMail(options, function(error, info) {
		if (error) {
		        console.log(error);
			successFalseCb(error, cb);
			return;
		}
		console.log('Message sent: ' + info.response);
		successCb(cb);
	});
}

function updateFields(tableName, tableIdValue, namesAndValuesArray, callback) {
	 try {
                console.log('call method updateFields: tableName = ' + tableName + ', tableIdValue = ' + tableIdValue + ', namesAndValues = ' + JSON.stringify(namesAndValuesArray));
		var names = [];
		var values = [];
		namesAndValuesArray.forEach(function (nameAndValue) {
			names.push(nameAndValue.name);
			values.push("'" + nameAndValue.value  + "'");
		});
		var queryText = 'UPDATE public."' + tableName + '" SET (' + names.join(', ') + ') = (' + values.join(', ') + ') WHERE id = ' + tableIdValue + ';';
		console.log(queryText);
                query(queryText, [], function(err, result) {
                        if (err) {
                                successFalseCb(err, callback);
                        } else {
                                successCb(callback);
                        }
                });

        } catch (err) {
                console.log('error in method createEmailConfirmationEntry: ' + err);
                successFalseCb(err, callback);
        }

}

function updateProjectFields(projectId, namesAndValuesArray, cb) {
	updateFields('project', projectId, namesAndValuesArray, cb);
}

function updateUserFields(userId, namesAndValuesArray, cb) {
        updateFields('user', userId, namesAndValuesArray, cb);
}

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

function successCb(callback, additionalParams, separateParams) {
	var result = {
		'success': true
	}
	if (additionalParams) { 
		result = mergeJson(result, additionalParams);
	}
        if (callback != null) {
		if (separateParams) {
			callback(null, result, separateParams);
		} else {
	                callback(null, result);
		}
        }
}

function createEmailConfirmationEntry(userId, code, callback) {
	try {
		console.log('call method createEmailConfirmationEntry: userId = ' + userId + ', code = ' + code);
		query('INSERT INTO public.email_confirmation(user_id, code)' +
                	' VALUES ($1, $2) RETURNING id;', [userId, code], function(err, result) {
                        if (err) {
                        	successFalseCb(err, callback);
                        } else {
                        	successCb(callback);
			}
                });

	} catch (err) {
		console.log('error in method createEmailConfirmationEntry: ' + err);
                successFalseCb(err, callback);
	}
}

function createUser(email, password, name, callback) {
	try {
		console.log('call method createUser: email = ' + email + ', name = ' + name);
		isEmailExists(email, function(err, result) {
			if (err) {
				successFalseCb(err, callback);
				return;
			}
			var isEmailEx = result;
			if (isEmailEx) {
				successFalseCb('Email ' + email + '  already exists', callback);
				return;
			}
			query('INSERT INTO public.user(email, password, name)' +
	                	' VALUES ($1, $2, $3) RETURNING id;', [email, password, name], function(err, result) {
				if (err) {
					successFalseCb(err, callback);
				} else {
                                        var row = result.rows[0];
                                        var userId = row.id;
                                        successCb(callback, null, {
                                                'user_id': userId
                                        });
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


function deleteProject(projectId, callback) {
        try {
                console.log('call method deleteProject: projectId = ' + projectId);
                query('DELETE FROM public.project WHERE id = $1;', [projectId], function(err, result) {
                        if (err) {
                                successFalseCb(err, callback);
                        } else {
                                successCb(callback);
                                
                        }
		});
        } catch (err) {
                console.log('error in method deleteProject: ' + err);
                successFalseCb(err, callback);
        }
}

function confirmateEmail(userId, code, callback) {
        try {
                console.log('call method confirmateEmail: userId = ' + userId + ', code = ' + code);
                query('SELECT count(*) FROM public.email_confirmation WHERE user_id = $1 and code = $2;', [userId, code], function(err, result) {
                        if (err) {
                                successFalseCb(err, callback);
                        } else {
				var count = result.rows[0].count;
				if (count == 0) {
					successFalseCb('code ' + code + ' is not found for user ' + userId, callback);
				} else {
					updateFields('user', userId, [
					        {
							'name': 'is_confirmed', 
							'value': true
						}
					], function(err1, result1) {
						if (err1) {
							successFalseCb(err1, callback);
							return;
						}
	                                	successCb(callback);
					});
				}
                        }
                });
        } catch (err) {
                console.log('error in method confirmateEmail: ' + err);
                successFalseCb(err, callback);
        }
}



function projectList(userId, callback) {
        try {
                console.log('call method projectList: userId = ' + userId);      
		query('SELECT id, project_name FROM public.project WHERE user_id = $1;', 
			[userId], function(err, result) {
                        if (err) {
                        	successFalseCb(err, callback);
                        } else {
				var projects = [];
				for (var i = 0; i < result.rows.length; i++) {
	                        	var row = result.rows[i];
					var project = {
						'project_id': row.id,
						'project_name': row.project_name
					};
       	                        	projects.push(project);
				}
                                successCb(callback, {
                                	'projects': projects
                                });
                        }
               	});
        } catch (err) {
                console.log('error in method projectList: ' + err);
                successFalseCb(err, callback);
        }
}


function getToken(user) {
	return jwt.sign(user, config.tokenKey);
}

function checkToken(token, callback) {
        jwt.verify(token, config.tokenKey, callback);
}

function checkAuth(email, password, callback) {
	console.log('call method checkAuth');
	try {
		isEmailExists(email, function(err, result) {
			if (err) {
				successFalseCb(err, callback);
				return;
                        }
			var isEmailEx = result;
                        if (!isEmailEx) {
				successFalseCb('Email ' + email + ' doesn\'t registered', callback);
                                return;
                        } else {
				getUserInfo(email, function(err, user) {
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
						successFalseCb('incorrect password for user ' + email, callback);
					}
				});
			}
		});
	} catch (err) {
		console.log('error in method checkAuth: ' + err);
		successFalseCb(err, callback);
	}
}

function getUserInfo(email, callback) {
	console.log('call method getUserInfo: email = ' + email);
	try {
		query('SELECT * from public.user where email = $1', [email], function(err, result) {
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

function isEmailExists(email, callback) {
	console.log('call method isEmailExists, email = ' + email);
	try {
               	query('SELECT count(*) from public.user where email = $1', [email], function(err, result) {
			if (err) {
				successFalseCb(err, callback);
       	                        return;
                        }

			//console.log(count);

			var count = result.rows[0];
			var emailExists = count.count != 0;
			console.log('result of method isEmailExists: ' + emailExists);
	                if (callback != null) {
       	                        callback(null, emailExists);
                        }
		});
	} catch (err) {
	        console.log('error in method isEmailExists: ' + err);
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

function authRequiredCall(socket1, methodName, cb) {
	if (cb == null) {
		throw new Errow('error: method ' + methodName + ' has no callback');
	}
        socket1.on(methodName, function(message) {
                console.log('received ' + methodName + ' message: ' + JSON.stringify(message));
                checkIfNotEmptyMessage(socket1, message, methodName + '_response', function() {
                        var projectName = message.project_name;
                        var token = message.token;
                        checkToken(token, function(err, result) {
                                if (err) {
                                        socket1.emit(methodName + '_response', {
                                                'success': false,
                                                'msg': 'check token error: ' + err
                                        });
                                        return;
                                }
                                var userInfo = result;
                                console.log('Token parse result: ' + JSON.stringify(result));
				cb(userInfo, message);
                        });
                });
        });
}

io1.on('connection', function(socket1) {
	console.log("client connected");

	//signup method
	socket1.on('signup', function(message)      {
	        console.log('received singup message: ' + JSON.stringify(message));
		checkIfNotEmptyMessage(socket1, message, 'signup_response', function() {
			var email = message.email;
        	        var password = message.password;
	                var name = message.name;
			var frontPath = message.front_path;
        	        
			var notFilledFields = [];
			var notFilledMessage = 'Required fields are not filled: ';
			if (!email) {
				notFilledFields.push('email');
			}
			if (!name) {
				notFilledFields.push('name');
			}
                        if (!password) {
                                notFilledFields.push('password');
                        }
			if (notFilledFields.length > 0) {
				successFalseCb(notFilledMessage + notFilledFields.toString(), function(err, result) {
					console.log('send signup response - required fields are not filled: ' + notFilledFields.toString());
					socket1.emit('signup_response', result);
				});
				return;
			}

			createUser(email, password, name, function(err, result, sepParams) {
                	        console.log('send singup result: ' + JSON.stringify(result));
//        	                socket1.emit('signup_response', result);
				var userId = sepParams.user_id;
				var uuid = uuidGen.v4();
				createEmailConfirmationEntry(userId, uuid, function (err1, result1) {
					if (result1 && result1.success) {
						var link = frontPath + uuid;
						console.log('link: ' + link);
						sendConfirmationEmail(email, userId, link, function(err2, result2) {
							console.log('sendConfirmationEmail result: ' + JSON.stringify(result2));
							//emit initial result (success = true)
							socket1.emit('signup_response', result);
						});
					} else {
						socket1.emit('signup_response', {
							'success': false,
							'msg': err1
						});
					}
				});
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

	authRequiredCall(socket1, 'create_project', function(userInfo, message) {
		var projectName = message.project_name;
		createProject(userInfo.id, projectName, function(err, result) {
                	console.log('send create project response: ' + JSON.stringify(result))
                        socket1.emit('create_project_response', result);
                });

	});

	authRequiredCall(socket1, 'project_list', function(userInfo) {
		projectList(userInfo.id, function(err, result) {
                	console.log('send project list response: ' + JSON.stringify(result))
                        socket1.emit('project_list_response', result);
		});
	});


        authRequiredCall(socket1, 'delete_project', function(userInfo, message) {
                deleteProject(message.project_id, function(err, result) {
                        console.log('send delete_project response: ' + JSON.stringify(result))
                        socket1.emit('delete_project_response', result);
                });
        });

	authRequiredCall(socket1, 'confirmate_email', function(userInfo, message) {
                confirmateEmail(userInfo.id, message.email_code, function(err, result) {
                        console.log('send confirmate_email response: ' + JSON.stringify(result))
                        socket1.emit('confirmate_email_response', result);
                });
        });

        authRequiredCall(socket1, 'update_project', function(userInfo, message) {
                updateProjectFields(message.project_id, message.fields, function(err, result) {
                        console.log('send update_project response: ' + JSON.stringify(result))
                        socket1.emit('update_project_response', result);
                });
        });

        authRequiredCall(socket1, 'update_user', function(userInfo, message) {
                updateUserFields(message.user_id, message.fields, function(err, result) {
                        console.log('send update_user response: ' + JSON.stringify(result))
                        socket1.emit('update_user_response', result);
                });
        });

});
