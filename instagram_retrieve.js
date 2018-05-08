/********************************************************************************************
*									I M P O R T S 											*
*********************************************************************************************/
const https = require('https') 
const querystring = require('querystring') 
const oauth2 = require('simple-oauth2')
const fs = require('fs') 
const url = require('url')  
const async_hooks = require('async_hooks') 

let common = require("./common.js") 


/********************************************************************************************
*									C O N S T A N T S 										*
*********************************************************************************************/
const InstagramTokenHost = "https://api.instagram.com"; 
const InstagramTokenPath = "https://api.instagram.com/oauth/access_token"; 
const InstagramAuthorizePath = "https://api.instagram.com/oauth/authorize";  

const options = {
    key: fs.readFileSync('certs/domain.key', 'utf8'),
    cert: fs.readFileSync('certs/domain.crt', 'utf8')
};

class InstagramAPI {

    /* 
     * The InstagramAPI object is meant to expose an interface for which data can be retrieved from Instagram's public API. https://www.instagram.com/developer/ 
     * This class handles everything necessary to establish a connection with the OAuth2-based API and handle data requests. 
     */
    constructor(client_id, client_secret, redir_uri) {
		this.client_id = client_id; 
		this.client_secret = client_secret; 
		this.redir_uri = redir_uri; 
		this.oauth2_cred = this._create_oauth2_credentials(); 	
		
		this._prompt_auth_url();  
    }
    
    _prompt_implicit_auth_url() {
    	console.log("https://api.instagram.com/oauth/authorize/?client_id=" + String(this.client_id) + "&redirect_uri=" + String(this.redir_uri) + "&response_type=token"); 
    }


    /* Comments: The first step in retrieving an access token from the Instagram API is to prompt the user whose account we're tyring to gain access to for permission to do so. This is done by simply telling the user to grant us access via. the URL template below 
     * :params: None
     * :return: None 
     */
    _prompt_auth_url() {
    	console.log("https://api.instagram.com/oauth/authorize/?client_id=" + String(this.client_id) + "&redirect_uri=" + String(this.redir_uri) + "&response_type=code"); 
    }
    
    /* Returns a JSON-formatted object of credentials for use with oauth2's create() function. Note: tokenHost, tokenPath, and authorizePath are really const's, so maybe they're better off living as static global declarations. 
     * :params: None 
     * :return<OAuth2 Object> The credentials object used to create() an OAuth2 connection. 
     */
    _create_oauth2_credentials() {
	var cred = {    
	    client: {   
			id: this.client_id,	
	    	secret: this.client_secret 
	    },
	    auth: {
			tokenHost: InstagramTokenHost, 
			tokenPath: InstagramTokenPath, 
			authorizePath: InstagramAuthorizePath
	    }
	}   
		return oauth2.create(cred); 
    }

    _oauth2_get_access_token(code) {
	var oauth2_credentials = this.oauth2_cred;
	var tokenConfig = {
	    code: String(code), 
	    redirect_uri: this.redir_uri 
	}
	oauth2_credentials.authorizationCode.getToken(tokenConfig, function (error, result) {
	    if (error) {
		console.log("fuck"); 
		console.log(error.message); 
	    }	    
	    var accessToken = oauth2_credentials.accessToken.create(result);
	    console.log(accessToken); 
	    return accessToken; 
	});
	return {}; 
    }
    
} 

// TODO: Move this outside of this file; this module isn't meant to instantiate and handle InstagramAPI instances. It's only meant to define the class and methods to interact with it. 
var InstAPI = new InstagramAPI('3a6c6164d69646fbba17c4b7bb515aeb', '915951d0c22143269b8fcd0725f65595', 'https://localhost:8081/callback_uri'); 


https.createServer(options, function (req, res) {
    res.writeHead(200);
    res.end('SUP FUCKERSSS\n');

    pathName = url.parse(req.url).pathname;	
    if (pathName == '/callback_uri') {
	code = url.parse(req.url, true).query['code'] 	
	/* 
	var tokenConfig = {
	    code: String(code), 
	    redirect_uri: 'https://localhost:8081/callback_uri'
	}
	
	InstAPI.oauth2_cred.authorizationCode.getToken(tokenConfig, function (error, result) {
	    if (error) {
		console.log("fuck"); 
		console.log(error.message); 
	    }	    
	    const accessToken = InstAPI.oauth2_cred.accessToken.create(result);
	    console.log(accessToken); 
	}); 	
	*/ 
	InstAPI._oauth2_get_access_token(code); 
    }
}).listen(8081);
 

