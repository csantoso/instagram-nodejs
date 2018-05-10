/********************************************************************************************
*									I M P O R T S 											*
*********************************************************************************************/
const https = require('https') 
const querystring = require('querystring') 
const oauth2 = require('simple-oauth2')
const fs = require('fs') 
const url = require('url')  
const async_hooks = require('async_hooks') 

let Helpers = require("./common.js") 


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
		this.access_token = null;  
    }
   
    _prompt_implicit_auth_url() {
    	console.log("https://api.instagram.com/oauth/authorize/?client_id=" + String(this.client_id) + "&redirect_uri=" + String(this.redir_uri) + "&response_type=token"); 
    }

    /* The first step in retrieving an access token from the Instagram API is to prompt the user whose account we're tyring to gain access to for permission to do so. This is done by simply telling the user to grant us access via. the URL template below 
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
    
    async _oauth2_get_access_token(code) {
	var tokenConfig = {
	    code: String(code), 
	    redirect_uri: this.redir_uri 
	}
    
	const token_result = await this.oauth2_cred.authorizationCode.getToken(tokenConfig);  
	const accessToken = this.oauth2_cred.accessToken.create(token_result); 
	this.access_token = accessToken; 
	// console.log(this.access_token.token['access_token']); 
	console.log(this.access_token); 

	/* This doens't work because my attempt at preserving this class's 'this' instance just isn't right I guess? oauth2_credentials is necessary because 
	if you were to do this.oauth2_cred.authorizationCode.getToken(...), the 'this' instance that points to this current class instance is overwritten with
	the callback function's 'this' instance (i.e. 'this' now points to the callback functions instance). 

	var oauth2_credentials = this.oauth2_cred;
	var this_classinst = this; 
	oauth2_credentials.authorizationCode.getToken(tokenConfig, function (error, result) {
	    if (error) {
		console.log("fuck"); 
		console.log(error.message); 
	    }	    
	    var accessToken = oauth2_credentials.accessToken.create(result);
	     // console.log(accessToken); 
	     this_classinst.access_token = accessToken; 
	});
	*/ 	
    }


} 


const SELF_URL = "https://api.instagram.com/v1/users/self/?access_token="
const SELF_MEDIA_RECENT_URL = "https://api.instagram.com/v1/users/self/media/recent/?access_token=" 

class UsersEndpoint extends InstagramAPI {
    constructor(client_id, client_secret, redir_uri) {
	super(client_id, client_secret, redir_uri); 
    }
    
    get_selfInfo() {
	Helpers.HTTPS_Helper.Get(String(SELF_URL + this.access_token.token['access_token']), this._def_get_callback); 	
    }   

    get_selfMediaRecent() {
	Helpers.HTTPS_Helper.Get(String(SELF_MEDIA_RECENT_URL + this.access_token.token['access_token']), this._def_get_callback); 
    }

    _def_get_callback(res) {	
	res.on('data', function (res_data) {	    
		// console.log("_def_get_callback(res)"); 
		// console.log(JSON.parse(res_data.toString())); 
		console.log(res_data.toString()); 
        });     
	res.on('error', function (err) {
		console.error(err);  
	}); 	
    }
        
              
}	

// var InstAPI = new InstagramAPI('3a6c6164d69646fbba17c4b7bb515aeb', '915951d0c22143269b8fcd0725f65595', 'https://localhost:8081/callback_uri'); 

var InstAPI = new UsersEndpoint('3a6c6164d69646fbba17c4b7bb515aeb', '915951d0c22143269b8fcd0725f65595', 'https://localhost:8081/callback_uri'); 


https.createServer(options, function (req, res) {
    res.writeHead(200);

    pathName = url.parse(req.url).pathname;	
    if (pathName == '/callback_uri') {
	code = url.parse(req.url, true).query['code'] 	
    	// InstAPI._oauth2_get_access_token(code); 
	InstAPI._oauth2_get_access_token.call(InstAPI, code); 
    }
    
    if (InstAPI.access_token) { 
	res.end('access Token: \n' + InstAPI.access_token.token['access_token']);
	// InstAPI.get_selfInfo(); 
	InstAPI.get_selfMediaRecent();


	/* 
	 * Call to the User Endpoint API to retrieve data about the User whose acess token is referred to
	 */ 
	/*
	https.get('https://api.instagram.com/v1/users/self/?access_token=' + String(InstAPI.access_token.token['access_token']), function(res) {
	    res.on('data', function (res_data) {
		console.log(JSON.parse(res_data.toString())); 
	    });     
	    res.on('error', function (err) {
		console.error(err);  
	    }); 
	}); 
	*/ 
    }
    else
	res.end('HAAAY FUCKKEERRSSSS\n'); 

}).listen(8081);
 

