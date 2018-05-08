var mongodb = require('mongodb') 
var https = require('https') 
var oauth2 = require('simple-oauth2')
var fs = require('fs') 
var url = require('url')  
var async_hooks = require('async_hooks') 

const options = {
    key: fs.readFileSync('certs/domain.key', 'utf8'),
    cert: fs.readFileSync('certs/domain.crt', 'utf8')
};

https.createServer(options, function (req, res) {
    res.writeHead(200);
    res.end('SUP FUCKERSSS\n');

    // console.log(req.url); 
    pathName = url.parse(req.url).pathname;	
    console.log(pathName); 
    if (pathName == '/callback_uri') {
	// TODO: Async Callback here 
	code = req.url.searchParams.get('code') 
	console.log(code);  
    }
}).listen(8081);
 

class InstagramAPI {
    constructor(client_id, client_secret, redir_uri) {
	this.client_id = client_id; 
	this.client_secret = client_secret; 
	this.redir_uri = redir_uri; 
	this.credentials = this.create_credentials(); 	
	
	this.redir_auth_url();  
    }

    redir_auth_url() {
    // https://api.instagram.com/oauth/authorize/?client_id=CLIENT-ID&redirect_uri=REDIRECT-URI&response_type=code
    console.log("Provide authorization here: https://api.instagram.com/oauth/authorize/?client_id=" + String(this.client_id) + "&redirect_uri=" + String(this.redir_uri) + "&response_type=code"); 
    }
    
    create_credentials() {
	var cred = {    
	    client: {   
		id: this.client_id,	
	    	secret: this.client_secret 
	    },
	    auth: {
		tokenHost: "https://api.instagram.com",   
		tokenPath: "https://api.instagram.com/oauth/access_token",   
		authorizePath: "https://api.instagram.com/oauth/authorize" 
	    }
	}   
	return oauth2.create(cred); 
    }
} 

iapi_inst = new InstagramAPI('3a6c6164d69646fbba17c4b7bb515aeb', '915951d0c22143269b8fcd0725f65595', 'https://localhost:8081/callback_uri'); 



// console.log(iapi_inst.credentials); 

