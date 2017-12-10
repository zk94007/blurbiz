var pg = require('pg');
var config = require('./config.js');
var functions = require('./customFunction.js');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var uuidGen = require('node-uuid');
var ss = require('socket.io-stream');
var SocketIOFile = require('socket.io-file');
var path = require('path');
var fs = require('fs');
var s3 = require('s3');
var azure = require('azure-storage');
var download = require('url-download');
var readChunk = require('read-chunk');
var fileType = require('file-type');
var ResumableUpload = require('node-youtube-resumable-upload');
var google = require('googleapis');
var googleDrive = require('google-drive');
var gm = require('gm');
var ffmpeg = require('fluent-ffmpeg');
var async = require('async');
var schedule = require('node-schedule');
var FB = require('fb');
var Twitter = require('twitter');
var Twit = require('twit');
var PDK = require('node-pinterest');
var request = require('request');
var sizeOf = require('image-size');
var schedules = {};
var _ = require('underscore');
var https = require('https');
var http = require('http')
var formData = require('form-data');
var mime = require('mime-types');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const DataURI = require('datauri').promise;
const getDuration = require('get-video-duration');
var getResolution = require('get-video-dimensions');
var shell = require('shelljs');
var xoauth2 = require('xoauth2');
// var Jimp = require("jimp");

var stripe = require('stripe')('sk_test_1Da0KIiZLwsBW2wCkmrCvmmn');

// gm('./downloads/c395cb70-9df2-11e7-844d-9fd5410e68d3.png')
// .rotate('green', 45)
// .resize(100, 100)
// .flatten()
// .write('./out.png', function (err) {
//   if (!err) console.log('crazytown has arrived');
// })

// gm('./62f86aa0-9881-11e7-b0a0-b513e28aa47b.jpeg')
// .resize(800, 800)
// .crop(711, 400, 45.5, 200)
// .write('./'+uuidGen.v1()+'.jpg', function (err) {
//   if (!err) console.log('crazytown has arrived');
//   else console.log(err);
// });

// gm('./d4ad7e40-988d-11e7-837d-5f213f41ce90.jpeg')
// // .resize(800, 800)
// .crop(711, 400, 894.5, 300)
// .write('./'+uuidGen.v1()+'.jpg', function (err) {
//   if (!err) console.log('crazytown has arrived');
//   else console.log(err);
// });

// gm('./d4ad7e40-988d-11e7-837d-5f213f41ce90.jpeg')
// // .resize(800, 800)
// .crop(400, 400, 1050, 300)
// .write('./'+uuidGen.v1()+'.jpg', function (err) {
//   if (!err) console.log('crazytown has arrived');
//   else console.log(err);
// });

// gm('./d4ad7e40-988d-11e7-837d-5f213f41ce90.jpeg')
// // .resize(800, 800)
// .crop(224, 400, 1138, 300)
// .write('./'+uuidGen.v1()+'.jpg', function (err) {
//   if (!err) console.log('crazytown has arrived');
//   else console.log(err);
// });

// gm('./downloads/8e049ce0-a034-11e7-b41f-edf8d7178af5.png')    
// .size(function (err, size) {

//     console.log(size);
// });

// shell.exec('ffmpeg -loop 1 -i ./downloads/4f171cb0-9152-11e7-b63a-dd28e8e2d221.jpg -c:v libx264 -t 5 -pix_fmt yuv420p -vf scale=320:240 ./downloads/out12346.mp4; ffmpeg -loop 1 -i ./downloads/5166d910-9152-11e7-b63a-dd28e8e2d221.jpg -c:v libx264 -t 5 -pix_fmt yuv420p -vf scale=320:240 ./downloads/out12345.mp4;');

// var version = shell.exec('node --version', {silent:true}).stdout;

// console.log(cam, 'Done');
// var Snapchat = require('snapchat');
// var Instagram = require('instagram-node').instagram();
// var insta = require('./insta.js');
var InstagramClient = require('instagram-private-api').V1;
var googleToken = require('./googleToken.js');
// var google_refresh_token = config.social.google.refresh_token;

var googleOAuth2Client = new google.auth.OAuth2(
    config.social.google.client_id,
    config.social.google.client_secret,
    config.social.google.redirect_url
);

googleOAuth2Client.setCredentials({
    refresh_token: config.social.google.refresh_token
});

var amazon_client = s3.createClient({
    s3Options: {
        accessKeyId: config.s3_config.ACCESS_KEY,
        secretAccessKey: config.s3_config.SECRECT_KEY,
        region: 'us-west-2'
    }
});

var blobService = azure.createBlobService(config.azure_config.AZURE_STORAGE_ACCOUNT, config.azure_config.AZURE_STORAGE_ACCESS_KEY);
blobService.createContainerIfNotExists('stage', {
    publicAccessLevel: 'blob'
}, function (error, result, response) {
    if (!error) {

    }
});

var aspectRatioSetting = {
    '169': 16 / 9,
    '11': 1,
    '916': 9 / 16
};


// setInterval(function() {
//     googleToken.getTokens(function(result) {

//         console.log('tokens:', result);
//         if (result && result.refresh_token) {
//             google_refresh_token = result.refresh_token;

//             console.log('google refresh token for youtube is ', google_refresh_token);

//             googleOAuth2Client.setCredentials({
//               refresh_token: google_refresh_token
//             });
//         }
//     });
// }, 3600 * 1000);




// var qs = require('querystring');
// var bodyParser = require('body-parser');
// var colors = require('colors');
// var cors = require('cors');
// var express = require('express');
// var logger = require('morgan');
// var request = require('request');

// var app = express();
// app.use(cors());

