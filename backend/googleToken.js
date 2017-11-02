var googleauth = require('google-auth-cli');
var config = require('./config.js');

module.exports = {
  getTokens: function(callback) {
    googleauth(
      {
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/youtube' //we need scope youtube as we need upload and also getting processing details after uploading 
      },
      {   
        client_id: config.social.google.client_id, //replace with your client_id and _secret
        client_secret: config.social.google.client_secret,
        timeout: 60 * 60 * 1000,  // This allows uploads to take up to an hour
        port: 8260,
        immediate: true
      },
      function(err, authClient, tokens) {
        console.log(tokens);
        callback(tokens);
        return;
      }
    );
  }

  // getTokens(function(result) {
  //   console.log('tokens:', result);
  //   tokens = result;
  // //      upload();
  //   return;
  // });

};