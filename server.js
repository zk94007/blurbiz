var express = require('express'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  BoxSDK = require('box-node-sdk');
  https = require('https'),
  fs = require('fs');
 
var sdk = new BoxSDK({
  clientID: 'wo40t82j1wrvvim03lyu9tpd5w8kjgcr',
  clientSecret: '9edvLUe4cTbkSuWSYOHhkdmeVKHDZ1tU'
});

var routes = require('./routes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'app')));

app.get('/', routes.index);

app.set('port', process.env.PORT || 4000);



app.get('/box/callback', function (req, res){
  sdk.getTokensAuthorizationCodeGrant(req.query.code, null, function(err, tokenInfo) {
    var tokenInfoLine = ""
    if(tokenInfo){
      tokenInfoLine = JSON.stringify(tokenInfo)
    }
    res.render('boxCallback', {tokenInfo:tokenInfoLine});
  });
});

//var privateKey  = fs.readFileSync('sslcert/server-key.pem', 'utf8');
//var certificate = fs.readFileSync('sslcert/server-cert.pem', 'utf8');
//var credentials = {key: privateKey, cert: certificate};
//var httpsServer = https.createServer(credentials, app);
//httpsServer.listen(8443);

var server = app.listen(app.get('port'), function() {
	// log a message to console!
	console.error('Port at 4k');
});


module.exports = app;