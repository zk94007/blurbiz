var googleToken = require('./googleToken.js');

googleToken.getTokens(function(result) {
    
    console.log('tokens:', result);
    if (result.refresh_token) {
        google_refresh_token = result.refresh_token;

        console.log('google refresh token for youtube is ', google_refresh_token);
        
    }
});