// app.set('port', process.env.NODE_PORT || 3000);
// app.set('host', process.env.NODE_IP || 'localhost');
// app.use(cors());
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.listen(app.get('port'), app.get('host'), function() {
//   // console.log('Express server listening on port ' + app.get('port'));
// });

// var io1 = require('socket.io').listen(3040);

// var privateKey  = fs.readFileSync('../sslcert/key.pem', 'utf8');
// var certificate = fs.readFileSync('../sslcert/cert.pem', 'utf8');

//var privateKey  = fs.readFileSync('/etc/letsencrypt/live/app.blurbiz.net/privkey.pem', 'utf8');
//var certificate = fs.readFileSync('/etc/letsencrypt/live/app.blurbiz.net/cert.pem', 'utf8');
//var credentials = {key: privateKey, cert: certificate};
//var server = https.createServer(credentials);
var server = http.createServer();

// var io1 = require('socket.io')(server);

var io1 = require('socket.io').listen(server.listen(3040, config.ip, function () {
    console.log('Express server listening on %d, in %s mode', 3040);
}));
// var io1 = require('socket.io')(server).listen(server);
// server.listen(3040);

var emailRegexp = new RegExp("^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?\.)*(?:aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|[a-z][a-z])$")

io1.on('connection', function (socket1) {
    console.log("client connected");

    // var transporter = nodemailer.createTransport({
    //     'service': 'gmail',
    //     'auth': config.mailConfig.auth
    // });

    var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		xoauth2: xoauth2.createXOAuth2Generator({
			user: 'no.reply.blurbiz@gmail.com',
			clientId: '804635358-gefbehbjrm2min0mgq8plmr6pghmk4fs.apps.googleusercontent.com',
			clientSecret: 'IG28lfMVq89PqNTHLACdVgGR',
			refreshToken: '1/dAgx5abWK2jrfdbBPNbQH5k8xajJBhhnblJ3nK4JjMw'
		})
	}
});


    function sendEmail(options, cb) {
        console.log('send email: ' + JSON.stringify(options));
        transporter.sendMail(options, function (error, info) {
            if (error) {
                console.log(error);
                successFalseCb(error, cb);
                return;
            }
            console.log('Message sent: ' + info.response);
            successCb(cb);
        });
    }

    function sendConfirmationEmail(email, link, cb) {
        if (cb == null) {
            throw new Error('no callback in sendConfirmationEmail method');
        }
        console.log('call sendConfirmationEmail method: email = ' + email);

        var template = config.mailConfig.template_signup_confirmation;
        var from = template.from;
        var to = email;
        var subject = template.subject;
        var html = template.html;
        html = html.replace('link_placeholder', link);

        var options = {
            'from': from,
            'to': to,
            'subject': subject,
            'html': html
        }

        sendEmail(options, cb);
    }

    function sendResetPasswordEmail(email, link, cb) {
        if (cb == null) {
            throw new Error('no callback in sendResetPasswordEmail method');
        }
        // console.log('call sendResetPasswordEmail method: email = ' + email);

        var template = config.mailConfig.template_reset_password;
        var from = template.from;
        var to = email;
        var subject = template.subject;
        var html = template.html;
        html = html.replace('link_placeholder', link);

        var options = {
            'from': from,
            'to': to,
            'subject': subject,
            'html': html
        }

        sendEmail(options, cb);
    }

    function updateFields(tableName, tableIdValue, namesAndValuesArray, callback) {
        try {
            // console.log('call method updateFields: tableName = ' + tableName + ', tableIdValue = ' + tableIdValue + ', namesAndValues = ' + JSON.stringify(namesAndValuesArray));
            var names = [];
            var values = [];
            namesAndValuesArray.forEach(function (nameAndValue) {
                names.push(nameAndValue.name);
                values.push("'" + nameAndValue.value + "'");
            });
            var queryText = 'UPDATE public."' + tableName + '" SET (' + names.join(', ') + ') = (' + values.join(', ') + ') WHERE id = ' + tableIdValue + ';';
            // console.log(queryText);
            query(queryText, [], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                } else {
                    successCb(callback);
                }
            });

        } catch (err) {
            // console.log('error in method createEmailConfirmationEntry: ' + err);
            successFalseCb(err, callback);
        }
    }

    function convertObjectToNamesAndValuesArray(object) {
        var namesAndValuesArray = [];

        for (var key in object) {
            if (!object.hasOwnProperty(key)) continue;
            namesAndValuesArray.push({ name: key, value: object[key] });
        }
        return namesAndValuesArray;
    }

    function updateProjectFields(projectId, namesAndValuesArray, cb) {
        updateFields('project', projectId, namesAndValuesArray, cb);
    }

    function updateUserFields(userId, fields, cb) {
        
        var namesAndValuesArray = convertObjectToNamesAndValuesArray(fields);
        query('update public.team set name = $2 where id = $1', [fields.team_id, fields.team_name], function(err, result) {
            
        });
        updateFields('user', userId, namesAndValuesArray, cb);
        
    }

    function updateFBPagesField(userId, message, callback) {

        var fields = { 'selected_fb_pages': message.id };

        query('update public.team set selected_fb_pages = $1 where id in (select team_id from public.user where id = $2);', [message.id, userId], function (err, result) {
            if (err) {
                successFalseCb(err, callback);
            } else {
                successCb(callback);
            }
        });
    }

    function getFBPagesField(userId, callback) {
        query("SELECT * FROM public.team WHERE id in (SELECT team_id FROM public.user WHERE id = $1);", [userId], function (err, result) {
            if (!err) {
                var team = result.rows[0];
                if (!team.selected_fb_pages) {
                    successFalseCb("selected fb pages does not exist", callback);
                    return;
                }
                successCb(callback, {
                    'selected_fb_pages': team.selected_fb_pages
                });
            }
            else {
                successFalseCb("get user failed", callback);
            }
        });
    }

    function getTeamSocialInfo(userId, callback) {
        query("SELECT * FROM public.team WHERE id in (SELECT team_id FROM public.user WHERE id = $1);", [userId], function (err, result) {
            if (!err) {
                var team = result.rows[0];
                if (!team.integrations_and_connections) {
                    successFalseCb("selected fb pages does not exist", callback);
                    return;
                }
                successCb(callback, {
                    'integrations_and_connections': team.integrations_and_connections
                });
            }
            else {
                successFalseCb("get user failed", callback);
            }
        });
    }

    //TODO use connection pool
    function query_pool(text, values, cb) {
        pg.connect(function (err, client, done) {
            client.query(text, values, function (err, result) {
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
                if (err) {
                    console.log(text, values);
                    throw err;
                }
                // disconnect the client
                client.end(function (err) {
                    if (err) throw err;
                });

                cb(err, result);
            });
        });
    }

    function successFalseCb(msg, callback, additionalParams) {
        var result = {
            'success': false,
            'msg': '' + msg
        };
        if (additionalParams) {
            result = mergeJson(result, additionalParams);
        }
        if (callback != null) {
            callback(null, result);
        }
    }

    function mergeJson(obj1, obj2) {
        var result = {};
        for (var key in obj1) result[key] = obj1[key];
        for (var key in obj2) result[key] = obj2[key];
        return result;
    }

    function successCb(callback, additionalParams, separateParams) {
        console.log('Test');
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
                ' VALUES ($1, $2) RETURNING id;', [userId, code], function (err, result) {
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

    function createResetPasswordEntry(userId, code, callback) {
        try {
            console.log('call method createResetPasswordEntry: userId = ' + userId + ', code = ' + code);
            query('INSERT INTO public.reset_password(user_id, code)' +
                ' VALUES ($1, $2) RETURNING id;', [userId, code], function (err, result) {
                    if (err) {
                        successFalseCb(err, callback);
                    } else {
                        successCb(callback);
                    }
                });
        } catch (err) {
            console.log('error in method createResetPasswordEntry: ' + err);
            successFalseCb(err, callback);
        }
    }


    function createUser(email, password, name, company, timezone, is_confirmed, callback) {
        try {
            console.log('call method createUser: email = ' + email + ', name = ' + name);
            isEmailExists(email, function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                    return;
                }
                var isEmailEx = result;
                if (isEmailEx) {
                    successFalseCb('Email ' + email + '  already exists', callback);
                    return;
                }

                // adapt free plan for team monthly_plan
                query('with s as (select id, name, monthly_plan from public.team where name = $4), i as (insert into public.team (name, monthly_plan) select $4, 1 where not exists (select 1 from s) returning id, name, monthly_plan) insert into public.user (email, password, name,  timezone, is_confirmed, team_id) select $1, $2, $3, $5, $6, id from (select id, name, monthly_plan from i union all select id, name, monthly_plan from s ) as tr returning id, created_at;', [email, password, name, company, timezone, is_confirmed], function (err, result) {
                    if (err) {
                        successFalseCb(err, callback);
                    } else {
                        var row = result.rows[0];
                        var userId = row.id;
                        var created_at = row.created_at;
                        successCb(callback, {
                            'user_id': userId,
                            'created_at': created_at
                        });
                    }
                });

            });
        } catch (err) {
            console.log('error in method createUser: ' + err);
            successFalseCb(err, callback);
        }
    }

    function deleteUser(userId, callback) {
        try {
            var asyncTasks = [];
            var teamId = 0;
            asyncTasks.push(function (parallel_callback_1) {
                query('DELETE FROM public.user_services WHERE user_id = $1;', [userId], parallel_callback_1);
            });
            asyncTasks.push(function (parallel_callback_1) {
                query('SELECT id FROM public.project WHERE user_id = $1', [userId], function (err, result) {
                    if (!err) {
                        var asyncTasks2 = [];
                        result.rows.forEach(function (row) {
                            asyncTasks2.push(function (parallel_callback2) {
                                deleteProject(row.id, parallel_callback2);
                            });
                        });

                        async.parallel(asyncTasks2, parallel_callback_1);
                    }
                });
            });
            asyncTasks.push(function (parallel_callback_1) {
                query('DELETE FROM public.task WHERE user_id = $1', [userId], parallel_callback_1);
            });
            asyncTasks.push(function (parallel_callback_1) {
                query('SELECT team_id FROM public.user WHERE id = $1', [userId], function (err, result) {
                    if (!err) {
                        teamId = result.rows[0].team_id;
                    }
                    successCb(parallel_callback_1)
                });
            });

            async.parallel(asyncTasks, function (err, results) {
                if (err) {
                    successFalseCb(err, callback);
                }
                else {
                    query('DELETE FROM public.user WHERE id = $1;', [userId], function (err, result) {
                        if (err) {
                            successFalseCb(err, callback);
                        }
                        else {
                            successCb(callback, {
                                'userId': userId,
                                'teamId': teamId
                            });
                        }
                    });
                }

            });

        } catch (err) {
            successFalseCb(err, callback);
        }

    }

    function changeProjectTitle(projectInfo, callback) {
        try {
            var fields = [{ name: 'project_name', value: projectInfo.title }];
            updateFields('project', projectInfo.project_id, fields, function (err1, result1) {
                if (err1) {
                    successFalseCb(err1, callback);
                    return;
                }
                successCb(callback);
            });
        } catch (err) {
            console.log('error in method updateTask: ' + err);
            successFalseCb(err, callback);
        }
    }

    function setMediaDeletedColumnAs(mediaInfo, callback) {
        try {
            var fields = [{ name: 'deleted', value: mediaInfo.value }];
            updateFields('media_file', mediaInfo.id, fields, function (err1, result1) {
                if (err1) {
                    successFalseCb(err1, callback);
                    return;
                }
                successCb(callback, { id: mediaInfo.id, value: mediaInfo.value });
            });
        } catch (err) {
            console.log('error in method updateTask: ' + err);
            successFalseCb(err, callback);
        }
    }

    function changeProjectRatio(projectInfo, callback) {
        try {
            var fields = [{ name: 'ratio', value: projectInfo.ratio }];
            updateFields('project', projectInfo.project_id, fields, function (err1, result1) {
                if (err1) {
                    successFalseCb(err1, callback);
                    return;
                }
                successCb(callback);
            });
        } catch (err) {
            console.log('error in method updateTask: ' + err);
            successFalseCb(err, callback);
        }
    }

    function createTextOverlay(textOverlay, callback) {
        try {
            query('INSERT INTO public.text_overlay(media_id, content, o_width, o_height, o_left, o_top, o_degree) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;', [textOverlay.media_id, textOverlay.content, textOverlay.o_width, textOverlay.o_height, textOverlay.o_left, textOverlay.o_top, textOverlay.o_degree], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                } else {
                    var row = result.rows[0];
                    successCb(callback, {
                        'id': row.id
                    });
                }
            });
        } catch (err) {
            console.log('error in method create text_overlay: ' + err);
            successFalseCb(err, callback);
        }
    }

    function updateTextOverlay(textOverlay, callback) {
        try {
            if(textOverlay.overlay_type == 'png') {
                updateFields('text_overlay', textOverlay.id, [
                {
                    'name': 'media_id',
                    'value': textOverlay.media_id
                },
                {
                    'name': 'content',
                    'value': textOverlay.content
                },
                {
                    'name': 'time_range',
                    'value': textOverlay.time_range
                },
                {
                    'name': 'o_width',
                    'value': Math.floor(textOverlay.o_width)
                },
                {
                    'name': 'o_height',
                    'value': Math.floor(textOverlay.o_height)
                },
                {
                    'name': 'o_left',
                    'value': Math.floor(textOverlay.o_left)
                },
                {
                    'name': 'o_top',
                    'value': Math.floor(textOverlay.o_top)
                },
                {
                    'name': 'o_degree',
                    'value': textOverlay.o_degree
                }
                ], function (err, result) {
                    if (err) {
                        successFalseCb(err, callback);
                    } else {

                        successCb(callback);
                    }
                });
            } else {
                updateFields('text_overlay', textOverlay.id, [
                {
                    'name': 'media_id',
                    'value': textOverlay.media_id
                },
                {
                    'name': 'content',
                    'value': textOverlay.content
                },
                {
                    'name': 'time_range',
                    'value': textOverlay.time_range
                },
                {
                    'name': 'o_width',
                    'value': Math.floor(textOverlay.o_width)
                },
                {
                    'name': 'o_height',
                    'value': Math.floor(textOverlay.o_height)
                },
                {
                    'name': 'o_left',
                    'value': Math.floor(textOverlay.o_left)
                },
                {
                    'name': 'o_top',
                    'value': Math.floor(textOverlay.o_top)
                },
                {
                    'name': 'o_degree',
                    'value': textOverlay.o_degree
                },
                {
                    'name': 'base64',
                    'value': textOverlay.base64
                }
            ], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                } else {
                    successCb(callback);
                }
            });

        } 
    }   catch (err) {
            console.log('error in method update text_overlay: ' + err);
            successFalseCb(err, callback);
        }
    }

    function deleteTextOverlay(id, callback) {

        query('DELETE FROM public.text_overlay WHERE id = $1;', [id], function (err, result) {
            if (err) {
                successFalseCb(err, callback);
            } else {
                successCb(callback);
            }
        });
    }

    function createProject(userId, projectName, callback) {
        try {
            console.log('call method createProject: userId = ' + userId + ', projectName = ' + projectName);
            isProjectExists(userId, projectName, function (err, result) {
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
                    ' VALUES ($1, $2) RETURNING id;', [userId, projectName], function (err, result) {
                        if (err) {
                            successFalseCb(err, callback);
                        } else {
                            var row = result.rows[0];
                            var newProjectId = row.id;
                            console.log('Deepak');
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
            query('SELECT path FROM public.media_file WHERE project_id = $1;', [projectId], function (err, result) {
                if (!err) {
                    // for (var i = 0; i < result.rows.length; i++) {
                    //     var row = result.rows[i];
                    //     deleteImage(row.file_path, null);
                    // }



                    var asyncTasks = [];
                    result.rows.forEach(function (row) {
                        asyncTasks.push(function (parallel_callback) {
                            deleteImage(row.path, parallel_callback);
                        });
                    });

                    async.parallel(asyncTasks, function () {
                        query('DELETE FROM public.project WHERE id = $1;', [projectId], function (err, result) {
                            if (err) {
                                successFalseCb(err, callback);
                            } else {
                                successCb(callback);
                            }
                        });
                    });
                }
            });


        } catch (err) {
            // console.log('error in method deleteProject: ' + err);
            successFalseCb(err, callback);
        }
    }

    function deleteImage(file_path, callback) {
        try {
            var parallelTasks = [];
            // parallelTasks.push(function(parallel_callback) {
            // var deleteParam = {
            //     Bucket: config.s3_config.BUCKET_NAME,
            //     Delete: {
            //         Objects: [
            //             {
            //                 Key: path.basename(file_path)
            //             }
            //         ]
            //     }
            // };

            // var deleter = amazon_client.deleteObjects(deleteParam);

            // deleter.on('error', function (err) {
            //     console.error("unable to delete:", err.stack);
            //     parallel_callback(err);
            // });

            // deleter.on('progress', function () {
            //     console.log("progress", deleter.progressAmount, deleter.progressTotal);
            // });

            // deleter.on('end', function () {
            //     console.log("File Deleted", file_path);
            //     parallel_callback();

            // });
            // });

            parallelTasks.push(function (parallel_callback) {

                query('DELETE FROM public.text_overlay WHERE media_id in (SELECT id FROM public.media_file WHERE path = $1)', [file_path], function (err, result) {
                    if (err) {
                        parallel_callback(err);
                    } else {
                        parallel_callback();
                    }
                });
            });
            async.parallel(parallelTasks, function (err, results) {
                if (err) {
                    successFalseCb(err, callback);
                } else {
                    query('DELETE FROM public.media_file WHERE path = $1;', [file_path], function (err, result) {
                        if (err) {
                            successFalseCb(err, callback);
                        } else {
                            successCb(callback);
                        }
                    });
                }
            });

        } catch (err) {
            // console.log('error in method deleteImage: ' + err);
            successFalseCb(err, callback);
        }
    }

    function deleteMedia(id, callback) {
        query('SELECT * from public.media_file WHERE id = $1', [id], function (err, result) {
            if (err) {
                successFalseCb(err, callback);
            } else {
                // if (result.rows[0].path) {
                //     var deleteParam = {
                //         Bucket: config.s3_config.BUCKET_NAME,
                //         Delete: {
                //             Objects: [
                //                 {
                //                     Key: path.basename(result.rows[0].path)
                //                 }
                //             ]
                //         }
                //     };

                //     var deleter = amazon_client.deleteObjects(deleteParam);

                //     deleter.on('error', function (err) {
                //         console.error("unable to delete:", err.stack);
                //     });

                //     deleter.on('progress', function () {
                //         console.log("progress", deleter.progressAmount, deleter.progressTotal);
                //     });

                //     deleter.on('end', function () {
                //         console.log("File Deleted");
                //     });  
                // }

                query('DELETE FROM public.text_overlay WHERE media_id = $1;', [id], function (err, result) {
                    if (err) {
                        successFalseCb(err, callback);
                    } else {
                        query('DELETE FROM public.media_file WHERE id = $1;', [id], function (err, result) {
                            if (err) {
                                successFalseCb(err, callback);
                            } else {
                                successCb(callback, { id: id });
                            }
                        });
                    }
                });


            }
        });
    }

    function cloneMedia(message, callback) {
        query('SELECT * FROM public.media_file WHERE id = $1', [message.id], function (err, result) {
            if (err) {
                successFalseCb(err, callback);
            } else {
                var row = result.rows[0];
                if (!row) {
                    successFalseCb('There is no such media file', callback);
                    return;
                } else {
                    var azurePath = "https://blurbizstagdiag910.blob.core.windows.net/stage/";
                    var newPath = row.path.replace(azurePath, "");
                    var ratio169 = azurePath + '169'+ newPath;
                    var ratio916 = azurePath + '916'+ newPath;
                    var ratio11 = azurePath + '11'+ newPath;
                    query('INSERT INTO public.media_file (project_id, path, resolution, name, youtube_data, representative, range, deleted, duration, ratio169, ratio11, ratio916, crop_data, updated_files) VALUES ($1, $2, $3, $4, $5, $6, $7, 2, $8, $9, $10, $11, $12, $13) RETURNING id, project_id, path, resolution, name, youtube_data, representative, range, ratio169, ratio11, ratio916, deleted;', [row.project_id, row.path, row.resolution, row.name + ' (Clone)', row.youtube_data, row.representative, row.range, row.duration, ratio169, ratio11, ratio916, row.crop_data, row.updated_files], function (err, result) {
                        if (err) {
                            successFalseCb(err, callback);
                        } else {
                            var row = result.rows[0];
                            if (!row) {
                                successFalseCb('insert clonee failed', callback);
                            } else {
                                successCb(callback, {
                                    'path': row.path,
                                    'name': row.name,
                                    'resolution': row.resolution,
                                    'id': row.id,
                                    'guid': message.guid,
                                    'deleted': row.deleted,
                                    'range': row.range,
                                    'ratio169': row.ratio169,
                                    'ratio11': row.ratio11,
                                    'ratio916': row.ratio916
                                });
                            }
                        }
                    })
                }

                // -- Developer
                // var newFilename = uuidGen.v1() + '.' + row.path.split('.').pop();

                // var copyParam = {
                //     Bucket: config.s3_config.BUCKET_NAME,
                //     CopySource: config.s3_config.BUCKET_NAME + '/' + row.path.split('/').pop(),
                //     Key: newFilename
                // }

                // var cloner = amazon_client.copyObject(copyParam);

                // cloner.on('error', function(err){
                //     console.error("unable to clone", err.stack);
                //     successFalseCb(err, callback);
                // });

                // cloner.on('progress', function() {
                //     console.log("progress");
                // });

                // cloner.on('end', function() {
                //     cloneePath = s3.getPublicUrl(config.s3_config.BUCKET_NAME, newFilename, "");
                //     cloneePath = cloneePath.replace('s3', 's3-us-west-2');
                //      //Insert Query
                // });
                // Changes Commit By Developer

                // amazon_client.copyObject(copyParam, function(err, data) {
                //     if (err) {
                //         successFalseCb(err, callback);
                //     } else {
                //         cloneePath = s3.getPublicUrl(config.s3_config.BUCKET_NAME, newFilename, "");
                //         cloneePath = cloneePath.replace('s3', 's3-us-west-2');

                //         query('INSERT INTO public.media_file (project_id, path, resolution, name, youtube_data, representative, range, deleted) VALUES ($1, $2, $3, $4, $5, $6, $7, 2) RETURNING id, project_id, path, resolution, name, youtube_data, representative, range, deleted;', [row.project_id, cloneePath, row.resolution, row.name + ' (Clone)', row.youtube_data, row.representative, row.range], function(err, result) {
                //             if (err) {
                //                 successFalseCb(err, callback);
                //             } else {
                //                 var row = result.rows[0];
                //                 if (!row) {
                //                     successFalseCb('insert clonee failed', callback);
                //                 } else {
                //                     successCb(callback, {
                //                         'path': row.path,
                //                         'name': row.name,
                //                         'resolution': row.resolution,
                //                         'id': row.id,
                //                         'guid': message.guid,
                //                         'deleted': row.deleted,
                //                         'range': row.range
                //                     });
                //                 }
                //             }
                //         })
                //     }
                // });
            }
        });
    }

    function deleteEmailConfirmationEntry(userId, callback) {
        try {
            // console.log('call method deleteEmailConfirmationEntry: userId = ' + userId);
            query('DELETE FROM public.email_confirmation WHERE user_id = $1;', [userId], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                } else {
                    successCb(callback);
                }
            });
        } catch (err) {
            // console.log('error in method deleteEmailConfirmationEntry: ' + err);
            successFalseCb(err, callback);
        }
    }

    function deleteResetPasswordEntry(userId, callback) {
        try {
            // console.log('call method deleteResetPasswordEntry: userId = ' + userId);
            query('DELETE FROM public.reset_password WHERE user_id = $1;', [userId], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                } else {
                    successCb(callback);
                }
            });
        } catch (err) {
            // console.log('error in method deleteResetPasswordEntry: ' + err);
            successFalseCb(err, callback);
        }
    }

    function confirmateEmail(userId, code, callback) {
        try {
            // console.log('call method confirmateEmail: userId = ' + userId + ', code = ' + code);
            query('SELECT count(*) FROM public.email_confirmation WHERE user_id = $1 and code = $2;', [userId, code], function (err, result) {
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
                        ], function (err1, result1) {
                            if (err1) {
                                successFalseCb(err1, callback);
                                return;
                            }
                            deleteEmailConfirmationEntry(userId, function (err2, result2) {
                                if (err2) {
                                    successFalseCb(err2, callback);
                                    return;
                                }
                                successCb(callback);
                            });
                        });
                    }
                }
            });
        } catch (err) {
            // console.log('error in method confirmateEmail: ' + err);
            successFalseCb(err, callback);
        }
    }


    function projectList(userId, callback) {
        try {
            console.log('call method projectList: userId = ' + userId);

            query('SELECT DISTINCT ON(t.id) t.*, media_file.path  FROM ( SELECT project.id AS id, project.project_name, COUNT(media_file.path) as screen_count, project.created_at, project.result_video FROM public.project AS project LEFT JOIN public.media_file AS media_file ON project.id = media_file.project_id AND media_file.deleted = 0 WHERE project.user_id in ( select id from public.user where team_id in (select team_id from public.user where id = $1)) GROUP By project.id) AS t LEFT JOIN public.media_file AS media_file ON media_file.project_id = t.id AND media_file.order_in_project = (SELECT MIN(order_in_project) FROM media_file WHERE media_file.project_id = t.id AND media_file.deleted = 0) ORDER BY t.id, media_file.id ASC;', [userId], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                } else {
                    var projects = [];
                    for (var i = 0; i < result.rows.length; i++) {
                        var row = result.rows[i];
                        var project = {
                            'project_id': row.id,
                            'project_name': row.project_name,
                            'screen_count': row.screen_count,
                            'representative': row.path,
                            'resolution': row.resolution,
                            'created_at': row.created_at,
                            'result_video': row.result_video
                        };
                        projects.push(project);
                    }

                    successCb(callback, {
                        'projects': projects
                    });
                }
            });
        } catch (err) {
            // console.log('error in method projectList: ' + err);
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
            isEmailExists(email, function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                    return;
                }
                var isEmailEx = result;
                if (!isEmailEx) {
                    successFalseCb('Email ' + email + ' doesn\'t registered', callback);
                    return;
                } else {
                    getUserInfo(email, function (err, user) {
                        if (err) {
                            successFalseCb(err, callback);
                            return;
                        }
                        if (user.is_enabled != 1) {
                            successFalseCb('You cannot login with your mail and password now, please ask to Administrator.', callback);
                            return;
                        }
                        //console.log(JSON.stringify(user));
                        if (user.password == password) {
                            var msg = null;
                            if (user.is_confirmed == false) {
                                msg = 'waiting for email confirmation';
                            }

                            query('update public.user set last_login_date=CURRENT_TIMESTAMP where id = $1', [user.id], function (err, result) {
                                if (err) {
                                    successFalseCb('cannot set last login date', callback);
                                    return;
                                }
                                else {
                                    successCb(callback, {
                                        'is_confirmed': user.is_confirmed,
                                        'msg': msg,
                                        'token': getToken(user)
                                    });
                                }
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
            query('select u.*, t.name as company, snapchat, facebook, twitter, instagram, pinterest from (select * from public.user u where LOWER(u.email) = LOWER($1)) as u left join public.team t on u.team_id = t.id', [email], function (err, result) {
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

    function getTaskList(user_id, callback) {
        console.log('call method getTaskList: user_id = ' + user_id);
        try {
            /** Golden Code

            query('select t2.path, t1.* from public.task t1 join ( select t1.*, t2.path from  ( select t1.id, t1.project_id, min(t2.id) media_id from (          select t1.id, t1.project_id, min(t2.order_in_project) order_in_project from public.task t1 left join public.media_file t2 on t1.project_id=t2.project_id group by t1.id, t1.project_id ) t1 left join public.media_file t2 on t1.project_id=t2.project_id and t1.order_in_project=t2.order_in_project group by t1.id, t1.project_id ) t1 left join public.media_file t2 on t1.media_id=t2.id ) t2 on t1.id=t2.id where t1.user_id=$1 order by t1.id', [user_id], function (err, result) {

            */

            query('select * from public.task where user_id = $1', [user_id], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                    return;
                }
                successCb(callback, {
                    'tasks': result.rows
                });
            });
        } catch (err) {
            console.log('error in method getTaskList: ' + err);
            successFalseCb(err, callback);
        }
    }

    function getTeamTaskList(user_id, callback) {
        console.log('call method getTaskList: user_id = ' + user_id);
        try {
            query('with tasks as (select * from public.task where user_id in ( select id from public.user where team_id in ( select team_id from public.user where id = $1) ) ) select t.*, u.photo as user_photo, u.name as user_name from tasks as t left join public.user as u on t.user_id = u.id', [user_id], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                    return;
                }
                successCb(callback, {
                    'tasks': result.rows
                });
            });
        } catch (err) {
            console.log('error in method getTaskList: ' + err);
            successFalseCb(err, callback);
        }
    }

    function scheduleTask(user_id, projectId, scheduledStartDate, targetNetwork, title, description, access_token, oauth_token_secret, project_image, isShareNow, board, callback) {
        try {
            console.log('call method scheduleTask: user_id = ' + user_id + ' , projectId = ' + projectId + ', scheduledStartDate: ' + scheduledStartDate + ', targetNetwork: ' + targetNetwork + ', title: ' + title + ', description: ' + description + ', board: ' + board);



            query('INSERT INTO public.task (project_id, scheduled_start_date, target_social_network, title, description,user_id, img_path, board , social_notes) select $1, $2, $3, $4, $5,$6, $7, $8 , selected_fb_pages from (select selected_fb_pages from public.team where id in (select team_id from public.user where id = $6)) as u RETURNING id, social_notes;', [projectId, scheduledStartDate, targetNetwork, title, description, user_id, project_image, board], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                } else {
                    var row = result.rows[0];
                    if (row != null) {
                        share({
                            id: row.id,
                            user_id: user_id,
                            date: scheduledStartDate,
                            share: targetNetwork,
                            title: title,
                            description: description,
                            access_token: access_token,
                            oauth_token_secret: oauth_token_secret,
                            project_image: project_image,
                            isShareNow: isShareNow,
                            social_notes: row.social_notes,
                            board: board
                        });

                        successCb(callback, {
                            'task_id': row.id
                        });
                    } else {
                        successFalseCb('result row is null for the query', callback);
                    }
                }
            });
        } catch (err) {
            console.log('error in method scheduleTask: ' + err);
            successFalseCb(err, callback);
        }
    }

    function updateTask(task_id, user_id, projectId, scheduledStartDate, targetNetwork, title, description, access_token, oauth_token_secret, isShareNow, project_image, board, callback) {
        try {
            var date = new Date(scheduledStartDate);
            var date_secondslater = new Date(scheduledStartDate);
            date_secondslater.setSeconds(date_secondslater.getSeconds() + 60);

            var isShareNow = (date_secondslater > new Date()) ? true : false;
            var isfinished = (date > new Date()) ? false : true;

            // console.log('date:' + date.toString());
            // console.log('isfinished:' + isfinished);
            // console.log('isShareNow:' + isShareNow);
            console.log('call method updateTask: task_id = ' + task_id + ' , user_id = ' + user_id + ' , projectId = ' + projectId + ', scheduledStartDate: ' + scheduledStartDate + ', targetNetwork: ' + targetNetwork + ', title: ' + title + ', description: ' + description + ', board: ' + board);



            query('update public.task as t set social_notes = u.selected_fb_pages, title = $1, target_social_network = $2, scheduled_start_date = $3, description = $4, img_path = $5, is_finished = $6 , board = $8 from (select u.*, t.selected_fb_pages from public.user as u join public.team as t on t.id = u.team_id ) as u where t.user_id = u.id and t.id = $7 returning t.*;', [title, targetNetwork, scheduledStartDate, description, project_image, isfinished, task_id, board], function (err1, result1) {
                if (err1) {
                    successFalseCb(err1, callback);
                    return;
                }

                console.log('scheduled date: ', date);
                console.log('current date: ', (new Date()).toString());
                console.log('isShareNow: ', isShareNow);

                if (date > new Date() || isShareNow)
                    share({
                        id: task_id,
                        user_id: user_id,
                        date: scheduledStartDate,
                        share: targetNetwork,
                        title: title,
                        description: description,
                        access_token: access_token,
                        oauth_token_secret: oauth_token_secret,
                        isShareNow: isShareNow,
                        project_image: project_image,
                        social_notes: result1.rows[0].social_notes,
                        board: board
                    });
                successCb(callback);
            });

        } catch (err) {
            console.log('error in method updateTask: ' + err);
            successFalseCb(err, callback);
        }
    }

    function share(item) {
        console.log('sharing Item');
        var date = new Date(item.date);

        // cancel old schedule
        if (schedules[item.id]) {
            schedules[item.id].cancel();
            schedules[item.id] = null;
        }


        switch (item.share) {
            case 'facebook':
                if (date < new Date())
                    share_facebook(item);
                else
                    schedules[item.id] = scheduleShare(new Date(item.date), function () {
                        share_facebook(item);
                    });
                break;
            case 'twitter':
                if ((date < new Date()) || item.isShareNow) {
                    share_twitter(item);
                } else {
                    schedules[item.id] = scheduleShare(new Date(item.date), function () {
                        console.log('twitter share running by schedule!!!');
                        share_twitter(item);
                    });
                }
                break;
            case 'pinterest':
                if ((date < new Date()) || item.isShareNow) {
                    share_pinterest(item);
                } else {
                    schedules[item.id] = scheduleShare(new Date(item.date), function () {
                        console.log('twitter share running by schedule!!!');
                        share_pinterest(item);
                    });
                }
                break;
            case 'snapchat':
                if (date < new Date())
                    share_snapchat(item);
                else
                    schedules[item.id] = scheduleShare(new Date(item.date), function () {
                        share_snapchat(item);
                    });
                break;
            case 'instagram':
                if (date < new Date())
                    share_instagram(item);
                else
                    schedules[item.id] = scheduleShare(new Date(item.date), function () {
                        share_instagram(item);
                    });
                break;
        }


    }

    function scheduleShare(date, callback) {
        var j = schedule.scheduleJob(date, callback);
        return j;
    }

    function share_facebook(item) {
        console.log('Sharing on facebook');

        var callback = function (res) {

            if (!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                console.log("Facebook error! :\n");
                socket1.emit('scheduled_share_response', { success: false });
                if (item.isShareNow) {
                    console.log('sending share_now_response');
                    socket1.emit('share_now_response', { success: false });
                }
                return;
            }
            console.log('Shared facebook , Post Id: ' + res.id);
            updateFields('task', item.id, [{ name: 'is_finished', value: true }], function () {
                //we need to send to server asynchronously to update task / posts list
                console.log('sending scheduled_share_response');
                socket1.emit('scheduled_share_response', { success: true });
                if (item.isShareNow) {
                    console.log('sending share_now_response');
                    socket1.emit('share_now_response', { success: true });
                }
            });
        };

        FB.api('oauth/access_token', {
            client_id: config.social.facebook.client_id,
            client_secret: config.social.facebook.client_secret,
            grant_type: 'client_credentials'
        }, function (res) {
            if (!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                return;
            }

            var facebook_notes = item.social_notes.split(",");
            if (!facebook_notes || (facebook_notes.length != 2) || (facebook_notes[0] == "me")) {
                item.social_notes = "me";
            }
            else {
                item.social_notes = facebook_notes[0];
                item.access_token = facebook_notes[1];
            }

            FB.setAccessToken(item.access_token);

            if (item.project_image) {
                var bufferLength = 100000;
                var theBuffer = new Buffer(bufferLength);
                var finished, offset, segment_index;
                finished = 0;
                offset = 0;
                segment_index = 0;

                // We need to download the image to our "downloads" directory and upload it to Twitter
                var dir = './downloads';
                var pathArr = item.project_image ? item.project_image.split('/') : [];
                var pathImg = 'downloads/' + pathArr[pathArr.length - 1];

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }

                request
                    .get(item.project_image)
                    .on('error', function (err) {
                        console.log('Download from S3 error: ', err);
                    })
                    .pipe(fs.createWriteStream(pathImg))
                    .on('finish', function () {
                        var buffer = readChunk.sync(pathImg, 0, 262);
                        var type = fileType(buffer);

                        if (type.mime.includes("video/")) {
                            FB.api("/" + item.social_notes + "/videos", "POST", {
                                file_url: item.project_image,
                                description: item.description
                            }, callback);
                        }
                        else if (type.mime.includes("image/")) {
                            FB.api("/" + item.social_notes + "/photos", "post", {
                                caption: item.description,
                                url: item.project_image
                            }, callback)
                        }
                        else {
                            console.log("Undetectable media");
                            callack({ error: 'Undetectable media' });
                        }

                    });
            }
            else {
                FB.api("/" + item.social_notes + "/feed", 'post', {
                    message: item.description
                }, callback);
            }
        });
    }

    function share_post_twitter(client, tweetParams, item) {

        console.log('share_twitter_2', tweetParams);

        client.post('statuses/update', tweetParams, function (error, tweet, response) {
            if (error) {
                console.log("Twitter error! :\n");
                console.log(error);
                socket1.emit('scheduled_share_response', { success: false });
                if (item.isShareNow) {
                    console.log('sending share_now_response');
                    socket1.emit('share_now_response', { success: false });
                }
            }

            console.log('shared twitter');
            // console.log(item);
            // console.log(tweet);
            // console.log(response);
            updateFields('task', item.id, [{ name: 'is_finished', value: true }], function () {
                //we need to send to server asynchronously to update task / posts list
                console.log('sending scheduled_share_response');
                socket1.emit('scheduled_share_response', { success: true });
                if (item.isShareNow) {
                    console.log('sending share_now_response');
                    socket1.emit('share_now_response', { success: true });
                }
            });
        });
    }



    function share_twitter(item) {
        console.log('share_twitter_1');

        var client = new Twit({
            consumer_key: config.social.twitter.consumer_key,
            consumer_secret: config.social.twitter.consumer_secret,
            access_token: item.access_token,
            access_token_secret: item.oauth_token_secret
        });

        if (item.project_image) {
            var bufferLength = 100000;
            var theBuffer = new Buffer(bufferLength);
            var finished, offset, segment_index;
            finished = 0;
            offset = 0;
            segment_index = 0;

            // We need to download the image to our "downloads" directory and upload it to Twitter
            var dir = './downloads';
            var pathArr = item.project_image ? item.project_image.split('/') : [];
            var pathImg = 'downloads/' + pathArr[pathArr.length - 1];

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            request
                .get(item.project_image)
                .on('error', function (err) {
                    console.log('Download from S3 error: ', err);
                })
                .pipe(fs.createWriteStream(pathImg))
                .on('finish', function () {
                    client.postMediaChunked({ file_path: pathImg }, function (err, data, response) {

                        var tweetParams = {
                            status: item.description
                        };

                        if (!err) {
                            tweetParams.media_ids = data.media_id_string;
                        }

                        share_post_twitter(client, tweetParams, item);
                    })

                });

        } else {

            var tweetParams = {
                status: item.description
            };
            share_post_twitter(client, tweetParams, item);
        }

    }

    function get_pinterest_boards(item, callback) {
        console.log('call method get_pinterest_boards');
        console.log(item.access_token);
        var pinterest = PDK.init(item.access_token);
        var options = {
            qs: { fields: "id,name,url,image" }
        };
        pinterest.api('me/boards', options).then(function (json) {
            successCb(callback, {
                'data': json.data
            });
        });
    }

    function create_pinterest_boards(item, callback) {
        console.log('call method create_pinterest_boards');
        console.log(item.access_token);
        var pinterest = PDK.init(item.access_token);
        var options = {
            qs: { fields: "id,name,url,image" }
        };
        pinterest.api('boards', {
            method: 'POST',
            body: {
                name: item.name
            }
        }).then(function (json) {
            pinterest.api('me/boards', options).then(function (json) {
                successCb(callback, {
                    'data': json.data
                });
            });
        });
    }


    function share_pinterest(item) {

        var pinterest = PDK.init(item.access_token);
        var body = {
            note: item.description,
            link: item.project_image
        };

        async.series([
            function (series_callback) {
                if (item.project_image) {
                    if (isVideo(item.project_image)) {
                        query('SELECT * FROM public.media_file WHERE path = $1', [item.project_image], function (err, result) {
                            if (err) {
                                series_callback(err);
                            }
                            else if (result.rows[0] && result.rows[0].youtube_data) {
                                var youtube_data = JSON.parse(result.rows[0].youtube_data);

                                googleOAuth2Client.refreshAccessToken(function (err, tokens) {

                                    checkYoutubeDetails(JSON.stringify({ id: youtube_data.id }), tokens.access_token, function (res) {

                                        console.log('Share Pinterest - Checking Youtube Data');
                                        if (res.error) {
                                            series_callback('youtube_data is still in progress');
                                        } else {
                                            body.link = "https://www.youtube.com/watch?v=" + youtube_data.id + '&feature=share';
                                            body.image_url = youtube_data.snippet.thumbnails.high.url;
                                            series_callback();
                                        }
                                    });

                                });

                            }
                            else {
                                series_callback('youtube_data did not set');
                            }
                        });
                    }
                    else if (isImage(item.project_image)) {
                        body.image_url = item.project_image;
                        series_callback();
                    }
                }
                else {
                    series_callback();
                }
            }, function (series_callback) {
                //pinterest.api('me/boards').then(function(json) {
                body.board = item.board // grab the selected board 
                // console.log('pinterest body');
                // console.log(body);
                try {
                    pinterest.api('pins', {
                        method: 'POST',
                        body: body
                    }).then(function (json) {
                        // pinterest.api('me/pins').then(console.log);

                        if (!json.data) {
                            socket1.emit('scheduled_share_response', { success: false });
                            if (item.isShareNow) {
                                console.log('sending share_now_response');
                                socket1.emit('share_now_response', { success: false });
                            }
                            return series_callback();
                        }

                        updateFields('task', item.id, [{ name: 'is_finished', value: true, board: body.board }], function () {
                            //we need to send to server asynchronously to update task / posts list
                            console.log('sending scheduled_share_response');
                            socket1.emit('scheduled_share_response', { success: true });
                            if (item.isShareNow) {
                                console.log('sending share_now_response');
                                socket1.emit('share_now_response', { success: true });
                            }
                            series_callback();
                        });
                    });
                } catch (err) {
                    console.log(err);
                    socket1.emit('scheduled_share_response', { success: false });
                    if (item.isShareNow) {
                        console.log('sending share_now_response');
                        socket1.emit('share_now_response', { success: false });
                    }
                    return series_callback();
                }

                //});
            }]);

    }

    function share_snapchat(item) {
        var userInfo = JSON.parse(decodeURIComponent(item.access_token)),
            username = userInfo.username,
            authToken = userInfo.authToken;

        query('SELECT m.* from public.media_file AS m, public.task AS t WHERE m.project_id = t.project_id AND t.id = $1', [item.id], function (err, result) {
            if (err) {
                socket1.emit('scheduled_share_response', { success: false });
                if (item.isShareNow) {
                    console.log('sending share_now_response');
                    socket1.emit('share_now_response', { success: false });
                }
                return;
            }
            var media_files = result.rows;
            var asyncTasks = [];
            media_files.forEach(function (medium) {
                asyncTasks.push(function (parallel_callback) {
                    shareWithSnapchat(username, authToken, medium.path, parallel_callback);
                });
            });

            async.series(asyncTasks, function (err, results) {
                if (err) {
                    socket1.emit('scheduled_share_response', { success: false });
                    if (item.isShareNow) {
                        console.log('sending share_now_response');
                        socket1.emit('share_now_response', { success: false });
                    }
                }
                else {
                    updateFields('task', item.id, [{ name: 'is_finished', value: true }], function () {
                        console.log('sending scheduled_share_response');
                        socket1.emit('scheduled_share_response', { success: true });
                        if (item.isShareNow) {
                            console.log('sending share_now_response');
                            socket1.emit('share_now_response', { success: true });
                        }
                    });
                }
            });
        });
    }

    function share_instagram(item) {

        var userInfo = JSON.parse(decodeURIComponent(item.access_token)),
            username = userInfo.username,
            password = userInfo.password;


        shareWithInstagram(username, password, item.description, item.project_image, function (res) {
            if (res == "OK") {
                console.log('shared instagram');
                console.log(item);
                updateFields('task', item.id, [{ name: 'is_finished', value: true }], function () {
                    console.log('sending scheduled_share_response');
                    socket1.emit('scheduled_share_response', { success: true });
                    if (item.isShareNow) {
                        console.log('sending share_now_response');
                        socket1.emit('share_now_response', { success: true });
                    }
                });
            }
            else {
                socket1.emit('scheduled_share_response', { success: false });
                if (item.isShareNow) {
                    console.log('sending share_now_response');
                    socket1.emit('share_now_response', { success: false });
                }
            }
        });
    }


    function deleteTask(taskId, callback) {
        try {
            console.log('call method deleteTask: taskId = ' + taskId);
            query('DELETE FROM public.task WHERE id = $1;', [taskId], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                } else {
                    successCb(callback);

                }
            });
        } catch (err) {
            console.log('error in method deleteTask: ' + err);
            successFalseCb(err, callback);
        }
    }

    function saveGoogleFile(message, callback) {


        googleDrive(message.accessToken).files(message.fileId).get(function (err, response, body) {
            if (err) return console.log('err', err);
            if (response.statusCode != 200) return console.log('Error happened', response.statusCode);
            // console.log('response', response);
            // console.log('body', JSON.parse(body));

            saveMediaFile(message.project_id, JSON.parse(body).thumbnailLink.split("=s")[0], callback);
        });
    }

    function putMediaToAzure(filename, localUrl, callback) {
        blobService.createBlockBlobFromLocalFile(
            'stage',
            filename,
            localUrl,
            function (error, result, response) {
                if (error) {
                    successFalseCb(error, callback);
                } else {
                    var uploadedPath = "https://" + config.azure_config.AZURE_STORAGE_ACCOUNT + ".blob.core.windows.net/stage/" + filename;
                    // console.log("FILE UPLOADED", uploadedPath);
                    successCb(callback, { mediaPath: uploadedPath});
                }
            }
        );
    }

    function putMediaToS3bucketAndSaveToDB(properties, filename, callback, token) {
        console.log(properties);
        // var project_id = properties.project_id;
        // var order_in_project = properties.order_in_project;

        var buffer = readChunk.sync('./uploads/' + filename, 0, 262);
        var mimeType = mime.lookup(filename);
        // console.log(mimeType);
        var type = fileType(buffer);
        // console.log(properties, type, 'Sap');
        // console.log('Mine Type', mimeType);
        if (!mimeType || !(mimeType.includes("video/") || mimeType.includes("image/"))) {
            successFalseCb("unsupported file", callback);
            return;
        }
        var ext = mime.extension(mimeType);
        var newFilename = uuidGen.v1() + '.' + ext;
        var resolution = '';

        async.series([

            function (series_callback) {
                if (mimeType.includes("video/")) {

                    console.log(filename);
                    ffmpeg.ffprobe('./uploads/' + filename, function (err, metadata) {
                        if (err) {
                            console.log(err);
                            console.log('Dampe4');
                            series_callback(err);
                        } else {

                            for (var i = 0; i < metadata.streams.length; i++) {
                                if (metadata.streams[i].codec_type == 'video') {
                                    resolution = metadata.streams[i].width + ' x ' + metadata.streams[i].height;
                                    break;
                                }
                            }
                            console.log('Samp');
                            ffmpeg('anullsrc=cl=1')
                                .addInputOptions('-f lavfi')
                                .input("./uploads/" + filename)
                                // .size('224x?').aspect('9:16')
                                // .input("./transparent.png")
                                .output('./uploads/' + filename + '.mp4')
                                .addOutputOptions('-shortest')
                                .addOutputOptions('-pix_fmt yuv420p')
                                // .addOutputOptions('-filter_complex overlay=' + Math.floor(Math.random() * metadata.streams[0].width) + ':' + Math.floor(Math.random() * metadata.streams[0].height))
                                .audioCodec('libmp3lame')
                                .videoCodec('libx264')
                                .on('error', function (err) {

                                    series_callback(err);
                                })
                                .on('progress', function (progress) {
                                    console.log('Processing: ' + progress.timemark + ' done');
                                    console.log('Processing: ' + progress);
                                    // sendUploadingStatus(progress.timemark, uploader.progressTotal);
                                })
                                .on('end', function () {
                                    console.log('Data');
                                    // fs.unlink("./uploads/" + filename);
                                    newFilename = newFilename.replace("." + ext, '.mp4');
                                    filename = filename + ".mp4";

                                    fs.appendFile('./uploads/' + filename, (new Date()).getTime(), function (err) {
                                        if (err) {
                                            series_callback(err);
                                        }
                                        else {
                                            series_callback();
                                        }
                                    });


                                })
                                .run();
                        }
                    });
                }
                else if (mimeType.includes("image/")) {
                                var imageCropGreater = function(newFilename, width, height) {
                                    var guidName = uuidGen.v1();
                                    var pathFile169 = './downloads/169'+newFilename;
                                    var ratio169w = width - ((width/2) + 355.5);
                                    var ratio169h = ((height/2) - 200);
                                    gm('./uploads/' + filename)
                                    .crop(712, 400, ratio169w, ratio169h)
                                    .write(pathFile169, function (err) {
                                        if (!err) {
                                            putMediaToAzure('169'+newFilename, pathFile169, function(call, res){});
                                        }
                                        else {
                                            console.log(err);
                                        } 
                                        // series_callback();
                                    });

                                    var pathFile11 = './downloads/11'+newFilename;
                                    var ratio11w = width - ((width/2) + 200);
                                    var ratio11h = ((height/2) - 200);
                                    gm('./uploads/' + filename)
                                    .crop(400, 400, ratio11w, ratio11h)
                                    .write(pathFile11, function (err) {
                                        if (!err) {
                                            putMediaToAzure('11'+newFilename, pathFile11, function(call, res){});
                                        }
                                        else {
                                            console.log(err);
                                        } 
                                        // series_callback();
                                    });

                                    var pathFile916 = './downloads/916'+newFilename;
                                    var ratio916w = width - ((width/2) + 112);
                                    var ratio916h = ((height/2) - 200);
                                    gm('./uploads/' + filename)
                                    .crop(224, 400, ratio916w, ratio916h)
                                    .write(pathFile916, function (err) {
                                        if (!err) {
                                            putMediaToAzure('916'+newFilename, pathFile916, function(call, res){});
                                        }
                                        else {
                                            console.log(err);
                                        } 
                                        // series_callback();
                                    });
                                }
                    gm('./uploads/' + filename)
                        .size(function (err, size) {
                            if (!err) {
                                resolution = size.width + ' x ' + size.height;
                                console.log(resolution,'-- Resolution --', size.width%2);
                                if((size.width%2) != 1 && ((size.height%2) != 1)) {
                                     imageCropGreater(newFilename, size.width, size.height);
                                    /* if(size.width < 712) {
                                        if(size.height > 400) {
                                            var padXt = (712 - size.width)/2;  
                                            //console.log('Submit Data');
                                            var resize = shell.exec("ffmpeg -i ./uploads/"+filename+" -vf scale="+size.width+":"+size.height+",pad=712:"+size.height+":"+padXt+":0 ./downloads/"+newFilename).code;
                                            if(resize == 0) {
                                                imageCropGreater(newFilename, 712, size.height);
                                            } else {

                                            }
                                        } else {
                                            var padXt = (712 - size.width)/2;
                                            var padYt = (400 - size.height)/2;
                                            var resize = shell.exec("ffmpeg -i ./uploads/"+filename+" -vf scale="+size.width+":"+size.height+",pad=712:400:"+padXt+":"+padYt+" ./downloads/"+newFilename).code;
                                            if(resize == 0) {
                                                imageCropGreater(newFilename, 712, 400);
                                            } else {
                                                
                                            }
                                        }
                                    } else {
                                        if(size.height > 400) {
                                           
                                        } else {
                                        }
                                    } */
                                    
                                } else {
                                    var width = size.width;
                                    var height = size.height;
                                    if((size.width%2) == 1) {   
                                        width = size.width + 1;
                                        console.log(width);
                                    }
                                    if((size.height%2) == 1) {
                                        height = size.height + 1;
                                    }
                                    console.log(size.width, size.height, '---- Test -----')
                                    var guidName = uuidGen.v1();
                                    var pathFile169 = './downloads/169'+newFilename;
                                    var ratio169w = size.width - ((size.width/2) + 355.5);
                                    var ratio169h = ((size.height/2) - 200);
                                    gm('./uploads/' + filename)
                                    .resize(width, height, '!')
                                    .write(pathFile169, function (err) {
                                        if (!err) {
                                            putMediaToAzure('169'+newFilename, pathFile169, function(call, res){});
                                        }
                                        else {
                                            console.log(err);
                                        } 
                                        // series_callback();
                                    });

                                    var pathFile11 = './downloads/11'+newFilename;
                                    var ratio11w = size.width - ((size.width/2) + 200);
                                    var ratio11h = ((size.height/2) - 200);
                                    gm('./uploads/' + filename)
                                    .resize(width, height, '!')
                                    .write(pathFile11, function (err) {
                                        if (!err) {
                                            putMediaToAzure('11'+newFilename, pathFile11, function(call, res){});
                                        }
                                        else {
                                            console.log(err);
                                        } 
                                        // series_callback();
                                    });

                                    var pathFile916 = './downloads/916'+newFilename;
                                    var ratio916w = size.width - ((size.width/2) + 112);
                                    var ratio916h = ((size.height/2) - 200);
                                    gm('./uploads/' + filename)
                                    .resize(width, height, '!')
                                    .write(pathFile916, function (err) {
                                        if (!err) {
                                            putMediaToAzure('916'+newFilename, pathFile916, function(call, res){});
                                        }
                                        else {
                                            console.log(err);
                                        } 
                                        // series_callback();
                                    });
                                }
                            }
                            series_callback();
                        });
                }
                else {
                    series_callback();
                }
            },
            function (series_callback) {
                blobService.createBlockBlobFromLocalFile(
                    'stage',
                    newFilename,
                    "./uploads/" + filename,
                    function (error, result, response) {
                        if (error) {
                            successFalseCb(error, callback);
                        } else {
                            var uploadedPath = "https://" + config.azure_config.AZURE_STORAGE_ACCOUNT + ".blob.core.windows.net/stage/" + newFilename;
                            console.log("FILE UPLOADED", uploadedPath);
                            fs.rename('./uploads/'+filename, './uploads/'+newFilename, function (err) {
                              if (err) throw err;
                              console.log('renamed complete');
                            });
                            addMediaFile(properties, uploadedPath, resolution, filename, newFilename, callback, token);
                            // console.log("PATH", uploadedPath);
                            // blobService.getBlobToStream(
                            //     'stage',
                            //     newFilename, 
                            //     fs.createWriteStream(newFilename), 
                            //     function(error, result, response) {
                            //     if (!error) {
                            //         console.log(result, response);
                            //     }
                            // });
                        }
                    });
                // var uploader = amazon_client.uploadFile({
                //     localFile: "./uploads/" + filename,
                //     s3Params: {
                //         Bucket: config.s3_config.BUCKET_NAME,
                //         Key: newFilename
                //     }
                // });

                // uploader.on('error', function (err) {
                //     console.error("unable to upload:", err.stack);
                //     successFalseCb(err, callback);
                // });

                // uploader.on('progress', function () {
                //     console.log('Testing Process');
                //     console.log("progress", uploader.progressMd5Amount,
                //         uploader.progressAmount, uploader.progressTotal);
                //     sendUploadingStatus(uploader.progressAmount, uploader.progressTotal);
                // });

                // uploader.on('end', function () {

                //     var uploadedPath = s3.getPublicUrl(config.s3_config.BUCKET_NAME, newFilename, "");
                //     console.log("FILE UPLOADED", uploadedPath);
                //     uploadedPath = uploadedPath.replace('s3', 's3-us-west-2');
                //     console.log("PATH", uploadedPath);
                //     //Saving the file in the database

                //     if (mimeType.includes("image/")) {

                //         addMediaFile(properties, uploadedPath, resolution, filename, callback, token);
                //         fs.unlink("./uploads/" + filename);
                //         series_callback();

                //     } else if (mimeType.includes("video/")) {



                //         async.parallel({
                //             // representative: function (parallel_callback2) {
                //             //     // fs.unlink("./uploads/" + filename);
                //             //     ffmpeg('./uploads/' + filename)
                //             //         .output('./uploads/representative.png')
                //             //         .addOutputOptions('-vframes 1')
                //             //         .addOutputOptions('-f image2')
                //             //         .on('end', function() {
                //             //             var newRepresentativeName = uuidGen.v1() + '.png';
                //             //             amazon_client.uploadFile({
                //             //                 localFile: "uploads/representative.png",
                //             //                 s3Params: {
                //             //                     Bucket: config.s3_config.BUCKET_NAME,
                //             //                     Key: newRepresentativeName
                //             //                 }
                //             //             }).on('end', function() {
                //             //                 var uploadedPath = s3.getPublicUrl(config.s3_config.BUCKET_NAME, newRepresentativeName, "").replace('s3', 's3-us-west-2');
                //             //                 parallel_callback2(null, uploadedPath);
                //             //             });
                //             //         })
                //             //         .run();
                //             // },
                //             // resolution: function (parallel_callback2) {

                //             //     ffmpeg.ffprobe('./uploads/' + filename, function (err, metadata) {
                //             //         if (err) {
                //             //             console.error(err);
                //             //             parallel_callback2(err);
                //             //         } else {
                //             //             // metadata should contain 'width', 'height' and 'display_aspect_ratio'
                //             //             // console.log(metadata);
                //             //             var resolution = metadata.streams[0].width + ' x ' + metadata.streams[0].height;

                //             //             parallel_callback2(null, resolution);
                //             //         }
                //             //     });
                //             // },
                //             youtube: function (parallel_callback2) {

                //                 uploadToYoutube(newFilename, "./uploads/" + filename, function(youtubeData) {
                //                     if(youtubeData.error)
                //                     {
                //                         console.log('Youtube Error happened!', youtubeData.error);
                //                         parallel_callback2(youtubeData.error);
                //                     }
                //                     else {
                //                         parallel_callback2(null, youtubeData.data);
                //                     }

                //                 });
                //             }
                //         }, function (err, results) {

                //             fs.unlink("./uploads/" + filename);
                //             if (err)
                //             {
                //                 successFalseCb(err, callback);
                //             }
                //             else {
                //                 addMediaFile(properties, uploadedPath, resolution, filename.slice(0, -4).replace(/\.(?:.(?!\.))+$/, ".mp4"), callback, null, results.youtube);
                //             }

                //             series_callback();
                //         });
                //     }
                // });
            }
        ]);

    }

    function uploadToYoutube(filename, filepath, callback) {
        if (!googleOAuth2Client) {
            console.error('Google Auth Failed');
            callback({ error: 'Google Auth Failed' });
            return;
        }

        googleOAuth2Client.refreshAccessToken(function (err, tokens) {
            console.log(err);
            console.log(tokens);
            var metadata = {
                snippet: { title: filename, description: 'This is a video for pinterest ' },
                status: { privacyStatus: 'public' }, timestamp: new Date().toUTCString()
            };
            var resumableUpload = new ResumableUpload(); //create new ResumableUpload
            //      resumableUpload.tokens    = tokens;
            resumableUpload.tokens = tokens;
            resumableUpload.filepath = filepath;
            resumableUpload.metadata = metadata;
            resumableUpload.monitor = true;
            resumableUpload.retry = -1;  //infinite retries, change to desired amount
            resumableUpload.upload();
            resumableUpload.on('progress', function (progress) {
                console.log(progress);
            });
            resumableUpload.on('error', function (error) {
                console.log({ error: error });
            });
            resumableUpload.on('success', function (data) {
                console.log("Uploaded to youtube");
                callback({ data: data }); // temporarily commented youtube status check
                // checkYoutubeDetails(data , tokens.access_token , callback); 

            });
        });
    }
    function checkYoutubeDetails(data, access_token, callback) {
        var id = JSON.parse(data).id;
        var health = setInterval(function () {
            var options = {
                url: "https://www.googleapis.com/youtube/v3/videos?part=processingDetails&id=" + id,
                headers: {
                    'Host': 'www.googleapis.com',
                    'Authorization': 'Bearer ' + access_token
                }

            };
            request.get(options, function (err, res, body) {
                clearInterval(health);
                console.log(body);
                try {
                    var res = JSON.parse(body);
                    if (res.items[0].processingDetails.processingStatus == 'failed') {
                        console.log(res.items[0].processingDetails.processingStatus);
                        callback({ error: 'YouTube Upload Failed' });
                    }
                    else if (res.items[0].processingDetails.processingStatus == 'processing') {
                        console.log(res.items[0].processingDetails.processingStatus);
                        checkYoutubeDetails(data, access_token, callback); // check again
                    }
                    else {
                        callback({ data: data });
                    }

                } catch (err) {
                    callback({ error: err });
                }


            });
        }, 5000);
    }
    function saveMediaFile(project_id, file_path, callback) {
        download(file_path, './uploads/')
            .on('close', function () {
                // console.log('One file has been downloaded.');
                var filename = path.basename(file_path);

                putMediaToS3bucketAndSaveToDB({ project_id: project_id }, filename, callback);
            });
    }

    function addMediaFile(properties, path, resolution, filename, newFilename, callback, token, youtube_data, representative) {
        try {
            var insertData = function(query_string, query_array) {
                query(query_string, query_array, function (err, result) {
                    if (err) {
                        successFalseCb(err, callback);
                    } else {
                        var row = result.rows[0];
                        if (row != null) {
                            successCb(callback, {
                                'media_file_id': row.id,
                                'path': row.path,
                                'order_in_project': row.order_in_project,
                                'resolution': row.resolution,
                                'name': row.name,
                                'youtube_data': row.youtube_data,
                                'representative': row.representative
                            });
                        } else {
                            successFalseCb('result row is null for the query', callback);
                        }
                    }

                });
            } 

            var projectId = properties.project_id;
            var order_in_project = properties.order_in_project;
            var query_string, query_array;
            var ratio169 = "https://" + config.azure_config.AZURE_STORAGE_ACCOUNT + ".blob.core.windows.net/stage/169" + newFilename;
            var ratio11 = "https://" + config.azure_config.AZURE_STORAGE_ACCOUNT + ".blob.core.windows.net/stage/11" + newFilename;
            var ratio916 = "https://" + config.azure_config.AZURE_STORAGE_ACCOUNT + ".blob.core.windows.net/stage/916" + newFilename;
            // if user account photo, need to update user photo
            if (projectId == config.USER_PHOTO_PROMISED_SIGN) {
                checkToken(token, function (err, result) {

                    if (err) {
                        successFalseCb('token mismatch', callback);
                        return;
                    }
                    var userInfo = result;
                    // Need to delete previous photo from S3 bucket

                    updateFields('user', userInfo.id, [{ name: 'photo', value: path }], function (err, result) {
                        if (err) {
                            successFalseCb(err, callback);
                        } else {
                            callback(null, { photo: path });
                        }
                    });
                });
                return;
            }
            if (!isNaN(parseInt(order_in_project))) {
                query_string = 'INSERT INTO public.media_file (project_id, path, order_in_project, resolution, name, youtube_data, representative) VALUES ($1, $2, $7, $3, $4, $5, $6) RETURNING id, path, order_in_project, resolution, name, youtube_data, representative;';
                query_array = [projectId, path, resolution, filename, youtube_data, representative, order_in_project];
            }
            else {
                var mimeType = mime.lookup(path);
                if(mimeType.includes("video/")) {
                    getDuration(path).then(duration => {
                        query_string = 'INSERT INTO public.media_file (project_id, path, order_in_project, resolution, name, youtube_data, representative, crop_data, duration) VALUES ($1, $2, (SELECT COALESCE(MAX(order_in_project), 0) + 1 AS order_in_project_max FROM public.media_file WHERE project_id = $1), $3, $4, $5, $6, $7, $8) RETURNING id, path, order_in_project, resolution, name, youtube_data, representative;'
                        query_array = [projectId, path, resolution, filename, youtube_data, representative, '{"ratio1":"-vf scale=224:400:force_original_aspect_ratio=decrease,pad=712:400:(ow-iw)/2:(oh-ih)/2", "ratio2":"-vf scale=400:400:force_original_aspect_ratio=decrease,pad=712:400:(ow-iw)/2:(oh-ih)/2", "ratio3":"-vf scale=712:400:force_original_aspect_ratio=decrease,pad=712:400:(ow-iw)/2:(oh-ih)/2"}', '{"seekTime":0,"duration":'+duration+'}'];
                        insertData(query_string, query_array);
                    });   
                } else {
                    query_string = 'INSERT INTO public.media_file (project_id, path, order_in_project, resolution, name, youtube_data, representative, ratio169, ratio11, ratio916, crop_data, duration) VALUES ($1, $2, (SELECT COALESCE(MAX(order_in_project), 0) + 1 AS order_in_project_max FROM public.media_file WHERE project_id = $1), $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id, path, order_in_project, resolution, name, youtube_data, representative;'
                    query_array = [projectId, path, resolution, filename, youtube_data, representative, ratio169, ratio11, ratio916, '{"ratio1":"-vf scale=224:400:force_original_aspect_ratio=decrease,pad=712:400:(ow-iw)/2:(oh-ih)/2", "ratio2":"-vf scale=400:400:force_original_aspect_ratio=decrease,pad=712:400:(ow-iw)/2:(oh-ih)/2", "ratio3":"-vf scale=712:400:force_original_aspect_ratio=decrease,pad=712:400:(ow-iw)/2:(oh-ih)/2"}', '10'];
                    insertData(query_string, query_array);
                }
            }

            
            
        } catch (err) {
            console.log('error in method addMediaFile: ' + err);
            successFalseCb(err, callback);
        }

    }

    function getMediaFileList(projectId, isNeedTextOverlay, callback) {
        console.log('call method getMediaFileList: projectId = ' + projectId);
        try {
            query('SELECT * from public.media_file where project_id = $1 ORDER BY order_in_project ASC;', [projectId], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                    return;
                }
                if (isNeedTextOverlay) {
                    var asyncTasks = [];
                    result.rows.forEach(function (row) {
                        asyncTasks.push(function (parallel_callback) {
                            query('SELECT * FROM public.text_overlay WHERE media_id = $1', [row.id], function (err1, result1) {
                                if (!err1) {
                                    row.texts = result1.rows;
                                    
                                }
                                parallel_callback();
                            });
                        });
                    });
                    async.parallel(asyncTasks, function (err2, result2) {
                        if (err2) {
                            successFalseCb(err2, callback);
                        } else {
                            
                            successCb(callback, {
                                'media_file_list': result.rows
                            });
                        }
                    });
                }
                else {
                    
                    successCb(callback, {
                        'media_file_list': result.rows
                    });
                }
            });
        } catch (err) {
            console.log('error in method getMediaFileList: ' + err);
            successFalseCb(err, callback);
        }
    }

    function getProjectData(projectId, isNeedTextOverlay, callback) {
        console.log('call method getProjectData: projectId = ' + projectId);
        try {
            query('SELECT * from public.project where id = $1', [projectId], function (err, result) {
               
                if (err) {
                    successFalseCb(err, callback);
                    return;
                }
                var project = result.rows[0];
                if (!project) {
                    successFalseCb('Required project does not exist', callback);
                    return;
                }
                getMediaFileList(projectId, isNeedTextOverlay, function (err1, result1) {
                    if (err1) {
                        successFalseCb(err1, callback);
                        return;
                    }
                    if (result.success == false) {
                        successFalseCb(result1.msg, callback);
                        return;
                    }
                    
                    successCb(callback, {
                        'project_data': project,
                        'media_files': result1.media_file_list
                    });

                });
            });
        } catch (err) {
            console.log('error in method getProjectData: ' + err);
            successFalseCb(err, callback);
        }
    }

    function getUserInfoById(id, callback) {
        console.log('call method getUserInfoById: id = ' + id);
        try {
            query('select u.*, US.plan_id, US.plan_price, US.purchase_date, US.number_of_projects, US.time_limit_per_video_in_seconds, US.number_of_days_free_trial, US.number_of_user, US.plan_name, t.name as company, snapchat, facebook, twitter, instagram, pinterest from (select * from public.user u where u.id = $1) as u left join public.team t on u.team_id = t.id LEFT JOIN public.user_subscriptions AS US ON u.id=US.user_id AND US.status=1', [id], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                    return;
                }
                var user = result.rows[0];
                console.log(JSON.stringify(user));
                if (callback != null) {
                    callback(null, user);
                }
            });
        } catch (err) {
            console.log('error in method getUserInfoById: ' + err);
            successFalseCb(err, callback);
        }
    }

    function getUserIdByResetCode(resetCode, callback) {
        console.log('call method getUserIdByResetCode: resetCode = ' + resetCode);
        try {
            query('SELECT user_id from public.reset_password where code = $1', [resetCode], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                    return;
                }
                var row = result.rows[0];
                if (!row) {
                    successCb(callback, {
                        'userId': null
                    });
                    return;
                }
                var userId = result.rows[0].user_id;
                successCb(callback, {
                    'userId': userId
                });
            });
        } catch (err) {
            console.log('error in method getUserIdByResetCode: ' + err);
            successFalseCb(err, callback);
        }

    }

    function isEmailExists(email, callback) {
        console.log('call method isEmailExists, email = ' + email);
        try {
            query('SELECT count(*) from public.user where LOWER(email) = LOWER($1)', [email], function (err, result) {
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
            query('SELECT count(*) from public.project where user_id = $1 and project_name = $2', [userId, projectName], function (err, result) {
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

    function getTeams(callback) {
        console.log('Call method getTeams');

        try {
            var queryString = 'SELECT t.id AS id, t.name AS name, t.monthly_plan AS monthly_plan, t.snapchat AS snapchat, t.facebook AS facebook, t.twitter AS twitter, t.instagram AS instagram, t.pinterest AS pinterest, u.name AS member_name, u.photo AS member_photo, u.email AS member_email, u.team_id AS member_team_id, u.created_at AS member_created_at, u.last_login_date AS member_last_seen, u.is_enabled AS member_is_enabled, u.id AS member_id FROM public.team t LEFT JOIN public.user u ON t.id = u.team_id';
            query(queryString, [], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                    return;
                }

                callback(null, result.rows);
            });

        } catch (err) {
            console.log('error in method getTeams: ' + err);
            successFalseCb(err, callback);
        }
    }

    function getMyTeam(id, callback) {
        console.log('Call method getTeams');

        try {
            var queryString = 'SELECT t.id AS id, t.name AS name FROM public.team t INNER JOIN public.user u ON t.id = u.team_id WHERE t.id = '+ id;
            query(queryString, [], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                    return;
                }

                callback(null, result.rows);
            });

        } catch (err) {
            console.log('error in method getTeams: ' + err);
            successFalseCb(err, callback);
        }
    }

    function getSameTeamMembers(userId, callback) {
        try {
            query('select * from public.user where team_id in (select team_id from public.user where id = $1)', [userId], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                    return;
                }
                var users = result.rows;
                successCb(callback, { users: users });
            });
        } catch (err) {
            console.log('error in method getUserInfoById: ' + err);
            successFalseCb(err, callback);
        }
    }

    function getProfileInfo(message, callback) {
        FB.api('oauth/access_token', {
            client_id: config.social.facebook.client_id,
            client_secret: config.social.facebook.client_secret,
            grant_type: 'client_credentials'
        }, function (res) {
            if (!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                return;
            }
            FB.setAccessToken(message.access_token);

            FB.api('/me', function (res) {

                if (!res || res.error) {
                    callback(res.error, null);
                }
                else {
                    FB.api('/' + res.id + '/picture', { redirect: false }, function (res2) {
                        if (!res2 || res2.error) {
                            successFalseCb(res2.error, callback);
                        }
                        else {
                            res.picture = res2.data.url;
                            successCb(callback, {
                                data: res
                            });
                        }
                    });
                }
            });
        });
    }

    function getFacebookPages(message, callback) {
        FB.api('oauth/access_token', {
            client_id: config.social.facebook.client_id,
            client_secret: config.social.facebook.client_secret,
            grant_type: 'client_credentials'
        }, function (res) {
            if (!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                return;
            }
            FB.setAccessToken(message.access_token);

            FB.api('me/accounts', { scope: 'manage_pages' }, function (res) {
                if (!res || res.error) {
                    callback(res.error, null);
                }
                else {
                    var asyncTasks = [];

                    res['data'].forEach(function (data) {
                        asyncTasks.push(function (parallel_callback) {
                            FB.api('/' + data.id + '/picture', { redirect: false }, function (res) {
                                if (!res || res.error) {
                                    successFalseCb(res.error, parallel_callback);
                                }
                                else {
                                    data.picture = res.data.url;
                                    successCb(parallel_callback, data);
                                }
                            });
                        });
                    });

                    async.parallel(asyncTasks, function (err, results) {

                        if (err) {
                            successFalseCb(err, callback);
                        }
                        else {
                            successCb(callback, {
                                data: results
                            });
                        }
                    });
                }
            });
        });
    }

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
        socket1.on(methodName, function (message) {
            console.log('received ' + methodName);
            checkIfNotEmptyMessage(socket1, message, methodName + '_response', function () {
                var token = message.token;
                checkToken(token, function (err, result) {
                    if (err) {
                        socket1.emit(methodName + '_response', {
                            'success': false,
                            'msg': 'check token error: ' + err
                        });
                        return;
                    }
                    var userInfo = result;
                    // console.log('Token parse result: ' + JSON.stringify(result));
                    cb(userInfo, message);
                });
            });
        });
    }

    function projectInfo(project_id, callback) {
        try {
            query('SELECT id, path, resolution, crop_data, crop_ratio, duration, representative, ratio169, ratio11, ratio916 FROM public.media_file WHERE project_id = $1 AND deleted != 1 ORDER BY order_in_project', [project_id], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                } else {
                    var mediaFile = [];
                    for (var i = 0; i < result.rows.length; i++) {
                        var row = result.rows[i];
                        var mimeType = mime.lookup(row.path);
                        if(!mimeType.includes('image/')) {
                            //var duration = JSON.parse(JSON.stringify(row.duration));

                            var duration =  JSON.parse(row.duration)
                            if(typeof duration.seekTime == 'undefined') {
                                duration.seekTime = 0;
                            }

                            var media = {
                                'media_id': row.id,
                                'path': row.path,
                                'representative': row.representative,
                                'resolution': row.resolution,
                                'crop_data': row.crop_data,
                                'crop_ratio': row.crop_ratio,
                                'seekTime': duration.seekTime,
                                'duration': duration.duration,
                                'durationVideo': duration.duration,
                                'ratio169': row.ratio169,
                                'ratio11': row.ratio11,
                                'ratio916': row.ratio916
                            };
                        } else {
                            var media = {
                                'media_id': row.id,
                                'path': row.path,
                                'representative': row.representative,
                                'resolution': row.resolution,
                                'crop_data': row.crop_data,
                                'crop_ratio': row.crop_ratio,
                                'durationImage': Number(row.duration),
                                'ratio169': row.ratio169,
                                'ratio11': row.ratio11,
                                'ratio916': row.ratio916
                            };
                        }
                        mediaFile.push(media);
                    }
                    var videoTotalTime = 0;
                    query('SELECT us.time_limit_per_video_in_seconds FROM public.user_subscriptions AS us INNER JOIN public.project AS p ON p.user_id = us.user_id WHERE p.id = $1 AND us.status = 1', [project_id], function (err, res) {
                        if(err) {
                            
                        } else {
                            console.log(res);
                         if(res.rows.length > 0) {
                            videoTotalTime = res.rows[0].time_limit_per_video_in_seconds;
                         } else {
                             videoTotalTime = 0;
                         }
                           
                           successCb(callback, {
                                'mediaFile': mediaFile,
                                'videoTotalTime': videoTotalTime
                            });
                        }
                    });
                    
                }
            });
        } catch (err) {
            successFalseCb(err, callback);
        }
    }


    socket1.on('project_details', function (data) {
        console.log(data.project_id, 'Testing');
        projectInfo(data.project_id, function (err, result) {
            console.log('Tester Testing Data: ', result);
            socket1.emit('project_media_response', result);
        });
    })

    //Updating order of media files
    socket1.on('update_media_order', function (data) {
        console.log("Update request arrived", data);
        for (var id in data) {
            console.log(parseInt(data[id]), id);
            query('update media_file set order_in_project=$1 where id=$2;', [parseInt(data[id]), id], function (err, result) {

            });
        }
    });

    socket1.on('update_aspect_ratio', function (data) {
        console.log("Update request arrived", data);
        query('update media_file set aspect_ratio=$1 where project_id=$2;', [data.aspectRatio, data.project_id], function (err, result) {
        });
    });

    socket1.on('get_aspect_ratio', function (data) {
        query('SELECT aspect_ratio FROM public.media_file WHERE project_id = $1 LIMIT 1', [data], function (err, result) {
            socket1.emit('aspect_ratio_get', result);
        });
    });

    socket1.on('update_postion_overlay', function (data) {
        query('update text_overlay set o_left=$1 where id=$2;', [data.o_left, data.id], function (err, result) {
        });
    });

    socket1.on('project_data_response1', function (data) {
        
        getProjectData(data.project_id, data.is_need_text_overlay, function (err, result) {
            socket1.emit('project_data_response_update1', result);
        });
    });

    //reset password
    socket1.on('reset_password', function (message) {
        // console.log('received reset_password message: ' + JSON.stringify(message));
        checkIfNotEmptyMessage(socket1, message, 'reset_password_response', function () {
            var password = message.password;
            var pass2 = message.confirm_password;
            var resetCode = message.reset_code;
            if (password != pass2) {
                // console.log('send reset_password_response: password and confirm_password are not equal');
                socket1.emit('reset_password_response', {
                    'success': false,
                    'msg': 'password and confirm_password are not equal'
                });
                return;
            }
            getUserIdByResetCode(resetCode, function (err, result) {
                if (result.success == false) {
                    console.log('send reset_password_response: ' + result.msg);
                    socket1.emit('reset_password_response', result);
                    return;
                }
                var userId = result.userId;
                if (!userId) {
                    var result = {
                        'success': false,
                        'msg': 'user not found'
                    };
                    console.log('send reset_password_response: user not found');
                    socket1.emit('reset_password_response', result);
                    return;
                }
                getUserInfoById(userId, function (err1, result1) {
                    if (err1) {
                        // console.log('send reset_password_response: ' + JSON.stringify(result1));
                        socket1.emit('reset_password_response', {
                            msg: 'Get User Info Failed',
                            success: false
                        });
                        return;
                    }
                    //passwords are equal, reset_code exists - updateUser, set new password
                    var fields = { 'password': password };
                    updateUserFields(userId, fields, function (err2, result2) {
                        if (err2) {
                            socket1.emit('reset_password_response', {
                                msg: 'Update Password Failed',
                                success: false
                            });
                            return;
                        }
                        deleteResetPasswordEntry(userId, function (err3, result3) {
                            if (err3) {
                                console.log('send reset_password_response: ' + JSON.stringify(result3));
                                socket1.emit('reset_password_response', {
                                    msg: 'Delete Reset Password Entry Failed',
                                    success: false
                                });
                                return;
                            }

                            console.log('send reset_password_response: ' + JSON.stringify(result3));
                            socket1.emit('reset_password_response', result3);
                        });
                    });
                });
            });
        });
    });

    socket1.on('instagram_login_by_credential', function (message) {
        checkIfNotEmptyMessage(socket1, message, 'instagram_login_by_credential_response', function () {
            var username = message.username;
            var password = message.password;
            var device = new InstagramClient.Device(username);
            var storage = new InstagramClient.CookieFileStorage('./cookies/' + username + '.json');

            InstagramClient.Session.create(device, storage, username, password)
                .then(function (session) {
                    socket1.emit("instagram_login_by_credential_response", { loggedIn: true });
                })
                .catch(function (error) {
                    socket1.emit("instagram_login_by_credential_response", { loggedIn: false, error: { message: error.message } });
                })
                .finally(function () {
                    fs.unlink("./cookies/" + username + '.json');
                });
        });
    });

    socket1.on('snapchat_login_by_credential', function (message) {
        checkIfNotEmptyMessage(socket1, message, 'snapchat_login_by_credential_response', function () {
            var query = {
                username: message.username,
                password: message.password,
                type: 'auth'
            };

            request.post({ url: config.SNAPCHAT_PHP_SERVER, form: query }, function (err, response, body) {

                if (!body || body.status != 200) {
                    return socket1.emit("snapchat_login_by_credential_response", {
                        loggedIn: false, error: { message: body.error }
                    });
                }
                return socket1.emit("snapchat_login_by_credential_response", {
                    loggedIn: true,
                    authToken: body.auth_token
                });
            });
        });
    });

    //signup method

    socket1.on('signup', function (message) {
        console.log('received singup message: ' + JSON.stringify(message));
        checkIfNotEmptyMessage(socket1, message, 'signup_response', function () {
            var email = message.email;
            var password = message.password;
            var name = message.name;
            var company = message.company;
            var timezone = message.timezone;
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
                successFalseCb(notFilledMessage + notFilledFields.toString(), function (err, result) {
                    console.log('send signup response - required fields are not filled: ' + notFilledFields.toString());
                    socket1.emit('signup_response', result);
                });
                return;
            }

            createUser(email, password, name, company, timezone, false, function (err, result) {
                console.log('send singup result: ' + JSON.stringify(result));
                var userId = result.user_id;
                var uuid = uuidGen.v4();
                if (result.success == false) {
                    socket1.emit('signup_response', result);
                    return;
                }
                getSubscriptionPlan({plan_id:1}, function(err, plandata){
                    plandata = plandata.subscription_plan;                        
                    query('INSERT INTO public.user_subscriptions(user_id, plan_id, plan_price, number_of_projects, time_limit_per_video_in_seconds, number_of_days_free_trial, number_of_user, status, plan_name, stripe_subscription_id, stripe_customer_id)' +
                        ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);', [userId, plandata.id, plandata.plan_price, plandata.number_of_projects, plandata.time_limit_per_video_in_seconds, plandata.number_of_days_free_trial, plandata.number_of_user, '1', plandata.plan_name, '0', '0'], function (err, result) {
                                createEmailConfirmationEntry(userId, uuid, function (err1, result1) {
                                    if (result1 && result1.success) {
                                        var link = frontPath + uuid;
                                        console.log('link: ' + link);
                                        sendConfirmationEmail(email, link, function (err2, result2) {
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
        });
    });

    function iteration() { }

    socket1.on('delete_user', function (message) {
        console.log('received delete_user message: ' + JSON.stringify(message));
        checkIfNotEmptyMessage(socket1, message, 'delete_user_response', function () {
            var token = message.token;
            checkToken(token, function (err, result) {
                var userId = result.id;
                var deletedUserId = message.user_id;
                checkAdmin(userId, function (err, isAdmin) {
                    if (isAdmin) {
                        deleteUser(deletedUserId, function (err, result) {
                            if (err) {
                                result = {
                                    success: false,
                                    msg: err.body
                                };
                                socket1.emit('delete_user_response', result);
                                return;
                            }
                            else {
                                result.success = true;
                                socket1.emit('delete_user_response', result);
                                return;
                            }
                        });
                    }
                    else {
                        result = {
                            success: false,
                            msg: "Have no privilege"
                        };
                        socket1.emit('delete_user_response', result);
                    }
                });
            });

        });
    });

    socket1.on('forgot_password', function (message) {
        console.log('received forgot_password message: ' + JSON.stringify(message));
        checkIfNotEmptyMessage(socket1, message, 'forgot_password_response', function () {
            var email = message.email;
            var frontPath = message.front_path;
            var uuid = uuidGen.v4();
            getUserInfo(email, function (err0, user) {
                if (err0) {
                    successFalseCb(err0, callback);
                    return;
                }
                var userId = user.id;
                createResetPasswordEntry(userId, uuid, function (err, result) {
                    if (err) {
                        socket1.emit('forgot_password_response', {
                            'success': false,
                            'msg': err
                        });
                        return;
                    }
                    var link = frontPath + uuid;
                    console.log('link: ' + link);
                    sendResetPasswordEmail(email, link, function (err1, result1) {
                        console.log('sendResetPasswordEmail result: ' + JSON.stringify(result1));
                        socket1.emit('forgot_password_response', result1);
                    });
                });
            });
        });

    });

    //authenticate method
    socket1.on('authenticate', function (message) {
        debugger;
        console.log('received authenticate message: ' + JSON.stringify(message));
        checkIfNotEmptyMessage(socket1, message, 'authenticate_response', function () {
            var login = message.login;
            var password = message.password;

            checkAuth(login, password, function (err, result) {
                // console.log('send authenticate result: ' + JSON.stringify(result));
                socket1.emit('authenticate_response', result);
            });
        });
    });

    socket1.on('snapchat_authentication_request', function (message) {

        // var client = new Snapchat();
        // client.signIn(function(err, session) {
        //     if (err)
        //         socket1.emit('snapchat_authentication_request_response', { success: false, body: err });
        //     else 
        //         socket1.emit('snapchat_authentication_request_response', { succes: true, body: session});
        // })
    })

    authRequiredCall(socket1, 'get_current_user', function (userInfo, message) {
        getUserInfoById(userInfo.id, function (err, result) {
            if (!result.id) {
                userInfo = {
                    success: false
                };
            }
            else {
                userInfo = result;
                userInfo.success = true;
            }
            socket1.emit('get_current_user_response', userInfo);
        });
    });

    authRequiredCall(socket1, 'get_current_user1', function (userInfo, message) {
        getUserInfoById(userInfo.id, function (err, result) {
            if (!result.id) {
                userInfo = {
                    success: false
                };
            }
            else {
                userInfo = result;
                userInfo.success = true;
            }
            socket1.emit('get_current_user_response1', userInfo);
        });
    });

    authRequiredCall(socket1, 'create_project', function (userInfo, message) {
        var projectName = message.project_name;
        createProject(userInfo.id, projectName, function (err, result) {
            // console.log('send create project response: ' + JSON.stringify(result))
            socket1.emit('create_project_response', result);
        });

    });

    authRequiredCall(socket1, 'create_text_overlay', function (userInfo, message) {
        createTextOverlay(message, function (err, result) {
            // console.log('send create project response: ' + JSON.stringify(result))
            socket1.emit('create_text_overlay_response', result);
        });
    });

    authRequiredCall(socket1, 'update_text_overlay', function (userInfo, message) {
        updateTextOverlay(message, function (err, result) {
            // console.log('send create project response: ' + JSON.stringify(result))
            socket1.emit('update_text_overlay_response', result);
        });
    });

    authRequiredCall(socket1, 'delete_text_overlay', function (userInfo, message) {
        deleteTextOverlay(message.id, function (err, result) {
            // console.log('send create project response: ' + JSON.stringify(result))
            socket1.emit('delete_text_overlay_response', result);
        });
    });

    authRequiredCall(socket1, 'set_project_title', function (userInfo, message) {
        changeProjectTitle(message, function (err, result) {
            socket1.emit('set_project_title_response', result);
        });
    });

    authRequiredCall(socket1, 'set_media_deleted', function (userInfo, message) {
        setMediaDeletedColumnAs(message, function (err, result) {
            socket1.emit('set_media_deleted_response', result);
        });
    });

    authRequiredCall(socket1, 'delete_media', function (userInfo, message) {
        deleteMedia(message.id, function (err, result) {
            socket1.emit('delete_media_response', result);
        });
    });

    authRequiredCall(socket1, 'clone_media', function (userInfo, message) {
        cloneMedia(message, function (err, result) {
            socket1.emit('clone_media_response', result);
        });
    });

    authRequiredCall(socket1, 'set_project_ratio', function (userInfo, message) {
        changeProjectRatio(message, function (err, result) {
            socket1.emit('set_project_ratio_response', result);
        });
    });

    authRequiredCall(socket1, 'set_fb_pages', function (userInfo, message) {
        updateFBPagesField(userInfo.id, message, function (err, result) {
            socket1.emit('set_fb_pages_response', result);
        });
    });

    authRequiredCall(socket1, 'get_fb_pages', function (userInfo, message) {
        getFBPagesField(userInfo.id, function (err, result) {
            socket1.emit('get_fb_pages_response', result);
        });
    });

    authRequiredCall(socket1, 'get_team_social_info', function (userInfo, message) {
        getTeamSocialInfo(userInfo.id, function (err, result) {
            // console.log('send project list response: ' + JSON.stringify(result))
            socket1.emit('get_team_social_info_response', result);
        });
    });

    authRequiredCall(socket1, 'project_list', function (userInfo) {
        projectList(userInfo.id, function (err, result) {
            console.log('-------------11111111-----------')
            // console.log('send project list response: ' + JSON.stringify(result))
            socket1.emit('project_list_response', result);
        });
    });

    authRequiredCall(socket1, 'delete_project', function (userInfo, message) {
        deleteProject(message.project_id, function (err, result) {
            console.log('send delete_project response');
            socket1.emit('delete_project_response', result);
        });
    });

    authRequiredCall(socket1, 'delete_image', function (userInfo, message) {
        deleteImage(message.file_path, function (err, result) {
            // console.log('send delete_image response: ' + JSON.stringify(result))
            socket1.emit('delete_image_response', result);
        });
    });

    authRequiredCall(socket1, 'confirmate_email', function (userInfo, message) {
        confirmateEmail(userInfo.id, message.email_code, function (err, result) {
            // console.log('send confirmate_email response: ' + JSON.stringify(result))
            socket1.emit('confirmate_email_response', result);
        });
    });

    authRequiredCall(socket1, 'update_project', function (userInfo, message) {
        updateProjectFields(message.project_id, message.fields, function (err, result) {
            // console.log('send update_project response: ' + JSON.stringify(result))
            socket1.emit('update_project_response', result);
        });
    });

    authRequiredCall(socket1, 'update_user', function (userInfo, message) {
        
        updateUserFields(message.user_id, message.fields, function (err, result) {
            // console.log('send update_user response: ' + JSON.stringify(result))
            console.log('send update_user response');
            socket1.emit('update_user_response', result);
            getTeams(function (err, result) {
                socket1.emit('get_teams_response', result);
            });
        });
    });

    authRequiredCall(socket1, 'project_data_edit', function (userInfo, message) {
        
        getProjectData(message.project_id, message.is_need_text_overlay, function (err, result) {
            
            socket1.emit('project_data_response_edit', result);
        });
    });

    authRequiredCall(socket1, 'project_data', function (userInfo, message) {
        
        getProjectData(message.project_id, message.is_need_text_overlay, function (err, result) {
            
            socket1.emit('project_data_response', result);
        });
    });

    authRequiredCall(socket1, 'media_file_add', function (userInfo, message) {
        saveMediaFile(message.project_id, message.path, function (err, result) {
            // console.log('send media_file_add response: ' + JSON.stringify(result))
            result.guid = message.guid;
            socket1.emit('media_added', result);
        });
    });

    authRequiredCall(socket1, 'google_file_add', function (userInfo, message) {
        // addMediaFile(message.project_id, message.path, function(err, result) {
        //         console.log('send media_file_add response: ' + JSON.stringify(result))
        //         socket1.emit('media_added', result);
        // });
        saveGoogleFile(message, function (err, result) {
            // console.log('send google file add response: ' + JSON.stringify(result))
            result.guid = message.guid;
            socket1.emit('media_added', result);
        });
    });

    authRequiredCall(socket1, 'get_facebook_pages', function (userInfo, message) {
        getFacebookPages(message, function (err, result) {
            socket1.emit('get_facebook_pages_response', result);
        });
    });

    authRequiredCall(socket1, 'get_profile_info', function (userInfo, message) {
        getProfileInfo(message, function (err, result) {
            socket1.emit('get_profile_info_response', result);
        });
    });

    authRequiredCall(socket1, 'get_teams', function (userInfo, message) {
        console.log(userInfo);
        getTeams(function (err, result) {
            socket1.emit('get_teams_response', result);
        });

        getMyTeam(userInfo.id, function (err, result) {
            socket1.emit('my_team_response', result);
        });
    });

     authRequiredCall(socket1, 'setcropedImage', function (userInfo, message) { 
        // console.log(message);
        savedCropImage(message, function(err, result){
            if(result.success) {
                socket1.emit('rescropedImage', result);
            }
        });
    });

    authRequiredCall(socket1, 'get_same_team_members', function (userInfo, message) {
        getSameTeamMembers(userInfo.id, function (err, result) {
            socket1.emit('get_same_team_members_response', result);
        });
    });
    authRequiredCall(socket1, 'get_current_image', function (userInfo, message) {
        getCurrentImage(message, function (err, result) {
            // console.log(result);
            socket1.emit('get_current_image_response', result);
        });
    });

    function savedCropImage(message, callack) {
        var base64Data = message.imageBlob.replace(/^data:image\/jpeg;base64,/, "");
        query('SELECT * FROM public.media_file WHERE id = $1', [message.media_id], function(err, result) {
            if(!err) {
                var filePath = result.rows[0]['ratio'+message.ratio];
                var fileName = message.ratio+uuidGen.v1()+'.jpeg';
                var local = './downloads/'+fileName;
                fs.writeFile(local, base64Data, 'base64', function(err) {
                    if(!err) {
                        putMediaToAzure(fileName, local, function(call, res){
                            if(res.success) {
                                query("UPDATE public.media_file SET ratio"+message.ratio+" = $1 WHERE id = $2", [res.mediaPath, message.media_id], function(err, result){
                                    if(!err) {
                                        successCb(callack, { cropImage: res.mediaPath, media_id: message.media_id, ratio: message.ratio });
                                    }
                                });
                            }
                        });
                    } else {
                        successFalseCb('File Does Not Exists in system. Please retry Image Cropping.')
                    }
                });
            }
        });
    }

    function downloadFileFromUrl(url, callback) {
        var filename = path.basename(url);
        var filepath = './downloads/' + filename;
        if (fs.existsSync(filepath)) {
            callback(filepath);
        } else {
            download(url, './downloads')
                .on('close', function () {
                    callback(filepath);
                });
        }
    }
    function getCurrentImage(message, callback) {
        if (isVideo(message.path)) {
            console.log(message.path, '-Samm1');
            downloadFileFromUrl(message.path, function (filepath) {
                var filename = path.basename(filepath);
                var inputPath = './uploads/' + filename;
                var outputPath = '../app/cache';
                var outputFilename = filename.replace(/\.[^/.]+$/, "") + Date.now() + ".png";

                if (message.currentTime > 1) {
                    message.currentTime -= 0.1;
                } else if (message.currentTime <= 0) {
                    message.currentTime = 0;
                }

                console.log("start capture image", message.currentTime)

                ffmpeg(inputPath)
                    .takeScreenshots({
                        count: 1,
                        filename: outputFilename,
                        folder: outputPath,
                        timemarks: [message.currentTime] // number of seconds
                    }
                    )
                    .on('error', function (err) {
                        successFalseCb(err, callback);
                    })
                    .on('end', function (filenames) {
                        var dimensions = sizeOf(outputPath + "/" + outputFilename);
                        callback(null, { filepath: '/cache/' + outputFilename, dimensions: dimensions, for: 'video' });
                    });
            });
        }
        else {
            var filename = path.basename(message.path);
            var filepath = '../app/cache/' + filename;
            if (fs.existsSync(filepath)) {
                var dimensions = sizeOf(filepath);
                console.log(dimensions);
                callback(null, { filepath: '/cache/' + filename, dimensions: dimensions, for: 'image' });
            } else {
                download(message.path, '../app/cache')
                    .on('close', function () {
                        var dimensions = sizeOf(filepath);
                        console.log(dimensions);
                        callback(null, { filepath: '/cache/' + filename, dimensions: dimensions, for: 'image' });
                    });
            }

        }
    }

    // ss(socket1).on('media_file_add', function (stream, data) {

    //     var filename = path.basename(data.name);
    //     var writeStream = fs.createWriteStream("uploads/" + filename);
    //     stream.pipe(writeStream);

    //     writeStream.on('close', function () {                     
    //         putMediaToS3bucketAndSaveToDB(data, filename, function (err, returnData) {
    //             console.log("Saving in database", err, returnData);
    //             returnData.guid = data.guid;
    //             socket1.emit('media_added', returnData);
    //         });
    //     });
    // });

    ss(socket1).on('media_file_add', function (stream, data) {

        var filename = path.basename(data.name);
        var writeStream = fs.createWriteStream("uploads/" + filename, { highWaterMark: 102400 * 5 });
        stream.pipe(writeStream);

        writeStream.on('close', function () {
            putMediaToS3bucketAndSaveToDB(data, filename, function (err, returnData) {
                console.log("Saving in database", err, returnData);
                returnData.guid = data.guid;
                socket1.emit('media_added', returnData);
            });
        });
    });

    ss(socket1).on('overlay_png', function (stream, data) {
        // console.log(data);
        var filename = path.basename(data.name);
        var writeStream = fs.createWriteStream("./uploads/" + filename, { highWaterMark: 102400 * 5 });
        stream.pipe(writeStream);

        writeStream.on('close', function (callback) {
            DataURI('./uploads/' + filename)
                .then(content => {
                    var textContent = '<img src="' + content + '" style="left:655px; top:10px;">';
                    query('INSERT INTO public.text_overlay(media_id, content, o_width, o_height, o_left, o_top, o_degree, overlay_type, base64) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, media_id, content, o_width, o_height, o_left, o_top, o_degree, overlay_type, time_range, base64;', [data.newOverlay.media_id, textContent, 100, 100, 100, 100, 0, 'png', content], function (err, result) {
                        if (err) {
                            // console.log(err)
                            successFalseCb(err, callback);
                        } else {
                            var row = result.rows[0];
                            // successCb(callback, {
                            //     id: row.id
                            // }

                            // );
                            fs.unlink('./uploads/' + filename);
                            console.log('Data ----------------------');
                            socket1.emit('pngOverlay', row);
                            successCb(callback);
                        }
                    });
                })
                .catch(err => { throw err; });
        });

    });

    socket1.on('get_video_duration', function (path) {
        getDuration(path).then(duration => {
            socket1.emit('set_video_duration', duration);
        });
    });

    ss(socket1).on('update_account_photo', function (stream, data) {

        var filename = path.basename(data.name);

        var writeStream = fs.createWriteStream("uploads/" + filename);
        stream.pipe(writeStream);

        writeStream.on('close', function () {
            putMediaToS3bucketAndSaveToDB({ project_id: config.USER_PHOTO_PROMISED_SIGN }, filename, function (err, returnData) {

                console.log("Saving in database", err, returnData);
                returnData = {
                    success: !err,
                    photo: returnData.photo
                };
                socket1.emit('update_account_photo_response', returnData);
            }, data.token);
        });
    });

    authRequiredCall(socket1, 'task_list', function (userInfo, message) {
        getTeamTaskList(userInfo.id, function (err, result) {
            console.log('send task list response: ' + JSON.stringify(result))
            socket1.emit('task_list_response', result);
        });
    });

    authRequiredCall(socket1, 'set_team_social_info', function (userInfo, message) {
        setTeamSocialInfo(userInfo.id, message.config, function (err, result) {
            console.log('send task list response: ' + JSON.stringify(result))
            socket1.emit('set_team_social_info_response', result);
        });
    });

    authRequiredCall(socket1, 'crop_video', function (userInfo, message) {

        // console.log(userInfo, message, 'Sam123');

        // socket1.emit('set_project_video_inprogress', { percent: 0, text: 'initializing...' });
        cropVideo(message, function (err, result) {
            socket1.emit('set_crop_video_response', result);
        });
    });

    authRequiredCall(socket1, 'video_preview', function (userInfo, message) {
        // console.log(userInfo, message, 'Video Preview');
        var count = 0;
        // console.log(message.media_files);
        message.media_files.forEach(function(element, callback) {
            count++;
            var mimeType = mime.lookup(element.path);
            if(!mimeType.includes('image/')) {
                // console.log(element.seekTime);
                element.durationImage = { seekTime:element.seekTime, duration: element.duration}
            }
            query('UPDATE public.media_file SET duration = $1 WHERE id = $2', [element.durationImage, element.media_id], function(err, result) {
                if(callback == (message.media_files.length-1)) {
                    videoPreview(message, function (err, result) {
                        console.log(result, '1122');
                    });
                }
            });
        });
    });

    // make timestring from total

    String.prototype.toHHMMSS = function () {
        var sec_num = parseInt(this, 10); // don't forget the second param
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }
        return hours + ':' + minutes + ':' + seconds;
    }

    String.prototype.toSeconds = function () {
        var timeSliceArray = this.split(':');
        var seconds = (+timeSliceArray[0]) * 60 * 60 + (+timeSliceArray[1]) * 60 + (+timeSliceArray[2]);
        return seconds;
    }

    function sendUploadingStatus(inprogress, total) {
        percentage = (inprogress / total) * 100;
        socket1.emit('set_upload_video_inprogress', { percent: percentage });
    }

    function sendCroppingStatus(total, timemark) {
        socket1.emit('set_project_video_inprogress', { percent: parseInt(80 * timemark.toSeconds() / total), text: 'cropping ' + timemark + ' in ' + (total + '').toHHMMSS() });
    }


    function videoPreview(message, callback) {
        
        let inputFiles = [];
        var aspect_ratio = 16 / 9;

        var crop_string_argument = function(videoResolution, frameW, frameH) {
           
            var videoW = Number(videoResolution.width);
            var videoH = Number(videoResolution.height);
            var crop_arg = {};
            crop_arg.frameH = frameH;
            crop_arg.frameW = frameW;
            crop_arg.videoH = videoH;
            crop_arg.videoW = videoW;
            var videoAspectRatio = videoW/videoH;
            var frameAspectRatio = frameW/frameH;

            if(Math.round(videoAspectRatio, 2) == Math.round(frameAspectRatio, 2)) {
                crop_arg.padX = 0;
                crop_arg.padY = 0;
                crop_arg.scaleH = frameH;
                crop_arg.scaleW = frameW; 
                crop_arg.videoH = videoH;
                crop_arg.videoW = videoW;
            } else {
                var scaledHeight = frameH;
                var scaledWidth = frameW;
                var scaleFactor = 1;
                
                if(videoH > frameH) {
                    if(videoW > frameW) {
                        scaleFactor = frameW/videoW;
                        scaledHeight = scaleFactor*videoH;
                        
                        if(scaledHeight > frameH) {
                            scaleFactor = frameH/videoH;
                            crop_arg.scaleW = Math.ceil(videoW*scaleFactor); 
                            crop_arg.scaleH = frameH;
                            crop_arg.padX = Math.floor((frameW-crop_arg.scaleW)/2);
                            crop_arg.padY = 0;
                        } else {
                            crop_arg.scaleW = frameW; 
                            crop_arg.scaleH = Math.ceil(videoH*scaleFactor);
                            crop_arg.padX = 0;
                            crop_arg.padY = Math.floor((frameH-crop_arg.scaleH)/2);
                        }
                    } else {
                        scaleFactor = frameH/videoH;
                        crop_arg.scaleW = Math.ceil(videoW*scaleFactor); 
                        crop_arg.scaleH = frameH;
                        crop_arg.padX = Math.floor((frameW-crop_arg.scaleW)/2);
                        crop_arg.padY = 0;
                    }
                } else {
                    if(videoW > frameW) {
                        scaleFactor = frameW/videoW;
                        crop_arg.scaleW = frameW; 
                        crop_arg.scaleH = Math.ceil(videoH*scaleFactor);
                        crop_arg.padX = 0;
                        crop_arg.padY = Math.floor((frameH-crop_arg.scaleH)/2);
                    } else {
                        crop_arg.scaleW = videoW; 
                        crop_arg.scaleH = videoH;
                        crop_arg.padX = Math.floor((frameW-crop_arg.scaleW)/2);
                        crop_arg.padY = Math.floor((frameH-crop_arg.scaleH)/2);
                    }
                }
            }
            return crop_arg;
        };


        query('SELECT id, path, order_in_project, representative, crop_data, duration, ratio916, ratio11, ratio169, resolution FROM public.media_file AS mf WHERE mf.project_id = $1 AND mf.deleted != 1 ORDER BY order_in_project', [message.project_id], function (err, result) {
            if (err) {
                successFalseCb(err, callback);
            }
            else {
                var uploadConcat = function (preview) {
                    blobService.createBlockBlobFromLocalFile(
                        'stage',
                        preview,
                        './downloads/'+preview,
                        function (error, result, response) {
                            if (error) {
                                successFalseCb(err, callback);
                            } else {
                                var uploadedPath = "https://" + config.azure_config.AZURE_STORAGE_ACCOUNT + ".blob.core.windows.net/stage/" + preview;
                                console.log("FILE UPLOADED", uploadedPath);
                                query("UPDATE public.project SET result_video = $1 WHERE id = $2", [uploadedPath, message.project_id], function (err, response) {                                    
                                    socket1.emit('preview_download', uploadedPath);
                                });
                            }
                        }
                    );
                }

                var concatVideo = function (data) {                    
                    let inputNamesFormatted = "concat:" + data.join('|');
                    if (data.length > 0) {
                        var finalfile = uuidGen.v1();                        
                        shell.exec('ffmpeg -i "'+inputNamesFormatted+'" -c copy -bsf:v h264_mp4toannexb -acodec copy  ./downloads/'+finalfile+'.mp4', function(code, stdout, stderr) {                            
                            successCb(function(err, res) {
                                if(code == 0) {                                    
                                    uploadConcat(finalfile+'.mp4');
                                }                               
                            });
                        });
                    }
                }

                function asyncFunction (item, cb) {
                    setTimeout(() => {
                        cb();
                    }, 700);
                }

                var text_overlayPng = [];
                var updated_file = [];
                var videoFiles = [];
                var mediaFiles = [];
                let text_overlay = result.rows.reduce((promiseChain, item) => {
                    return promiseChain.then(() => new Promise((resolve) => {
                        query('SELECT content, base64, o_width, o_height, o_left, o_top, o_degree, overlay_type FROM public.text_overlay WHERE media_id = $1', [item.id], function(err, result_text) {
                            
                            let allOverlay = result_text.rows.reduce((promiseChain1, item1) => {
                                return promiseChain1.then(() => new Promise((resolve1) => {
                                    var guidPng = uuidGen.v1();
                                    var overlayData = item1.base64 ? item1.base64 : '';
                                    overlayData = overlayData.replace(/^data:image\/png;base64,/, '');
                                    
                                    fs.writeFile("./downloads/" + guidPng + ".png", overlayData, 'base64', function(err) {
                                        if(err) 
                                        {
                                            console.log(err, '------ Testing Error -----');
                                        } else {
                                            
                                            if(item1.overlay_type == 'png') {
                                                gm('./downloads/'+guidPng+'.png')
                                                .resize(item1.o_width, item1.o_height)
                                                .noProfile()
                                                .write('./downloads/'+guidPng+'.png', function (err) {
                                                    if(!err){
                                                        text_overlayPng.push({png:'./downloads/'+guidPng+'.png', left:item1.o_left, degree:item1.o_degree, top:item1.o_top, width:item1.o_width, height:item1.o_height, media_id: item.id});
                                        
                                                        asyncFunction(item1, resolve1);
                                                    }else{
                                                        
                                                        asyncFunction(item1, resolve1);
                                                    }
                                                });
                                            } else {
                                                text_overlayPng.push({png:'./downloads/'+guidPng+'.png', left:item1.o_left, degree:item1.o_degree, top:item1.o_top, width:item1.o_width, height:item1.o_height, media_id: item.id});
                                                asyncFunction(text_overlayPng, resolve1);
                                            }
                                           
                                        }  
                                    });  
                                })); 
                            }, Promise.resolve());
                            
                            allOverlay.then(() => {
                                asyncFunction(item, resolve);
                            });
                        });
                        //asyncFunction(item, resolve);
                    }));   
                }, Promise.resolve());

                text_overlay.then(() => {
                    let mp4 = result.rows.reduce((promiseChain, item) => {
                        return promiseChain.then(() => new Promise((resolve) => {
                            var crop_string = '';
                            var guid = uuidGen.v1();
                            var newFilePath = './downloads/' + guid + '.mp4';                            
                            var newTsFilePath;
                            mimeType = mime.lookup(item.path);
                            // item.path = item.path.replace("https://"+config.azure_config.AZURE_STORAGE_ACCOUNT+'.blob.core.windows.net/stage', './downloads');
                            // if(item.crop_data != null) {
                            
                            //     crop_string = item.crop_data;
                            // } else {
                            //     crop_string = '-vf scale=600:-2,crop=600:338:0:31,scale=720:404,pad=width=720:height=404:x=0:y=0:color=black,setsar=1:1';
                            // }
                            
                            if(mimeType.includes('image/')) {
                                // console.log(item.ratio11);
                                if(message.ratio == '916') {
                                    item.ratio = '916';
                                    item.ratioPath = item.ratio916.replace("https://"+config.azure_config.AZURE_STORAGE_ACCOUNT+'.blob.core.windows.net/stage', './downloads');
                                } else if(message.ratio == '11') {
                                    item.ratio = '11';
                                    item.ratioPath = item.ratio11.replace("https://"+config.azure_config.AZURE_STORAGE_ACCOUNT+'.blob.core.windows.net/stage', './downloads');
                                } else {
                                    item.ratio = '169';
                                    item.ratioPath = item.ratio169.replace("https://"+config.azure_config.AZURE_STORAGE_ACCOUNT+'.blob.core.windows.net/stage', './downloads');
                                }
                                // console.log(item, 'Emit Data');
                                // var durationData = item.duration;
                                item.duration = item.duration > 0 ? item.duration : 10;
                                // -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100
                                // ffmpeg -ar 48000 -t 60 -f s16le -acodec pcm_s16le -ac 2 -i /dev/zero -acodec libmp3lame -aq 4 output.mp3
                                var code = shell.exec('ffmpeg -loop 1 -i '+ item.ratioPath +' -i ./output.mp3  -c:v libx264 -t '+ item.duration +' -c:a libmp3lame -ab 160k -pix_fmt yuv420p ' + newFilePath).code;
                                if(code == 0) {
                                    updated_file.push({media_id: item.id, updated_files: newFilePath});
                                    query('UPDATE public.media_file SET updated_files = $1 WHERE id = $2', [newFilePath, item.id], function(err, res){ });
                                    item.newFilePath = newFilePath;
                                    mediaFiles.push(item);
                                    asyncFunction(item, resolve);
                                } else {
                                    socket1.emit('videoPreviewError', 'Error: Files can\'t Conncate');
                                    console.log('------ Log MainTain Image -------------');
                                }
                            } else {  
                                
                                item.crop_data = JSON.parse(item.crop_data);
                                
                                // if(message.ratio == '916') {
                                //      item.crop_string = item.crop_data.ratio1;
                                // } else if(message.ratio == '11') {
                                //     item.crop_string = item.crop_data.ratio2;
                                // } else {
                                //     item.crop_string = item.crop_data.ratio3;
                                // }     
                                var argThenVideoCrop = function(item, newFilePath) {
                                    var durationData = JSON.parse(item.duration);
                                
                                    if(durationData.seekTime == undefined) { durationData.seekTime = 0; }
                                    var durationVideo = (durationData.duration - (durationData.seekTime));
                                    // console.log(durationData, 'TestTestTestTestTestTestTestTestTestTest')
                                    var code = shell.exec('ffmpeg -i '+ item.path +' -ss '+ durationData.seekTime +' -t '+ durationVideo +' '+item.crop_string+ ' -codec:v libx264 -codec:a libmp3lame ' + newFilePath).code;
                                    if(code == 0) {
                                        updated_file.push({media_id: item.id, updated_files: newFilePath});
                                        query('UPDATE public.media_file SET updated_files = $1 WHERE id = $2', [newFilePath, item.id], function(err, res){ });
                                        item.newFilePath = newFilePath;
                                        mediaFiles.push(item);
                                        asyncFunction(item, resolve);
                                    }  else {
                                        socket1.emit('videoPreviewError', 'Error: Files can\'t Conncate Video');
                                        console.log('------ Log MainTain Video -------------');
                                    }
                                }
                                
                                switch(message.ratio) {
                                    case '169': 
                                                
                                                if(item.ratio169 != null && item.ratio169 != '') {
                                                    
                                                    item.path = item.ratio169;
                                                    
                                                    item.path = item.path.replace("https://"+config.azure_config.AZURE_STORAGE_ACCOUNT+'.blob.core.windows.net/stage', './downloads');
                                                    getResolution(item.path).then(function (resolution) {
                                                        
                                                        var cropArgument = crop_string_argument(resolution, 712, 400);
                                                        item.crop_string = "-vf scale="+cropArgument.videoW+":-1,crop="+cropArgument.videoW+":"+cropArgument.videoH+":0:0,scale="+cropArgument.scaleW+":"+cropArgument.scaleH+",pad=width="+cropArgument.frameW+":height="+cropArgument.frameH+":x="+cropArgument.padX+":y="+cropArgument.padY+":color=black,setsar=1:1";

                                                        argThenVideoCrop(item, newFilePath);
                                                    });
                                                } else {
                                                    
                                                    item.path = item.path.replace("https://"+config.azure_config.AZURE_STORAGE_ACCOUNT+'.blob.core.windows.net/stage', './uploads');
                                                    getResolution(item.path).then(function (resolution) {
                                                        
                                                        var cropArgument = crop_string_argument(resolution, 712, 400);
                                                        item.crop_string = "-vf scale="+cropArgument.videoW+":-1,crop="+cropArgument.videoW+":"+cropArgument.videoH+":0:0,scale="+cropArgument.scaleW+":"+cropArgument.scaleH+",pad=width="+cropArgument.frameW+":height="+cropArgument.frameH+":x="+cropArgument.padX+":y="+cropArgument.padY+":color=black,setsar=1:1";
                                                       
                                                        argThenVideoCrop(item, newFilePath);
                                                    });
                                                    
                                                }
                                                
                                                item.ratio = '169';
                                                break;
                                    case '11':  
                                                if(item.ratio11 != null && item.ratio11 != '') {
                                                    
                                                    item.path = item.ratio11;
                                                    
                                                    item.path = item.path.replace("https://"+config.azure_config.AZURE_STORAGE_ACCOUNT+'.blob.core.windows.net/stage', './downloads');
                                                    getResolution(item.path).then(function (resolution) {
                                                        
                                                        var cropArgument = crop_string_argument(resolution, 400, 400);
                                                        item.crop_string = "-vf scale="+cropArgument.videoW+":-1,crop="+cropArgument.videoW+":"+cropArgument.videoH+":0:0,scale="+cropArgument.scaleW+":"+cropArgument.scaleH+",pad=width="+cropArgument.frameW+":height="+cropArgument.frameH+":x="+cropArgument.padX+":y="+cropArgument.padY+":color=black,setsar=1:1";

                                                        argThenVideoCrop(item, newFilePath);
                                                    });
                                                } else {
                                                    
                                                    item.path = item.path.replace("https://"+config.azure_config.AZURE_STORAGE_ACCOUNT+'.blob.core.windows.net/stage', './uploads');
                                                    
                                                    getResolution(item.path).then(function (resolution) {
                                                        
                                                        var cropArgument = crop_string_argument(resolution, 400, 400);
                                                        item.crop_string = "-vf scale="+cropArgument.videoW+":-1,crop="+cropArgument.videoW+":"+cropArgument.videoH+":0:0,scale="+cropArgument.scaleW+":"+cropArgument.scaleH+",pad=width="+cropArgument.frameW+":height="+cropArgument.frameH+":x="+cropArgument.padX+":y="+cropArgument.padY+":color=black,setsar=1:1";

                                                        argThenVideoCrop(item, newFilePath);
                                                    });
                                                }
                                                
                                                item.ratio = '11';
                                                break;
                                    case '916': 
                                                if(item.ratio916 != null && item.ratio916 != '') {

                                                    item.path = item.ratio916;
                                                    
                                                    item.path = item.path.replace("https://"+config.azure_config.AZURE_STORAGE_ACCOUNT+'.blob.core.windows.net/stage', './downloads');
                                                    getResolution(item.path).then(function (resolution) {
                                                        
                                                        var cropArgument = crop_string_argument(resolution, 224, 400);
                                                        item.crop_string = "-vf scale="+cropArgument.videoW+":-1,crop="+cropArgument.videoW+":"+cropArgument.videoH+":0:0,scale="+cropArgument.scaleW+":"+cropArgument.scaleH+",pad=width="+cropArgument.frameW+":height="+cropArgument.frameH+":x="+cropArgument.padX+":y="+cropArgument.padY+":color=black,setsar=1:1";

                                                        argThenVideoCrop(item, newFilePath);
                                                    });
                                                } else {
                                                    
                                                    item.path = item.path.replace("https://"+config.azure_config.AZURE_STORAGE_ACCOUNT+'.blob.core.windows.net/stage', './uploads');                                                    
                                                    getResolution(item.path).then(function (resolution) {
                                                        
                                                        var cropArgument = crop_string_argument(resolution, 224, 400);
                                                        item.crop_string = "-vf scale="+cropArgument.videoW+":-1,crop="+cropArgument.videoW+":"+cropArgument.videoH+":0:0,scale="+cropArgument.scaleW+":"+cropArgument.scaleH+",pad=width="+cropArgument.frameW+":height="+cropArgument.frameH+":x="+cropArgument.padX+":y="+cropArgument.padY+":color=black,setsar=1:1";

                                                        argThenVideoCrop(item, newFilePath);
                                                    });
                                                }
                                                
                                                item.ratio = '916';
                                                break;
                                }
                                //400x400
                                //item.crop_string = "-vf scale=1280:-1,crop=720:720:0:0,scale=400:400,pad=width=400:height=400:x=0:y=0:color=black,setsar=1:1";
                                
                                //224x400
                                // item.crop_string = "-vf scale=1280:-1,crop=404:720:0:0,scale=224:400,pad=width=224:height=400:x=0:y=0:color=black,setsar=1:1";
                                // var padYtemp = 136;

                                // item.crop_string = "-vf scale=1280:-1,crop=1280:720:0:0,scale=400:214,pad=width=400:height=400:x=0:y=88:color=black,setsar=1:1";
                                
                                
                                
                            }
                        }));
                    }, Promise.resolve());

                    
                    mp4.then(() => {
                        // console.log('Process all Mp4 Media Files', mediaFiles, text_overlayPng);
                        var count = ind = 0;
                        let mediaFile = mediaFiles.reduce((promiseChain, item) => {
                            return promiseChain.then(() => new Promise((resolve) => {
                               
                               var text_overdone = text_overlayPng.reduce((promiseChain1, item1) => {
                                    
                                    return promiseChain1.then(() => new Promise((resolve1) => {
                                        
                                        if(item1.media_id == item.id) {
                                            count++;
                                            var tempFilePath = './downloads/'+ uuidGen.v1() + '.mp4';
                                            // cropViewPort = calculateViewPort(message.ratio, message.playground);
                                            // var scale_string = '[0:v]scale=' + Math.floor(item1.width / item1.height * message.playground.height) + ':' + Math.floor(message.playground.height) + '[scaled]; ';
                                            
                                            //var rotate_string = "[1:v]rotate=-" + item1.degree + "*PI/(-180):c=none:ow=rotw(" + item1.degree + "*PI/180):oh=roth(" + item1.degree + "*PI/180)[rotate];[0:v][rotate]";
                                              // cropViewPort = calculateViewPort(message.ratio, message.playground);
                                            // var scale_string = '[0:v]scale=' + Math.floor(item1.width / item1.height * message.playground.height) + ':' + Math.floor(message.playground.height) + '[scaled]; ';
                                            
                                            //var rotate_string = "[1:v] rotate=30*PI/180:c=none:ow=rotw(30):oh=roth(30) [rotate];[0:v][rotate]";
                                                               // rotate=30*PI/180:c=none:ow=rotw(iw):oh=roth(ih) [rotate];[0:v][rotate]
                                            
                                           // var rotate_string = "[1:v] rotate=0.04*n:c=none[over];[0:v][over] overlay=0:0";
                                            //rotate_string += "[" + (ind + 1) + ":v]rotate=" + obj.degree + "*PI/(-180):c=none:ow=rotw(" + obj.degree + "*PI/180):oh=roth(" + obj.degree + "*PI/180)[rot" + (ind + 1) + "];";
                                            // var rotate_string = "[0:v]rotate="+item1.degree+"*PI/(-180):c=none:ow=rotw("+item1.degree+"*PI/180):oh=roth(" + item1.degree+"*PI/180)[rotate];[0:v][rotate]";
                                            var newLeft = 0, newTop = 0;
                                            if(item1.degree != 0) {

                                                var x1 = item1.left;
                                                var y1 = item1.top;
                                                var a =  item1.degree* Math.PI / 180;   
                                                var xm = item1.left + (item1.width/2);
                                                var ym = item1.top + (item1.height/2);

                                                newLeft1 = (x1 - xm) * Math.cos(a) - (y1 - ym) * Math.sin(a) + xm;
                                                newTop1 = (x1 - xm) * Math.sin(a) + (y1 - ym) * Math.cos(a)  + ym;

                                                var x2 = x1;
                                                var y2 = y1+item1.height;
                                                newLeft2 = (x2 - xm) * Math.cos(a) - (y2 - ym) * Math.sin(a) + xm;
                                                newTop2 = (x2 - xm) * Math.sin(a) + (y2 - ym) * Math.cos(a)  + ym;

                                                var x3 = x1+item1.width;
                                                var y3 = y1;
                                                newLeft3 = (x3 - xm) * Math.cos(a) - (y3 - ym) * Math.sin(a) + xm;
                                                newTop3 = (x3 - xm) * Math.sin(a) + (y3 - ym) * Math.cos(a) + ym;

                                                var x4 = x1+item1.width;
                                                var y4 = y1+item1.height;
                                                newLeft4 = (x4 - xm) * Math.cos(a) - (y4 - ym) * Math.sin(a)   + xm;
                                                newTop4 = (x4 - xm) * Math.sin(a) + (y4 - ym) * Math.cos(a)   + ym;

                                               newLeft = Math.min(newLeft1, newLeft2, newLeft3, newLeft4);
                                               newTop = Math.min(newTop1, newTop2, newTop3, newTop4);
                                            } else {
                                                newLeft = item1.left;
                                                newTop = item1.top;
                                            }

                                            switch(item.ratio) {
                                                case '11': newLeft = newLeft - 156;
                                                            break;
                                                case '916': newLeft = newLeft - 244;
                                                            break;
                                                case '169': newLeft = newLeft;
                                                            break;
                                            }
                                            //400x400
                                            // newLeft = newLeft - 156;

                                            //224x400
                                            // newLeft = newLeft - 244;

                                            
                                            
                                            // if(item1.degree == 0) {
                                            //     var overlay_string = "overlay=" + (item1.left) + ":" + (item1.top);
                                            // } else {
                                                //Uncomment this after test
                                                var overlay_string = "[1]setsar=1,rotate=-"+item1.degree+"*PI/180:c=none:ow=rotw("+item1.degree+"*PI/180):oh=roth("+item1.degree+"*PI/180)[s]; [0][s]overlay=" + (newLeft) + ":" + (newTop)+"[out]";
                                                // var overlay_string = "[1]setsar=1,rotate=-"+item1.degree+"*PI/180:c=none:ow=rotw("+item1.degree+"*PI/180):oh=roth("+item1.degree+"*PI/180)[s]; [0][s]overlay=" + (newLeft) + ":" + (newTop)+"[out]";
                                                
                                            // }

                                            // var overlay_string = "[1:v][0:v]scale2ref=(240/34)*ih/16/sar:ih/16[wm][base];[base][wm]overlay="+(newLeft)+":"+(newTop)+"[out]";
                                            
                                            //  var overlay_string = "overlay=" + (item1.left) + ":" + (item1.top);
                                            // console.log(overlay_string, '========== Overlay String ==========');
                                            // var rotate_string = "[" + (1) + ":v]rotate=" + item1.degree + "*PI/(-180):c=none:ow=rotw(" + item1.degree + "*PI/180):oh=roth(" + item1.degree + "*PI/180)[rot" + (1) + "];";
                                            // var scale_string = '[0:v]scale=' + item1.width+':' + item1.height + '[scaled];';
                                            // var text123 = 'ffmpeg -i '+item.newFilePath+' -i '+item1.png+' -filter_complex '+ overlay_string +' -codec:v libx264 -codec:a copy -flags +global_header '+tempFilePath;
                                            // console.log(text123, '---------- Text Overlay --------------');
                                           
                                            gm(item1.png)
                                            .size(function (err, size) {
                                                if(!err) {
                                                    
                                                    var text_code = shell.exec('ffmpeg -i '+item.newFilePath+' -i '+item1.png+' -filter_complex "'+ overlay_string +'" -map "[out]" -map 0:a -c:v libx264 -c:a copy '+tempFilePath).code;
                                                    if(text_code == 0) {
                                                        _.find(updated_file, function(item3, index) {
                                                            if (item3.media_id == item.id) {
                                                                updated_file[index] = {updated_files: tempFilePath, media_id: item.id};     
                                                            } 
                                                        });
                                                        asyncFunction(item1, resolve1);
                                                    }
                                                    item.newFilePath = tempFilePath; 
                                                } else {
                                                    asyncFunction(item1, resolve1);
                                                }
                                            });
                                        } else {
                                            asyncFunction(item1, resolve1);
                                        }
                                    }));
                                }, Promise.resolve());
                               
                                text_overdone.then(() => {
                                    asyncFunction(item, resolve);
                                });
                               
                               //console.log(resolve, item, ' ------ NONE --------');
                            }));
                        }, Promise.resolve()); 

                        mediaFile.then(() => {
                            console.log('------ All Item Are Process ------- ');
                            // query('SELECT updated_files, id FROM public.media_file WHERE project_id = $1 AND deleted != 1', [message.project_id], function(err, generateTs) {
                            //     try {
                                    
                            //         var allTsFiles = [];
                            //         var ts = generateTs.rows.reduce((promiseChain2, item2) => {
                            //             return promiseChain2.then(() => new Promise((resolve2) => {
                            //                 // console.log(item2.updated_files);
                            //                 var newTsFilePath = './downloads/'+uuidGen.v1()+'.ts';
                            //                 console.log('TS FILES ---', item2.updated_files);
                            //                 var newTs = shell.exec('ffmpeg -i '+ item2.updated_files +' -c copy -bsf:v h264_mp4toannexb -f mpegts '+newTsFilePath).code;             
                            //                 if(newTs == 0) {
                            //                     allTsFiles.push(newTsFilePath);
                            //                     // query('UPDATE public.media_file SET updated_ts = $1 WHERE id = $2', [newTsFilePath, item2.id], function(err, res1){});
                            //                     asyncFunction(item2, resolve2);
                            //                 }
                                            
                            //             })); 
                            //         }, Promise.resolve());

                            //         ts.then(() => {
                            //             console.log('--- Create Ts ------', );
                            //             concatVideo(allTsFiles);
                                        
                            //         });
                            //     }catch(err) {
                            //         console.log(err, '----- Error Ts Files -----');
                            //     }
                            // });

                            var allTsFiles = [];
                            var ts = updated_file.reduce((promiseChain2, tsGen) => {
                                return promiseChain2.then(() => new Promise((resolve2) => {
                                    // gm(tsGen.updated_files)
                                    // .size(function (err, size) {
                                    //     if(!err) {
                                            var newTsFilePath = './downloads/'+uuidGen.v1()+'.ts';
                                            console.log('TS FILES ---', tsGen.updated_files);
                                            var newTs = shell.exec('ffmpeg -i '+ tsGen.updated_files +' -c copy -bsf:v h264_mp4toannexb -f mpegts '+newTsFilePath).code;             
                                            if(newTs == 0) {
                                                allTsFiles.push(newTsFilePath);
                                                asyncFunction(tsGen, resolve2);
                                            } else {
                                                socket1.emit('videoPreviewError', 'Error: Files can\'t Conncate');
                                            }
                                    //     } else {
                                    //         asyncFunction(tsGen, resolve2);
                                    //     }
                                    // });      
                                })); 
                            }, Promise.resolve());
                                
                            ts.then(() => {
                                // console.log('--- Create Ts ------', allTsFiles);
                                concatVideo(allTsFiles); 
                            });
                        });
                    });
                });
            }
        })
    }

    function cropVideo(message, callback) {

        var cropStringGenerator = function (width, height) {
            var crop_scale_string = '-vf scale=' + (parseInt(width / 2) * 2) + ':-2,crop=';
            var x1 = (message.startX >= 0 && message.startX <= width) ? message.startX : 0;
            var y1 = (message.startY >= 0 && message.startY <= height) ? message.startY : 0;
            var x2 = (message.endX > 0 && message.endX < width) ? message.endX : (message.endX < 0 ? 0 : width);
            var y2 = (message.endY > 0 && message.endY < height) ? message.endY : (message.endY < 0 ? 0 : height);
            var scaleW = parseInt(360 * (x2 - x1) / (message.endX - message.startX)) * 2;
            var scaleH = parseInt(360 * (y2 - y1) / (message.endY - message.startY) / aspectRatioSetting[message.crop_ratio]) * 2;
            var padH = parseInt(360 / aspectRatioSetting[message.crop_ratio]) * 2;
            var padX, padY;

            crop_scale_string += (x2 - x1) + ':' + (y2 - y1) + ':' + x1 + ':' + y1;

            if (x1 > 0) {
                padX = 0;
            }
            else {
                padX = parseInt(720 * message.startX / (message.startX - message.endX));
            }

            if (y1 > 0) {
                padY = 0;
            }
            else {
                padY = parseInt(padH * message.startY / (message.startY - message.endY));
            }

            if (scaleW > 720 || padX < 0 || padY < 0) {
                crop_scale_string += ',scale=0:0,pad=width=720:height=' + padH;
                crop_scale_string += ':x=0:y=0';
            }
            else {
                crop_scale_string += ',scale=' + scaleW + ':' + scaleH;
                crop_scale_string += ',pad=width=720:height=' + padH;
                crop_scale_string += ':x=' + padX;
                crop_scale_string += ':y=' + padY;
            }
            crop_scale_string += ':color=black,setsar=1:1';
            
            return crop_scale_string;
        };

        /* var crop_string_argument = function(videoResolution, frameW, frameH) {
            // var resolution = videoResolution.split(" x ");
            var videoW = videoResolution.width;
            var videoH = videoResolution.height;
            var crop_arg = {};
            crop_arg.frameH = frameH;
            crop_arg.frameW = frameW;
            crop_arg.videoH = videoH;
            crop_arg.videoW = videoW;
            var videoAspectRatio = videoW/videoH;
            var frameAspectRatio = frameW/frameH;

            if(Math.round(videoAspectRatio, 2) == Math.round(frameAspectRatio, 2)) {
                crop_arg.padX = 0;
                crop_arg.padY = 0;
                crop_arg.scaleH = frameH;
                crop_arg.scaleW = frameW; 
                crop_arg.videoH = videoH;
                crop_arg.videoW = videoW;
            } else {
                var scaledHeight = frameH;
                var scaledWidth = frameW;
                var scaleFactor = 1;

                if(videoH > frameH) {
                    if(videoW > frameW) {
                        scaleFactor = frameW/videoW;
                        scaledHeight = scaleFactor*videoH;
                        
                        if(scaledHeight > frameH) {
                            scaleFactor = frameH/videoH;
                            crop_arg.scaleW = Math.ceil(videoW*scaleFactor); 
                            crop_arg.scaleH = frameH;
                            crop_arg.padX = Math.floor((frameW-crop_arg.scaleW)/2);
                            crop_arg.padY = 0;
                        } else {
                            crop_arg.scaleW = frameW; 
                            crop_arg.scaleH = Math.ceil(videoH*scaleFactor);
                            crop_arg.padX = 0;
                            crop_arg.padY = Math.floor((frameH-crop_arg.scaleH)/2);
                        }
                    } else {
                        scaleFactor = frameH/videoH;
                        crop_arg.scaleW = Math.ceil(videoW*scaleFactor); 
                        crop_arg.scaleH = frameH;
                        crop_arg.padX = Math.floor((frameW-crop_arg.scaleW)/2);
                        crop_arg.padY = 0;
                    }
                } else {
                    if(videoW > frameW) {
                        scaleFactor = frameW/videoW;
                        crop_arg.scaleW = frameW; 
                        crop_arg.scaleH = Math.ceil(videoH*scaleFactor);
                        crop_arg.padX = 0;
                        crop_arg.padY = Math.floor((frameH-crop_arg.scaleH)/2);
                    } else {
                        crop_arg.scaleW = videoW; 
                        crop_arg.scaleH = videoH;
                        crop_arg.padX = Math.floor((frameW-crop_arg.scaleW)/2);
                        crop_arg.padY = Math.floor((frameH-crop_arg.scaleH)/2);
                    }
                }
            }
            
            return crop_arg;
        }; */

        var uploadConcat = function (preview, json, callback) {
            blobService.createBlockBlobFromLocalFile(
                'stage',
                preview,
                './downloads/'+preview,
                function (error, result, response) {
                    if (error) {
                        successFalseCb(err, callback);
                    } else {
                        var uploadedPath = "https://" + config.azure_config.AZURE_STORAGE_ACCOUNT + ".blob.core.windows.net/stage/" + preview;
                        console.log("FILE UPLOADED", uploadedPath);
                        if(message.crop_ratio == '916') {
                            query('UPDATE public.media_file SET crop_data = $1, ratio916 = $3 WHERE id = $2', [json, message.media_spec.id, uploadedPath], function(err, res){
                                socket1.emit('videoCroped', {newPath: uploadedPath, ratio: message.crop_ratio});
                                successCb(callback);
                            });
                        } else if(message.crop_ratio == '11') {
                            query('UPDATE public.media_file SET crop_data = $1, ratio11 = $3 WHERE id = $2', [json, message.media_spec.id, uploadedPath], function(err, res){
                                socket1.emit('videoCroped', {newPath: uploadedPath, ratio: message.crop_ratio});
                                successCb(callback);
                            });
                        } else {
                            query('UPDATE public.media_file SET crop_data = $1, ratio169 = $3 WHERE id = $2', [json, message.media_spec.id, uploadedPath], function(err, res){
                                socket1.emit('videoCroped', {newPath: uploadedPath, ratio: message.crop_ratio});
                                successCb(callback);
                            });
                        }
                    }
                }
            );
        }

        var crop_scale_string = cropStringGenerator(message.crImage.width, message.crImage.height);
        var dirPath = './downloads/';
        var newFilePath = '';
        var guid = uuidGen.v4();
        var newFileName = '';
        var obj = {};

        switch(message.crop_ratio) {
            case '169': 
                            
                        newFileName = '169' + guid+'.mp4';
                        newFilePath = dirPath + newFileName;                        
                        
                        message.crop_ratio = '169';
                        break;
            case '11':  
                        newFileName = '11' + guid+'.mp4';
                        newFilePath = dirPath + newFileName;
                        
                        message.crop_ratio = '11';
                        break;
            case '916': 
                        newFileName = '916' + guid+'.mp4';
                        newFilePath = dirPath + newFileName;                        
                        
                        message.crop_ratio = '916';
                        break;
        }
                                          
        query("SELECT path, crop_data::json FROM public.media_file WHERE id = $1", [message.media_spec.id], function (err, result) {
            
            obj = result.rows[0].crop_data;

            switch(message.crop_ratio) {
                case '916': obj.ratio1 = crop_scale_string;
                            break;
                case '11': obj.ratio2 = crop_scale_string;
                            break;
                case '169': obj.ratio3 = crop_scale_string;
                            break;
            }
            
            var pathFile = result.rows[0].path.replace('https://' + config.azure_config.AZURE_STORAGE_ACCOUNT + '.blob.core.windows.net/stage/', './uploads/');
            getDuration(result.rows[0].path).then(duration => {
                
                var code = shell.exec('ffmpeg -i '+ pathFile +' -ss 0 -t '+ duration +' '+crop_scale_string+ ' -codec:v libx264 -codec:a libmp3lame ' + newFilePath).code;
                if(code == 0) {   
                    uploadConcat(newFileName, obj);
                }
            });
        });
    }

    authRequiredCall(socket1, 'set_project_video', function (userInfo, message) {
        console.log(message, '----------------- Don\'t Get Test ---------------------');
        socket1.emit('set_project_video_inprogress', { percent: 0, text: 'initializing...' });
        setProjectVideo(message.project_id, message.spec_array, message.playground, function (err, result) {

            socket1.emit('set_project_video_response', result);
        });
    });

    authRequiredCall(socket1, 'get_project_video', function (userInfo, message) {
        getProjectVideo(message.id, function (err, result) {

            socket1.emit('get_project_video_response', result);
        });
    });

    authRequiredCall(socket1, 'schedule_task', function (userInfo, message) {
        socket1.emit('schedule_task_inprogress', true);
        scheduleTask(
            userInfo.id,
            message.project_id,
            message.start_date,
            message.target_social_network,
            message.title,
            message.description,
            message.access_token,
            message.oauth_token_secret,
            message.project_image,
            message.isShareNow,
            message.board,
            function (err, result) {
                console.log('send schedule_task response: ' + JSON.stringify(result))
                socket1.emit('schedule_task_response', result);
            }
        );
    });
    authRequiredCall(socket1, 'get_pinterest_boards', function (userInfo, message) {
        console.log('send get_pinterest_boards');
        get_pinterest_boards(message, function (err, result) {
            console.log('send get_pinterest_boards response: ' + JSON.stringify(result));
            socket1.emit('get_pinterest_boards_response', result);
        });
    });

    authRequiredCall(socket1, 'create_pinterest_boards', function (userInfo, message) {
        console.log('send create_pinterest_boards');
        create_pinterest_boards(message, function (err, result) {
            console.log('send create_pinterest_boards response: ' + JSON.stringify(result));
            socket1.emit('create_pinterest_boards_response', result);
        });
    });


    authRequiredCall(socket1, 'delete_task', function (userInfo, message) {
        if (schedules[message.task_id])
            schedules[message.task_id].cancel();
        deleteTask(message.task_id, function (err, result) {
            console.log('send delete_task response: ' + JSON.stringify(result))
            socket1.emit('delete_task_response', result);
        });
    });

    authRequiredCall(socket1, 'update_task', function (userInfo, message) {
        updateTask(
            message.task_id,
            userInfo.id,
            message.project_id,
            message.start_date,
            message.target_social_network,
            message.title,
            message.description,
            message.access_token,
            message.oauth_token_secret,
            message.isShareNow,
            message.project_image,
            message.board,
            function (err, result) {
                console.log('send update_task response: ' + JSON.stringify(result));
                socket1.emit('update_task_response', result);
            }
        );
    });

   

    //START TIMEZONE METHODS

    //UDPATE
    socket1.on('update_timezone', function (message) {
        console.log('received update_timezone message: ' + JSON.stringify(message));

        checkIfNotEmptyMessage(socket1, message, 'update_timezone_response', function () {
            var token = message.token;
            checkToken(token, function (err, result) {
                var userId = result.id,
                    newTimeZone = message.newTimeZone;

                updateTimeZone(userId, newTimeZone, function (err, result) {
                    console.log('send update_timezone response: ' + JSON.stringify(result))
                    socket1.emit('update_timezone_response', result)
                })

            })
        })
    });


    function updateTimeZone(userId, newTimeZone, callback) {
        try {
            console.log('call method updateTimeZone: userId = ' + userId + ', newTimeZone = ' + newTimeZone);

            query('UPDATE public.user set timezone = $1 where id = $2;', [newTimeZone, userId], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                } else {
                    successCb(callback);
                }
            });
        } catch (err) {
            console.log('error in method updateTimeZone: ' + err);
            successFalseCb(err, callback);
        }
    }

    //GET
    socket1.on('get_timezone', function (message) {
        console.log('received get_timezone message: ' + JSON.stringify(message));

        checkIfNotEmptyMessage(socket1, message, 'get_timezone_response', function () {
            var token = message.token;
            checkToken(token, function (err, result) {
                var userId = result.id;

                getTimeZone(userId, function (err, result) {
                    console.log('send get_timezone response: ' + JSON.stringify(result))
                    socket1.emit('get_timezone_response', result)
                })

            })
        })
    });

    function getTimeZone(userId, callback) {
        try {
            console.log('call method getTimeZone: userId = ' + userId);

            query('SELECT timezone FROM public.user WHERE public.user.id = $1;', [userId], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                } else {
                    var timezone = result.rows[0].timezone;
                    callback(null, timezone);
                }
            });
        } catch (err) {
            console.log('error in method updateTimeZone: ' + err);
            successFalseCb(err, callback);
        }
    }

    //END TIMEZONE METHODS

    //START SERVICE CONNECTION STATE
    //UDPATE
    socket1.on('update_service_connection_state', function (message) {
        console.log('received update_service_connection_state message: ' + JSON.stringify(message));

        checkIfNotEmptyMessage(socket1, message, 'update_service_connection_state_response', function () {
            var token = message.token;
            checkToken(token, function (err, result) {
                var userId = result.id,
                    social = message.social,
                    state = message.state;

                checkAndCreateUserInUserServices(userId, function (err) {
                    updateServiceConnectionState(userId, social, state, function (err, result) {
                        console.log('send update_service_connection_state response: ' + JSON.stringify(result))
                        socket1.emit('update_service_connection_state_response', result)
                    })
                });
            })
        })
    });


    function updateServiceConnectionState(userId, social, state, callback) {
        try {
            var allowedSocial = ['facebook', 'instagram', 'dropbox', 'google_drive', 'box', 'twitter'];

            if (allowedSocial.indexOf(social) == -1) {
                throw "invalid social";
            }

            console.log('call method updateServiceConnectionState: userId = ' + userId + ', social = ' + social + ', state = ' + state);

            query('UPDATE public.user_services SET ' + social + ' = $1 WHERE user_id = $2;', [state, userId], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                } else {
                    successCb(callback);
                }
            });
        } catch (err) {
            console.log('error in method updateServiceConnectionState: ' + err);
            successFalseCb(err, callback);
        }
    }


    //GET
    socket1.on('get_all_service_connection_state', function (message) {
        console.log('received get_all_service_connection_state message: ' + JSON.stringify(message));

        checkIfNotEmptyMessage(socket1, message, 'get_all_service_connection_state_response', function () {
            var token = message.token;
            checkToken(token, function (err, result) {
                var userId = result.id;

                getAllServiceConnectionState(userId, function (err, result) {
                    console.log('send get_all_service_connection_state response: ' + JSON.stringify(result));
                    socket1.emit('get_all_service_connection_state_response', result)
                })

            })
        })
    });


    function getAllServiceConnectionState(userId, callback) {
        try {
            console.log('call method getAllServiceConnectionState: userId = ' + userId);

            query('SELECT * FROM public.user_services WHERE public.user_services.user_id = $1;', [userId], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                } else {
                    var result = result.rows[0];
                    callback(null, result);
                }
            });
        } catch (err) {
            console.log('error in method getAllServiceConnectionState: ' + err);
            successFalseCb(err, callback);
        }
    }


    //CHECK EXISTS
    function checkAndCreateUserInUserServices(userId, callback) {
        query('select exists(select 1 from public.user_services where user_id = $1)', [userId], function (err, result) {
            var exists = result.rows[0].exists;
            if (!exists) {
                createUserInUserServices(userId, callback)
            }
            else {
                callback(err, result)
            }
        })
    }

    //CREATE NEW ROW
    function createUserInUserServices(userId, callback) {
        query('INSERT INTO public.user_services VALUES ($1);', [userId], function (err, result) {
            callback(err, result);
        })
    }


    socket1.on('admin_create_user', function (message) {
        var email = message.email;
        var password = message.password;
        var name = message.name;
        var company = message.company;
        var timezone = message.timezone;
        var is_confirmed = message.is_confirmed;

        var notFilledFields = [];
        var notFilledMessage = 'Required fields are not filled: ';
        var notValidEmail = false;
        var errorMessage = ""
        if (!company) {
            notFilledFields.push('company');
        }

        if (!email) {
            notFilledFields.push('email');
        } else {
            if (!emailRegexp.test(email.toLocaleLowerCase())) {
                notValidEmail = true;
            }
        }
        if (!name) {
            notFilledFields.push('name');
        }
        if (!password) {
            notFilledFields.push('password');
        }
        if (notFilledFields.length > 0) {
            errorMessage = notFilledMessage + notFilledFields.toString()
        }
        if (notValidEmail) {
            errorMessage = "Email not valid"
        }
        if (errorMessage) {
            successFalseCb(errorMessage, function (err, result) {
                socket1.emit('admin_create_user_res', result);
            });
            return;
        }
        createUser(email, password, name, company, timezone, is_confirmed, function (err, result) {
            console.log('send singup result: ' + JSON.stringify(result));
            // var userId = result.user_id;
            if (!result.success) {
                socket1.emit('admin_create_user_res', result);
                return;
            }

            var template = config.mailConfig.confirm_admin_create_user;
            var from = template.from;
            var to = email;
            var subject = template.subject;
            var compiledHtml = _.template(template.html)
            var html = compiledHtml(message)

            var options = {
                'from': from,
                'to': to,
                'subject': subject,
                'html': html
            }
            sendEmail(options, function (err, result2) {
                if (!err) {
                    result2.created_at = result.created_at;
                    result2.id = result.user_id;
                }
                socket1.emit('admin_create_user_res', result2);
            })

        })

    });


    socket1.on('get_all_teams', function (message) {
        query('SELECT * FROM public.team', [], function (err, result) {
            if (err) {
                successFalseCb(err, function (err, res) {
                    socket1.emit('get_all_teams_res', res);
                });
                return;
            }
            var teams = result.rows;
            successCb(function (err, res) {
                socket1.emit('get_all_teams_res', res);
            }, { teams: teams });
        })
    })

    socket1.on('admin_invite_user', function (message) {

        var email = message.email;
        var company = message.company;
        var is_confirmed = message.is_confirmed;

        var notFilledFields = [];
        var notFilledMessage = 'Required fields are not filled: ';
        var notValidEmail = false;
        var errorMessage = ""

        if (!company) {
            notFilledFields.push('company');
        }

        if (!email) {
            notFilledFields.push('email');
        } else {
            if (!emailRegexp.test(email.toLocaleLowerCase())) {
                notValidEmail = true
            }
        }

        if (notFilledFields.length > 0) {
            errorMessage = notFilledMessage + notFilledFields.toString();
        }
        if (notValidEmail) {
            errorMessage = "Email not valid"
        }
        if (errorMessage) {
            successFalseCb(errorMessage, function (err, result) {
                socket1.emit('admin_create_user_res', result);
            });
            return;
        }

        createUser(email, '', '', company, '', is_confirmed, function (err, result) {
            if (!result.success) {
                socket1.emit('admin_create_user_res', result);
                return;
            }
            var uuid = uuidGen.v4();
            var userId = result.user_id;

            updateFields('user', userId, [
                {
                    'name': 'invite_id',
                    'value': uuid
                }
            ], function (upErr, upSt) {
                message.invite_id = uuid;
                var template = config.mailConfig.admin_invite_user;
                var from = template.from;
                var to = email;
                var subject = template.subject;
                var compiledHtml = _.template(template.html)
                var html = compiledHtml(message)

                var options = {
                    'from': from,
                    'to': to,
                    'subject': subject,
                    'html': html
                }
                sendEmail(options, function (err, result) {
                    socket1.emit('admin_create_user_res', result);
                })
            })
        })
    })


    socket1.on('user_by_invite', function (message) {
        var invite_id = message.invite_id;
        query('SELECT * from public.user where invite_id = $1;', [invite_id], function (err, result) {
            if (err) {
                successFalseCb(err, function (err, result) {
                    socket1.emit('user_by_invite_res', result);
                });
                return;
            }
            var user = result.rows[0];
            successCb(function (err, res) {
                socket1.emit('user_by_invite_res', res);
            }, { user: user });
        })
    })


    socket1.on('finish_invite', function (message) {
        var userId = message.userId;
        updateFields('user', userId, [
            {
                'name': 'name',
                'value': message.name
            },
            {
                'name': 'password',
                'value': message.password
            },
            {
                'name': 'timezone',
                'value': message.timezone
            },
            {
                'name': 'invite_id',
                'value': "expired"
            },
        ], function (err1, result1) {
            if (err1) {
                successFalseCb(err1, function (err, res) {
                    socket1.emit('finish_invite_res', res);
                });
                return;
            } else {
                successCb(function (err, res) {
                    socket1.emit('finish_invite_res', res)
                });
            }
        });


    })

    socket1.on('update_team_plan', function (message) {
        checkIfNotEmptyMessage(socket1, message, 'update_team_plan_response', function () {
            var token = message.token;
            checkToken(token, function (err, result) {
                var userId = result.id,
                    teamId = message.teamId;
                plan_selected = message.plan_selected;
                checkAdmin(userId, function (err, isAdmin) {
                    if (isAdmin) {
                        updateTeamPlan(teamId, plan_selected, function (err, result) {
                            if (err) {
                                result = {
                                    success: false,
                                    msg: err.body
                                };
                                socket1.emit('update_team_plan_response', result);
                                return;
                            }
                            else {
                                console.log('send update_team_plan response: ' + JSON.stringify(result))
                                result.success = true;
                                result.team_id = teamId;
                                result.plan_selected = plan_selected;
                                socket1.emit('update_team_plan_response', result);
                                return;
                            }
                        });
                    }
                    else {
                        result = {
                            success: false,
                            msg: "Have no privilege"
                        };
                        socket1.emit('update_team_plan_response', result);
                    }
                });
            });
        })
    });


    //END SERVICE CONNECTION STATE

    //START TEAM
    ///DELETE
    socket1.on('delete_team', function (message) {
        console.log('received delete_team message: ' + JSON.stringify(message));

        checkIfNotEmptyMessage(socket1, message, 'delete_team_response', function () {
            var token = message.token;
            checkToken(token, function (err, result) {
                var userId = result.id,
                    teamId = message.teamId;
                checkAdmin(userId, function (err, isAdmin) {
                    if (isAdmin) {
                        deleteTeam(teamId, function (err, result) {
                            if (err) {
                                result = {
                                    success: false,
                                    msg: err.body
                                };
                                socket1.emit('delete_team_response', result);
                                return;
                            }
                            else {
                                console.log('send delete_team response: ' + JSON.stringify(result))
                                result.success = true;
                                result.team_id = teamId;
                                socket1.emit('delete_team_response', result);
                                return;
                            }
                        });
                    }
                    else {
                        result = {
                            success: false,
                            msg: "Have no privilege"
                        };
                        socket1.emit('delete_team_response', result);
                    }
                });
            })
        })
    });


    function deleteTeam(teamId, callback) {
        query('DELETE FROM public.team WHERE id = $1;', [teamId], function (err, result) {
            callback(err, result);
        })
    }

    function updateTeamPlan(teamId, plan_selected, callback) {
        try {
            query('Update public.team SET monthly_plan = $1 WHERE id = $2 RETURNING name;', [plan_selected, teamId], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                } else {
                    var row = result.rows[0];
                    successCb(callback, { 'name': row.name });
                }
            });
        } catch (err) {
            console.log('error in method updateTeamPlan: ' + err);
            successFalseCb(err, callback);
        }
    }


    ///CHECK ADMIN
    function checkAdmin(userId, callback) {
        query('SELECT is_admin FROM public.user WHERE id = $1', [userId], function (err, result) {
            var isAdmin = result.rows[0].is_admin;
            callback(err, isAdmin);
        })
    }


    ///SET TEAM CONNECTION
    socket1.on('set_connection_in_team', function (message) {
        console.log('received set_connection_in_team message: ' + JSON.stringify(message));

        checkIfNotEmptyMessage(socket1, message, 'set_connection_in_team_response', function () {
            var token = message.token;
            checkToken(token, function (err, result) {
                var teamId = message.teamId,
                    social = message.social,
                    status = message.status;

                setConnectionInTeam(teamId, social, status, function (err, result) {
                    result.teamId = teamId;
                    result.social = social;
                    result.status = status;
                    console.log('send set_connection_in_team response: ' + JSON.stringify(result))
                    socket1.emit('set_connection_in_team_response', result)
                })
            })
        })
    });


    function setConnectionInTeam(teamId, social, status, callback) {
        try {
            var allowedSocial = ["snapchat", "facebook", "twitter", "instagram", "pinterest"];

            if (allowedSocial.indexOf(social) == -1) {
                throw "invalid social";
            }

            console.log('call method setConnectionInTeam: teamId = ' + teamId + ', social = ' + social + ', status = ' + status);

            query('UPDATE public.team SET ' + social + ' = $1 WHERE id = $2;', [status, teamId], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                } else {
                    successCb(callback);
                }
            });
        } catch (err) {
            console.log('error in method setConnectionInTeam: ' + err);
            successFalseCb(err, callback);
        }
    }

    socket1.on('set_request_download', function (message) {
        download(message.path, 'c:\\')
            .on('close', function () {
                console.log('One file has been downloaded.');
            });
    });

    //START BOX
    ///CHECK READY
    socket1.on('check_box_ready', function (message) {
        console.log('received check_box_ready message: ' + JSON.stringify(message));
        var boxToken = message.boxToken;
        checkBoxReady(boxToken, function (isReady) {
            console.log('send check_box_ready response: ' + JSON.stringify(isReady));
            socket1.emit('check_box_ready_response', isReady)
        })
    });

    function checkBoxReady(token, callback) {
        var options = {
            host: 'api.box.com',
            port: 443,
            path: '/2.0/folders/0',
            // authentication headers
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        request = https.get(options, function (res) {
            var body = "";
            res.on('data', function (data) {
                body += data;
            });
            res.on('end', function () {
                if (body) {
                    callback(true)
                }
                else {
                    callback(false)
                }
            });
            res.on('error', function (e) {
                console.log("Got error: " + e.message);
            });
        });
    }
    //END BOX


    //START OAUTH.IO CONFIG

    ///SET OAUTH.IO CONFIG
    socket1.on('set_oauthio_config', function (message) {
        console.log('received set_oauthio_config message: ' + JSON.stringify(message));
        checkIfNotEmptyMessage(socket1, message, 'set_oauthio_config', function () {
            var token = message.token;
            checkToken(token, function (err, result) {
                var userId = result.id,
                    config = message.config;

                setOauthioConfig(userId, config, function () {
                    console.log('send set_oauthio_config response: ' + JSON.stringify(result))
                    socket1.emit('set_oauthio_config_response', result)
                });
            })
        })
    });

    function setTeamSocialInfo(userId, config, callback) {
        try {
            console.log('call method setOauthioConfig: userId = ' + userId + ', config = ' + config);

            query('UPDATE public.team SET integrations_and_connections = $1 WHERE id in (select team_id from public.user where id = $2);', [config, userId], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                } else {
                    successCb(callback);
                }
            });
        } catch (err) {
            console.log('error in method setOauthioConfig: ' + err);
            successFalseCb(err, callback);
        }
    }

    function getCroppingArea(ratio, original_width, original_height) {
        var aspectRatio = 1;
        var crop_region = {};
        switch (ratio) {
            case '169':
                aspectRatio = 16 / 9;
                break;
            case '11':
                aspectRatio = 1;
                break;
            case '916':
                aspectRatio = 9 / 16;
                break;
        }
        if (aspectRatio > original_width / original_height) {
            crop_region.dataW = original_width;
            crop_region.dataX = 0;
            crop_region.dataH = original_width / aspectRatio;
            crop_region.dataY = (original_height - crop_region.dataH) / 2;
        }
        else {
            crop_region.dataH = original_height;
            crop_region.dataY = 0;
            crop_region.dataW = original_height * aspectRatio;
            crop_region.dataX = (original_width - crop_region.dataW) / 2;
        }
        return crop_region;
    }

    function setProjectVideo(projectId, spec_array, playground, callback) {
        try {
            var uploadedPath = null;
            var aspect_ratio = 1;

            query('SELECT result_video, ratio FROM public.project WHERE id = $1', [projectId], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                }
                else {
                    var asyncTasks = [];
                    asyncTasks.push(function (parallel_callback_1) {
                        // update ranges
                        var range = '';
                        spec_array.forEach(function (spec) {
                            console.log(spec);
                            range = spec.start + ',' + spec.end;
                            updateFields('media_file', spec.id, [{ name: 'range', value: range }]);
                        });

                        parallel_callback_1();
                    });
                    asyncTasks.push(function (parallel_callback_1) {
                        var row = result.rows[0];
                        if (row != null && row.result_video != null) {
                            var deleteParam = {
                                Bucket: config.s3_config.BUCKET_NAME,
                                Delete: {
                                    Objects: [
                                        {
                                            Key: path.basename(row.result_video)
                                        }
                                    ]
                                }
                            };

                            var deleter = amazon_client.deleteObjects(deleteParam);

                            deleter.on('error', function (err) {
                                console.error("unable to delete:", err.stack);
                                successFalseCb(err, parallel_callback_1);
                            });

                            deleter.on('progress', function () {
                                console.log("progress", deleter.progressAmount, deleter.progressTotal);
                            });

                            deleter.on('end', function () {
                                console.log("File Deleted", row.result_video);
                                parallel_callback_1();
                            });
                        }
                        else {
                            parallel_callback_1();
                        }
                    });

                    asyncTasks.push(function (parallel_callback_1) {
                        var seriesTasks = [];

                        seriesTasks.push(function (series_callback) {
                            var paralleTasks = [];

                            var calculateViewPort = function (ratio, playground) {
                                switch (ratio) {
                                    case '169':
                                        aspect_ratio = 16 / 9;
                                        break;
                                    case '916':
                                        aspect_ratio = 9 / 16;
                                        break;
                                }
                                var w, h;
                                if (playground.width / playground.height > aspect_ratio) {
                                    h = playground.height;
                                    w = h * aspect_ratio;
                                } else {
                                    w = playground.width;
                                    h = w / aspect_ratio;
                                }
                                return { width: parseInt(w / 2) * 2, height: parseInt(h / 2) * 2 };
                            };

                            var cropViewPort = calculateViewPort(result.rows[0].ratio, playground);

                            spec_array.forEach(function (spec) {
                                spec_array[spec_array.indexOf(spec)].percentage = 0;
                                paralleTasks.push(function (parallel_callback_2) {
                                    query('SELECT * FROM public.media_file WHERE id = $1', [spec.id], function (err, result2) {
                                        if (err) {
                                            parallel_callback_2(err);
                                        }
                                        else {
                                            var row = result2.rows[0];
                                            if (row == null) {
                                                parallel_callback_2('media file does not exist');
                                                return;
                                            }

                                            var topTasks = [];

                                            topTasks.push(function (series_top_callback) {
                                                console.log('Raw Path 123456789');
                                                var pngSaveTasks = [];
                                                spec.pngData.forEach(function (png) {
                                                    pngSaveTasks.push(function (parallel_callback_3) {
                                                        png.filename = uuidGen.v1() + '.png';
                                                        fs.writeFile("./downloads/" + png.filename, png.content.replace(/^data:image\/png;base64,/, ""), 'base64', function (err) {
                                                            if (err) {
                                                                parallel_callback_3(err);
                                                            } else {
                                                                parallel_callback_3();
                                                            }
                                                        });
                                                    });
                                                });

                                                async.parallel(pngSaveTasks, function (err, result) {
                                                    if (err) {
                                                        series_top_callback(err);
                                                    } else {
                                                        series_top_callback();
                                                    }
                                                });
                                            });

                                            topTasks.push(function (series_top_callback) {
                                                // console.log('Raw Path: 123456');
                                                if (row.representative != null && row.crop_ratio == result.rows[0].ratio) {
                                                    download(row.representative, './downloads')
                                                        .on('close', function () {
                                                            var filename = path.basename(row.representative);
                                                            spec_array[spec_array.indexOf(spec)].percentage = 50;

                                                            // spec_array[spec_array.indexOf(spec)].url = './downloads/' + filename;

                                                            ffmpeg.ffprobe('./downloads/' + filename, function (err, metadata) {
                                                                if (err) {
                                                                    series_top_callback(err);
                                                                }
                                                                else {
                                                                    var newFilePath = "./downloads/" + filename.replace(".mp4", "2.mp4");

                                                                    var scale_string = '[0:v]scale=' + Math.floor(metadata.streams[0].width / metadata.streams[0].height * playground.height) + ':' + Math.floor(playground.height) + '[scaled];';

                                                                    var rotate_string = "";
                                                                    var overlay_string = "[scaled]";

                                                                    var converter = ffmpeg('./downloads/' + filename);

                                                                    spec.pngData.forEach(function (obj, ind) {

                                                                        converter = converter.input("./downloads/" + obj.filename);
                                                                        rotate_string += "[" + (ind + 1) + ":v]rotate=" + obj.degree + "*PI/(-180):c=none:ow=rotw(" + obj.degree + "*PI/180):oh=roth(" + obj.degree + "*PI/180)[rot" + (ind + 1) + "];";
                                                                        overlay_string += "[rot" + (ind + 1) + "]overlay=" + (obj.left - (playground.width - cropViewPort.width) / 2) + ":" + (obj.top - (playground.height - cropViewPort.height) / 2) + ":enable='between(t," + obj.start + "," + obj.end + ")'[over" + (ind + 1) + "];[over" + (ind + 1) + "]";
                                                                    });

                                                                    console.log('-filter_complex ' + scale_string + rotate_string + overlay_string + 'scale=' + metadata.streams[0].width + ':' + metadata.streams[0].height + ',setsar=1:1[out]');



                                                                    converter
                                                                        .output(newFilePath)
                                                                        .addOutputOptions('-filter_complex ' + scale_string + rotate_string + overlay_string + 'scale=' + metadata.streams[0].width + ':' + (parseInt(metadata.streams[0].width / aspect_ratio / 2) * 2) + ',setsar=1:1[out]')
                                                                        .addOutputOptions('-map [out]')
                                                                        .addOutputOptions('-map 0:a')
                                                                        .addOutputOptions('-c:v libx264')
                                                                        .addOutputOptions('-c:a libmp3lame')
                                                                        .on('error', function (err) {

                                                                            series_top_callback(err);
                                                                        })
                                                                        .on('progress', function (progress) {
                                                                            console.log('Processing: ' + progress.timemark + ' done');
                                                                            spec_array[spec_array.indexOf(spec)].percentage = 50 + parseInt(progress.timemark.toSeconds() / (spec.end - spec.start) * 50);
                                                                        })
                                                                        .on('end', function () {
                                                                            fs.unlink("./downloads/" + filename);
                                                                            spec_array[spec_array.indexOf(spec)].url = newFilePath;
                                                                            spec_array[spec_array.indexOf(spec)].percentage = 100;
                                                                            series_top_callback();
                                                                        })
                                                                        .run();
                                                                }
                                                            });
                                                        });
                                                }
                                                else {
                                                    // console.log('Raw Path: 123');
                                                    download(row.path, './downloads')
                                                        .on('close', function () {
                                                            var filename = path.basename(row.path);
                                                            if (isGif(row.path)) {

                                                                gm("./downloads/" + filename)
                                                                    .size(function (err, size) {
                                                                        if (err) {
                                                                            series_top_callback('cannot get image resolution info');
                                                                            return;
                                                                        }
                                                                        else {
                                                                            var crop_region = getCroppingArea(result.rows[0].ratio, size.width, size.height);

                                                                            var crop_scale_string = 'crop=' + crop_region.dataW + ':' + crop_region.dataH + ':' + crop_region.dataX + ':' + crop_region.dataY + ',scale=720:' + (parseInt(720 / aspectRatioSetting[result.rows[0].ratio] / 2) * 2) + ',setsar=1:1';

                                                                            var newFilePath = "./downloads/" + filename.replace(".gif", ".mp4");

                                                                            var rotate_string = "[0:v]" + crop_scale_string.split(",")[0] + ",scale=" + cropViewPort.width + ":" + cropViewPort.height + "[cropped];";
                                                                            var overlay_string = "[cropped]";

                                                                            var converter = ffmpeg('./downloads/' + filename)
                                                                                .addInputOptions('-ignore_loop 0');

                                                                            spec.pngData.forEach(function (obj, ind) {
                                                                                converter = converter.input("./downloads/" + obj.filename);
                                                                                rotate_string += "[" + (ind + 1) + ":v]rotate=" + obj.degree + "*PI/(-180):c=none:ow=rotw(" + obj.degree + "*PI/180):oh=roth(" + obj.degree + "*PI/180)[rot" + (ind + 1) + "];";
                                                                                overlay_string += "[rot" + (ind + 1) + "]overlay=" + (obj.left - (playground.width - cropViewPort.width) / 2) + ":" + (obj.top - (playground.height - cropViewPort.height) / 2) + ":enable='between(t," + obj.start + "," + obj.end + ")'[over" + (ind + 1) + "];[over" + (ind + 1) + "]";
                                                                            });



                                                                            converter
                                                                                .input('anullsrc=cl=1')
                                                                                .addInputOptions('-f lavfi')
                                                                                .output(newFilePath)
                                                                                .addOutputOptions('-filter_complex ' + rotate_string + overlay_string + crop_scale_string.substr(crop_scale_string.indexOf(",") + 1) + '[out]')
                                                                                .addOutputOptions('-map [out]')
                                                                                .addOutputOptions('-map ' + (spec.pngData.length + 1) + ':a')
                                                                                .addOutputOptions('-pix_fmt yuv420p')
                                                                                .addOutputOptions('-movflags faststart')
                                                                                .addOutputOptions('-c:v libx264')
                                                                                .addOutputOptions('-c:a libmp3lame')
                                                                                .addOutputOptions('-t ' + (spec.end - spec.start))
                                                                                // .addOutputOptions(
                                                                                //     '-filter:v crop='+crop_region.dataW+':'+crop_region.dataH+':'+crop_region.dataX+':'+crop_region.dataY
                                                                                // )
                                                                                // .addOutputOptions('-vf scale=720:' + ( 720 / aspectRatioSetting[result.rows[0].ratio] ) + ',setsar=1:1')
                                                                                .on('error', function (err) {

                                                                                    series_top_callback(err);
                                                                                })
                                                                                .on('progress', function (progress) {
                                                                                    console.log('Processing: ' + progress.timemark + ' done');
                                                                                    spec_array[spec_array.indexOf(spec)].percentage = parseInt(progress.timemark.toSeconds() / (spec.end - spec.start) * 100);
                                                                                })
                                                                                .on('end', function () {

                                                                                    fs.unlink("./downloads/" + filename);
                                                                                    spec_array[spec_array.indexOf(spec)].url = newFilePath;
                                                                                    spec_array[spec_array.indexOf(spec)].percentage = 100;
                                                                                    series_top_callback();
                                                                                })
                                                                                .run();
                                                                        }
                                                                    });

                                                            }
                                                            else if (isImage(row.path)) {
                                                                // console.log('Row Path: ', row.path);
                                                                gm("./downloads/" + filename)
                                                                    .size(function (err, size) {
                                                                        if (err) {
                                                                            series_top_callback('cannot get image resolution info');
                                                                            return;
                                                                        }
                                                                        else {
                                                                            var crop_region = getCroppingArea(result.rows[0].ratio, size.width, size.height);

                                                                            var crop_scale_string = 'crop=' + crop_region.dataW + ':' + crop_region.dataH + ':' + crop_region.dataX + ':' + crop_region.dataY + ',scale=720:' + (parseInt(720 / aspectRatioSetting[result.rows[0].ratio] / 2) * 2) + ',setsar=1:1';

                                                                            var newFilePath = "./downloads/" + filename + '.mp4';

                                                                            var rotate_string = "[0:v]" + crop_scale_string.split(",")[0] + ",scale=" + cropViewPort.width + ":" + cropViewPort.height + "[cropped];";
                                                                            var overlay_string = "[cropped]";

                                                                            var converter = ffmpeg('./downloads/' + filename)
                                                                                .addInputOptions('-loop 1');

                                                                            spec.pngData.forEach(function (obj, ind) {
                                                                                converter = converter.input("./downloads/" + obj.filename);
                                                                                rotate_string += "[" + (ind + 1) + ":v]rotate=" + obj.degree + "*PI/(-180):c=none:ow=rotw(" + obj.degree + "*PI/180):oh=roth(" + obj.degree + "*PI/180)[rot" + (ind + 1) + "];";
                                                                                overlay_string += "[rot" + (ind + 1) + "]overlay=" + (obj.left - (playground.width - cropViewPort.width) / 2) + ":" + (obj.top - (playground.height - cropViewPort.height) / 2) + ":enable='between(t," + obj.start + "," + obj.end + ")'[over" + (ind + 1) + "];[over" + (ind + 1) + "]";
                                                                            });



                                                                            converter
                                                                                .input('anullsrc=cl=1')
                                                                                .addInputOptions('-f lavfi')
                                                                                .output(newFilePath)
                                                                                .addOutputOptions('-filter_complex ' + rotate_string + overlay_string + crop_scale_string.substr(crop_scale_string.indexOf(",") + 1) + '[out]')
                                                                                .addOutputOptions('-map [out]')
                                                                                .addOutputOptions('-map ' + (spec.pngData.length + 1) + ':a')
                                                                                .addOutputOptions('-c:v libx264')
                                                                                .addOutputOptions('-c:a libmp3lame')
                                                                                .addOutputOptions('-t ' + (spec.end - spec.start))
                                                                                .addOutputOptions('-pix_fmt yuv420p')
                                                                                .on('error', function (err) {

                                                                                    series_top_callback(err);
                                                                                })
                                                                                .on('progress', function (progress) {
                                                                                    console.log('Processing: ' + progress.timemark + ' done');
                                                                                    spec_array[spec_array.indexOf(spec)].percentage = parseInt(progress.timemark.toSeconds() / (spec.end - spec.start) * 100);
                                                                                })
                                                                                .on('end', function () {
                                                                                    fs.unlink("./downloads/" + filename);
                                                                                    spec_array[spec_array.indexOf(spec)].url = newFilePath;
                                                                                    spec_array[spec_array.indexOf(spec)].percentage = 100;
                                                                                    series_top_callback();
                                                                                })
                                                                                .run();
                                                                        }
                                                                    });


                                                            }
                                                            else { // video
                                                                // console.log('Raw Path: 123');
                                                                ffmpeg.ffprobe('./downloads/' + filename, function (err, metadata) {
                                                                    if (err) {
                                                                        series_top_callback('Cannot get video resolution info');
                                                                    }
                                                                    else {
                                                                        var crop_region = getCroppingArea(result.rows[0].ratio, metadata.streams[0].width, metadata.streams[0].height);

                                                                        var crop_scale_string = 'crop=' + crop_region.dataW + ':' + crop_region.dataH + ':' + crop_region.dataX + ':' + crop_region.dataY + ',scale=720:' + (parseInt(720 / aspectRatioSetting[result.rows[0].ratio] / 2) * 2) + ',setsar=1:1';

                                                                        var newFilePath = "./downloads/" + filename.replace(".mp4", "2.mp4");

                                                                        var rotate_string = "[0:v]" + crop_scale_string.split(",")[0] + ",scale=" + cropViewPort.width + ":" + cropViewPort.height + "[cropped];";
                                                                        var overlay_string = "[cropped]";

                                                                        var converter = ffmpeg('./downloads/' + filename);

                                                                        spec.pngData.forEach(function (obj, ind) {
                                                                            converter = converter.input("./downloads/" + obj.filename);
                                                                            rotate_string += "[" + (ind + 1) + ":v]rotate=" + obj.degree + "*PI/(-180):c=none:ow=rotw(" + obj.degree + "*PI/180):oh=roth(" + obj.degree + "*PI/180)[rot" + (ind + 1) + "];";
                                                                            overlay_string += "[rot" + (ind + 1) + "]overlay=" + (obj.left - (playground.width - cropViewPort.width) / 2) + ":" + (obj.top - (playground.height - cropViewPort.height) / 2) + ":enable='between(t," + obj.start + "," + obj.end + ")'[over" + (ind + 1) + "];[over" + (ind + 1) + "]";
                                                                        });

                                                                        // .input('anullsrc=cl=1')
                                                                        // .addInputOptions('-f lavfi')

                                                                        converter
                                                                            .output(newFilePath)
                                                                            .addOutputOptions('-filter_complex ' + rotate_string + overlay_string + crop_scale_string.substr(crop_scale_string.indexOf(",") + 1) + '[out]')
                                                                            .addOutputOptions('-map [out]')
                                                                            .addOutputOptions('-map 0:a')
                                                                            .addOutputOptions('-c:v libx264')
                                                                            .addOutputOptions('-c:a libmp3lame')
                                                                            .addOutputOptions('-ss ' + spec.start)
                                                                            .addOutputOptions('-t ' + (spec.end - spec.start))
                                                                            .on('error', function (err) {

                                                                                series_top_callback(err);
                                                                            })
                                                                            .on('progress', function (progress) {
                                                                                console.log('Processing: ' + progress.timemark + ' done');
                                                                                spec_array[spec_array.indexOf(spec)].percentage = parseInt(progress.timemark.toSeconds() / (spec.end - spec.start) * 100);
                                                                            })
                                                                            .on('end', function () {

                                                                                fs.unlink("./downloads/" + filename);
                                                                                spec_array[spec_array.indexOf(spec)].url = newFilePath;
                                                                                spec_array[spec_array.indexOf(spec)].percentage = 100;
                                                                                series_top_callback();
                                                                            })
                                                                            .run();
                                                                    }
                                                                });


                                                            }
                                                        });
                                                }
                                            });


                                            async.series(topTasks, function (err, results) {
                                                if (err) {
                                                    parallel_callback_2(err);
                                                } else {
                                                    parallel_callback_2();
                                                }
                                            });


                                        }
                                    });

                                });
                            });

                            paralleTasks.push(function (parallel_callback_2) {
                                var croppingProgress = 0;
                                var checkProgress = setInterval(function () {
                                    var totalProgress = 0;
                                    console.log(spec_array);
                                    spec_array.forEach(function (spec) {
                                        totalProgress += 1000 / 6; //spec.percentage;
                                        console.log(spec.id, spec.percentage + '%');
                                        //console.log('Samp')
                                    });
                                    var croppingProgress = totalProgress / spec_array.length;
                                    if (croppingProgress > 95) {
                                        clearInterval(checkProgress);
                                        parallel_callback_2();
                                        return;
                                    }
                                    socket1.emit('set_project_video_inprogress', { percent: parseInt(croppingProgress * 60 / 100), text: 'cropping...', progress: totalProgress, length: spec_array.length });

                                }, 2000);
                            })

                            async.parallel(paralleTasks, function (err, results) {
                                if (err) {
                                    series_callback(err);
                                    return;
                                }

                                var total_time_length = 0;
                                spec_array.forEach(function (spec) {
                                    total_time_length += spec.end - spec.start;
                                });

                                var ffmpeg_process = ffmpeg(spec_array[0].url);
                                for (var ind = 1; ind < spec_array.length; ind++) {
                                    ffmpeg_process = ffmpeg_process.input(spec_array[ind].url);
                                }
                                // debugger;

                                ffmpeg_process
                                    .audioCodec('libmp3lame')
                                    .videoCodec('libx264')
                                    .on('error', function (err) {
                                        debugger;
                                        console.log('An error occurred: ' + err.message);
                                        series_callback(err);
                                    })
                                    .on('progress', function (progress) {
                                        console.log('Processing: ' + progress.timemark + ' done');

                                        socket1.emit('set_project_video_inprogress', { percent: parseInt(60 + (20 * progress.timemark.toSeconds() / total_time_length)), text: 'concatenating...' });
                                    })
                                    .on('end', function () {
                                        debugger;
                                        console.log('Merging finished !');
                                        for (var ind = 0; ind < spec_array.length; ind++) {
                                            fs.unlink(spec_array[ind].url);
                                        }
                                        series_callback();
                                    })
                                    .mergeToFile('./uploads/project_' + projectId + '_merged.mp4', './downloads');

                            });

                        });
                        seriesTasks.push(function (series_callback) {
                            var newFilename = uuidGen.v1() + '.mp4';

                            var uploader = amazon_client.uploadFile({
                                localFile: "uploads/project_" + projectId + "_merged.mp4",
                                s3Params: {
                                    Bucket: config.s3_config.BUCKET_NAME,
                                    Key: newFilename
                                }
                            });

                            uploader.on('error', function (err) {
                                console.error("unable to upload:", err.stack);
                                series_callback(err);
                            });

                            uploader.on('progress', function () {
                                // console.log('Testing User Per');
                                console.log("progress", uploader.progressMd5Amount,
                                    uploader.progressAmount, uploader.progressTotal);
                                socket1.emit('set_project_video_inprogress', { percent: parseInt(80 + (20 * uploader.progressAmount / uploader.progressTotal)), text: 'finalizing...' });
                            });

                            uploader.on('end', function () {
                                uploadedPath = s3.getPublicUrl(config.s3_config.BUCKET_NAME, newFilename, "");
                                console.log("FILE UPLOADED", uploadedPath);
                                uploadedPath = uploadedPath.replace('s3', 's3-us-west-2');

                                successCb(callback, { result_video: uploadedPath });
                                // console.log("PATH", uploadedPath);
                                // //Saving the file in the database
                                updateFields('project', projectId, [{ name: 'result_video', value: uploadedPath }], series_callback);
                            });
                        });

                        async.series(seriesTasks, function (err, results) {
                            if (err) {
                                parallel_callback_1(err);
                            } else {
                                parallel_callback_1();
                            }
                        });
                    });

                    async.parallel(asyncTasks, function (err, results) {
                        if (err) {
                            successFalseCb(err, callback);
                        }
                    });
                }
            });
        }
        catch (err) {
            successFalseCb(err, callback);
        }
    }

    function getProjectVideo(projectId, callback) {
        query('SELECT * FROM public.project WHERE id = $1', [projectId], function (err, result) {
            if (err) {
                successFalseCb(err, callback);
            } else if (!result.rows[0].result_video) {
                successFalseCb('Result Video does not exists', callback);
            } else {
                successCb(callback, { result_video: result.rows[0].result_video });
            }
        });
    }

    function setOauthioConfig(userId, config, callback) {
        try {
            console.log('call method setOauthioConfig: userId = ' + userId + ', config = ' + config);

            query('UPDATE public.user SET integrations = $1 WHERE id = $2;', [config, userId], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                } else {
                    successCb(callback);
                }
            });
        } catch (err) {
            console.log('error in method setOauthioConfig: ' + err);
            successFalseCb(err, callback);
        }
    }


    ///GET OAUTH.IO CONFIG
    socket1.on('get_oauthio_config', function (message) {
        console.log('received get_oauthio_config message: ' + JSON.stringify(message));
        checkIfNotEmptyMessage(socket1, message, 'get_oauthio_config', function () {
            var token = message.token;
            checkToken(token, function (err, result) {
                var userId = result.id;
                getOauthioConfig(userId, function (result) {
                    console.log('send get_oauthio_config response: ' + JSON.stringify(result))
                    socket1.emit('get_oauthio_config_response', result)
                });
            })
        })
    });


    function getOauthioConfig(userId, callback) {
        try {
            console.log('call method getOauthioConfig: userId = ' + userId);

            query('SELECT integrations FROM public.user WHERE id = $1;', [userId], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                } else {
                    callback(result.rows[0].integrations);
                }
            });
        } catch (err) {
            console.log('error in method getOauthioConfig: ' + err);
            successFalseCb(err, callback);
        }
    }

    //END OAUTH.IO CONFIG

    ////SHARE WITH INSTAGRAM
    function shareWithInstagram(username, password, caption, fileUrl, callback) {

        var query = {
            username: username,
            password: password,
            caption: caption,
            file: fileUrl
        }

        if (isImage(fileUrl) || isGif(fileUrl)) { //if isPhoto
            query.type = 'photo';
        } else if (isVideo(fileUrl)) {//if isVideo
            query.type = 'video';
        }

        request.post({ url: config.INSTAGRAM_PHP_SERVER, form: query }, function (err, response, body) {

            if (err) {
                // return console.error('instagram post failed:', err);
                return callback(err);
            }
            return callback(response.statusMessage);
        });
    }

    function shareWithSnapchat(username, authToken, fileUrl, callback) {

        var query = {
            username: username,
            auth_token: authToken,
            file: fileUrl
        }

        var isJpeg = function (path) {
            if (!path)
                return false;
            return !!path.match(/.+(\.jpg|\.jpeg)$/);
        };

        async.series([
            function (series_callback) {
                if (isGif(fileUrl)) {
                    download(fileUrl, './uploads')
                        .on('close', function () {
                            var filename = path.basename(fileUrl);
                            var newFilePath = "./uploads/" + filename.replace(".gif", ".mp4");
                            ffmpeg('./uploads/' + filename)
                                .output(newFilePath)
                                .addOutputOptions('-pix_fmt yuv420p')
                                .addOutputOptions('-movflags faststart')
                                .audioCodec('libmp3lame')
                                .videoCodec('libx264')
                                .on('end', function () {
                                    fs.unlink("./uploads/" + filename);
                                    query.type = 'video';
                                    query.file = newFilePath;
                                    series_callback();
                                })
                                .run();
                        });
                }
                else if (isImage(fileUrl) && !isJpeg(fileUrl)) {
                    query.type = 'photo';
                    download(fileUrl, './uploads')
                        .on('close', function () {
                            var filename = path.basename(fileUrl);
                            gm('./uploads/' + filename)
                                .setFormat("jpg")
                                .write('./uploads/output.jpg', function (error) {

                                    if (error) {
                                        return series_callback(error);
                                    }
                                    return series_callback();
                                });
                        });

                }
                else {
                    if (isImage(fileUrl)) { //if isPhoto
                        query.type = 'photo';
                    } else if (isVideo(fileUrl)) {//if isVideo
                        query.type = 'video';
                    }
                    series_callback();
                }
            },
            function (series_callback) {
                request.post({ url: config.SNAPCHAT_PHP_SERVER, form: query }, function (err, response, body) {

                    if (!body && body.status != 200) {
                        // return console.error('instagram post failed:', err);
                        return series_callback(body.error);
                    }
                    return series_callback(null, body.status);
                });
            }
        ], function (err, results) {
            if (err) {
                return callback(err);
            }
            return callback(null, results);
        });
    }

    function isImage(path) {
        if (!path)
            return false;
        return !!path.match(/.+(\.jpg|\.jpeg|\.png)$/);
    }


    function isGif(path) {
        if (!path)
            return false;
        return !!path.match(/.+(\.gif)$/);
    }


    function isVideo(path) {
        if (!path)
            return false;
        return !!path.match(/.+(\.mp4|\.avi|\.mpeg|\.flv|\.mov)$/);
    }

    // Get all plans
    authRequiredCall(socket1, 'get_subscription_plans', function (userInfo, message) {
        getSubscriptionPlans(userInfo.id, function (err, result) {
            socket1.emit('get_subscription_plans_response', result);
        });
    });

    function getSubscriptionPlans(userId, callback) {
        try {
            query('select DISTINCT(SubsPlans.id ), SubsPlans.*, UserSubs.status, UserSubs.plan_id AS user_plan_id from public.subscription_plans AS SubsPlans LEFT OUTER JOIN public.user_subscriptions AS UserSubs ON SubsPlans.id=UserSubs.plan_id AND UserSubs.user_id=$1 AND UserSubs.status=1 order by SubsPlans.id ASC', [userId], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                    return;
                }
                var subscription_plans = result.rows;
                // console.log(subscription_plans);
                successCb(callback, { subscription_plans: subscription_plans });
            });
        } catch (err) {
            // console.log('error in method getSubscriptionPlans: ' + err);
            successFalseCb(err, callback);
        }
    }

    
    //Get get user subscription plan
    authRequiredCall(socket1, 'get_user_subscription_plan', function (userInfo, message) {
        getUserSubscriptionPlan(userInfo.id, function (err, result) {
            socket1.emit('get_user_subscription_plan_response', result);
        });
    });

    authRequiredCall(socket1, 'get_user_subscription_plan1', function (userInfo, message) {
        getUserSubscriptionPlan(userInfo.id, function (err, result) {
            socket1.emit('get_user_subscription_plan_response1', result);
        });
    });

    function getUserSubscriptionPlan(userId, callback) {
        try {
            query('select * from public.user_subscriptions where status=1 AND user_id=$1', [userId], function (err, result) {
                // console.log(result);
                if (err) {
                    successFalseCb(err, callback);
                    return;
                } else if (!result.rowCount) {
                    successFalseCb('User Plan does not exists', callback);
                } else {
                    var user_subscription_plan = result.rows[0];
                    //console.log(user_subscription_plan);
                    successCb(callback, {user_subscription_plan: user_subscription_plan});
                }
                
            });
        } catch (err) {
            //console.log('error in method getSubscriptionPlan: ' + err);
            successFalseCb(err, callback);
        }
    }

    //Check user already used free plan
    authRequiredCall(socket1, 'check_user_used_free_plan', function (userInfo, message) {
        checkUserUsedFreePlan(userInfo.id, function (err, result) {
            socket1.emit('check_user_used_free_plan_response', result);
        });
    });

    function checkUserUsedFreePlan(userId, callback) {
        try {
            query('SELECT sum( CASE WHEN end_date!=NULL THEN end_date::DATE ELSE NOW()::DATE END - purchase_date::DATE ) AS FREE_PLAN_USED_DAYS from public.user_subscriptions where plan_id=1 AND user_id=$1', [userId], function (err, result) {
                console.log(result);
                if (err) {
                    successFalseCb(err, callback);
                    return;
                } else if (!result.rowCount) {
                    successFalseCb('User Plan does not exists', callback);
                } else {
                    var FREE_PLAN_DATA = result.rows[0];                    
                    successCb(callback, {FREE_PLAN_DATA});
                }
                
            });
        } catch (err) {
            //console.log('error in method getSubscriptionPlan: ' + err);
            successFalseCb(err, callback);
        }
    }

    // Stripe Payment
    function doStripePayment(userInfo, formData, callback){
        console.log(formData);
        if(formData.plan_id == 2)
            planName = "Pro";
        else if(formData.plan_id == 3)
            planName = "Plus";
        else if(formData.plan_id == 4)
            planName = "Enterprise";
        else        
            planName = "Free";

        // Create a new customer and then a new charge for that customer:
        stripe.customers.create({ 
            card : formData.stripe_token,
            email : userInfo.email,            
        }).then(function(customer){            
            var stripeCustomerId = customer.id;
            //console.log('Success! Customer with Stripe Customer ID ' + stripeCustomerId + ' just signed up!');
            stripe.subscriptions.create({
              customer: stripeCustomerId,
              items: [
                {
                  plan : planName,
                },
              ]
            }, function(err, subscription) {
                console.log('Success! Customer with Subscription ID ', subscription , ' just signed up!');
                var subscriptionId = subscription.id;
                
                updateUserSubscriptionPlanStatus(userInfo, formData, function(err, result){    
                    getSubscriptionPlan(formData, function(err, plandata){
                        var userSubscriptionPlan = {};
                        plandata = plandata.subscription_plan;                        
                        query('INSERT INTO public.user_subscriptions(user_id, plan_id, plan_price, number_of_projects, time_limit_per_video_in_seconds, number_of_days_free_trial, number_of_user, status, plan_name, stripe_subscription_id, stripe_customer_id)' +
                            ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id, stripe_subscription_id;', [userInfo.id, plandata.id, plandata.plan_price, plandata.number_of_projects, plandata.time_limit_per_video_in_seconds, plandata.number_of_days_free_trial, plandata.number_of_user, '1', plandata.plan_name, subscriptionId, stripeCustomerId], function (err, result) {
                                if (err) {
                                    successFalseCb(err, callback);
                                    return;
                                }
                                // successCb(callback);
                                userSubscriptionPlan = result.rows[0];
                                addPaymentMethod(userInfo, formData, customer, userSubscriptionPlan, callback);
                            });
                    
                    });
                    // End Get SubscriptionPlans   
                });                          
            });
            
        });

    }

    authRequiredCall(socket1, 'stripe_payment', function (userInfo, formData) {        
        doStripePayment(userInfo, formData, function (err, result) {
            console.log(result, '5923');
            socket1.emit('set_stripe_payment_response', result);
        });
    });

    // add Payment Method into local database 
    function addPaymentMethod(userInfo, formData, stripeCustomer, userSubscriptionPlan, callback){
        console.log(userSubscriptionPlan);
        //Update User Payment Method
        query('INSERT INTO public.user_payment_methods(user_id, creditcard_number, stripe_customer_id, card_type)' +
                        ' VALUES ($1, $2, $3, $4) RETURNING id, user_id, creditcard_number, stripe_customer_id, card_type;', [userInfo.id, formData.card_number.replace(/.(?=.{4})/g, 'X'), stripeCustomer.id, stripeCustomer.sources.data[0].brand], function (err, result) {
            if (err) {
                successFalseCb(err, callback);
                return;
            } else {
                // console.log(result);
                var payment_method = result.rows[0];
                // socket1.emit('payment_method', {payment_method: payment_method});
                successCb(callback, {payment_method: payment_method, userSubscriptionPlan: userSubscriptionPlan});
            }
        });
    }

    //Update subscription plan
    function updateSubscriptionPlan(userInfo, formData, callback){        
        console.log(formData);
        if(formData.plan_id == 2)
            planName = "Pro";
        else if(formData.plan_id == 3)
            planName = "Plus";
        else if(formData.plan_id == 4)
            planName = "Enterprise";
        else        
            planName = "Free";

        // Upgrading Plan
        stripe.subscriptions.retrieve(
          formData.stripe_subscription_id,//formData.stripe_subscription_id,
          function(err, subscription) {
            var item_id = subscription.items.data[0].id;
            var stripeCustomerId = subscription.customer;
            stripe.subscriptions.update(formData.stripe_subscription_id, {
              items: [{
                id: item_id,
                plan: planName,
              }],
            }, function(err, subscription) {
                    console.log(subscription);
                    console.log('Success! Customer with Subscription ID ', subscription , ' just updated plan!');
                    var subscriptionId = subscription.id;
                    updateUserSubscriptionPlanStatus(userInfo, formData, function(err, plandata){
                        getSubscriptionPlan(formData, function(err, plandata){
                            plandata = plandata.subscription_plan;                        
                            query('INSERT INTO public.user_subscriptions(user_id, plan_id, plan_price, number_of_projects, time_limit_per_video_in_seconds, number_of_days_free_trial, number_of_user, status, plan_name, stripe_subscription_id, stripe_customer_id)' +
                                ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);', [userInfo.id, plandata.id, plandata.plan_price, plandata.number_of_projects, plandata.time_limit_per_video_in_seconds, plandata.number_of_days_free_trial, plandata.number_of_user, '1', plandata.plan_name, subscriptionId, stripeCustomerId], function (err, result) {
                                        if (err) {
                                            successFalseCb(err, callback);
                                            return;
                                        }
                                        successCb(callback);
                                    });
                        });
                        // End Get SubscriptionPlans   
                    });
            });
          }
        );      
    }

    authRequiredCall(socket1, 'update_subscription_plan', function (userInfo, formData) {
        updateSubscriptionPlan(userInfo, formData, function (err, result) {
            socket1.emit('update_subscription_plan_response', result);
        });
    });

    //Update User subscription plan status
    function updateUserSubscriptionPlanStatus(userInfo, formData, callback){
        console.log('update plan status', userInfo,formData);
        query('UPDATE public.user_subscriptions SET status = $1, end_date=current_timestamp WHERE user_id =$2;', [0, userInfo.id], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                    return;
                } else {
                    successCb(callback);
                }
        });        
    }

    // Get subscription Plan
    function getSubscriptionPlan(formData, callback) {
        //console.log(formData);
        try {
            query('select * from public.subscription_plans where id=$1', [formData.plan_id], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                    return;
                }
                var subscription_plan = result.rows[0];
                //console.log(subscription_plan);
                successCb(callback, {subscription_plan: subscription_plan});
            });
        } catch (err) {
            //console.log('error in method getSubscriptionPlan: ' + err);
            successFalseCb(err, callback);
        }
    }

    // Get getPaymentMethod
    function getPaymentMethod(userInfo, callback) {
        //console.log(formData);
        try {
            query('select * from public.user_payment_methods where user_id=$1', [userInfo.id], function (err, result) {
                if (err) {
                    successFalseCb(err, callback);
                    return;
                }
                var payment_method = result.rows[0];
                console.log(payment_method);
                successCb(callback, {payment_method: payment_method});
            });
        } catch (err) {            
            successFalseCb(err, callback);
        }
    }
    // Get payment Method
    authRequiredCall(socket1, 'get_payment_method', function (userInfo) {        
        getPaymentMethod(userInfo, function (err, result) {
            socket1.emit('get_payment_method_response', result);
        });
    });

    function updatePaymentMethod(userInfo, formData, callback){
        
        stripe.customers.createSource(
          formData.stripe_customer_id,
          { source: formData.stripe_token }, 
          function(err, card) {
            var cardId = card.id;
            stripe.customers.update(formData.stripe_customer_id, {
              default_source: cardId
            }, function(err, customer) {
                // Update payment method in database                
                query('UPDATE public.user_payment_methods SET creditcard_number=$1, card_type=$2 WHERE user_id=$3;', [formData.card_number.replace(/.(?=.{4})/g, 'X'), customer.sources.data[0].brand, userInfo.id ], function (err, result) {
                            if (err) {
                                successFalseCb(err, callback);
                                return;
                            }
                            getPaymentMethod(userInfo, callback);
                        });                   
            });  
        });        
    }
    //update stripe payment method
    authRequiredCall(socket1, 'update_stripe_payment_method', function (userInfo, formData) {        
        updatePaymentMethod(userInfo, formData, function (err, result) {
            socket1.emit('update_stripe_payment_method_response', result);
        });
    });

    // Update plan data from admin
    function adminUpdatePlanData(userInfo, formData, callback){
        // Update payment method in database  
        var field_name = formData.field_name;         
        query('UPDATE public.subscription_plans SET '+field_name+' = $1 WHERE id=$2;', [formData.field_value, formData.id ], function (err, result) {
            if (err) {
                successFalseCb(err, callback);
                return;
            }else{
                /*if(field_name == 'plan_price'){
                  
                    if(formData.id == 2)
                        planName = "Pro";
                    else if(formData.id == 3)
                        planName = "Plus";
                    else if(formData.id == 4)
                        planName = "Enterprise";
                    else        
                        planName = "Free";

                    stripe.plans.update(planName, {
                      amount: formData.field_value
                    }, function(err, plan) {
                      //console.log(err,plan);  
                      getSubscriptionPlans(userInfo.id, callback)
                    });

                }else{
                    getSubscriptionPlans(userInfo.id, callback)
                }*/

                getSubscriptionPlans(userInfo.id, callback)
            }                          
        });                 
    }
    //update stripe payment method
    authRequiredCall(socket1, 'admin_update_plan_data', function (userInfo, formData) {
        adminUpdatePlanData(userInfo, formData, function (err, result) {
            socket1.emit('get_subscription_plans_response', result);
        });
    });

});

//UPDATE public.user set timezone = 'test' where id = 30;
