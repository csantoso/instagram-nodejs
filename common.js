const querystring = require('querystring');  
const https = require('https'); 
const http = require('http'); 

let auth = require('./auth.js') 
var client_id = auth.CLIENT_ID; 
var client_secret = auth.CLIENT_SECRET; 


module.exports = {

    /* Build the data object to make a POST request for the Access Token. 
     * :param data<String>: The 'code' retrieved from the manual user auth 
     */
    _Build_AccessTokenPostData: function(data) {
	var post_data = {
	    'client_id': auth.CLIENT_ID, 
	    'client_secret': auth.CLIENT_SECRET, 
	    'grant_type': 'authorization_code', 
	    'redirect_uri': auth.REDIRCT_URI, 
	    'code': String(data) 
	}
	console.log("Built post_data: "); 
	console.log(post_data);  
	return post_data; 
    }, 

    /* Make an POST request to the Instagram API server. 
     * :param data<string> stringify()'d querystring of the data object 
     */
    Post: function(data) {	

	var post_data = {
	    'client_id': auth.CLIENT_ID, 
	    'client_secret': auth.CLIENT_SECRET, 
	    'grant_type': 'authorization_code', 
	    'redirect_uri': auth.REDIRCT_URI, 
	    'code': String(data) 
	}
	
	var data = querystring.stringify(post_data); 

	var options = {
	    host: 'http://api.instagram.com/oauth/access_token', 
	    method: 'POST',
	    headers: {
		'Content-Type': 'application/x-www-form-urlencoded',	
		//'Content-Length': data.length
		'Content-Length': Buffer.byteLength(data) 
	    }
	}

	var post_req = http.request(options, function(res) {
	    res.setEncoding('utf8');
	    res.on('data', function(data_chunk) {
		console.log(data_chunk); 
	    }); 
	}); 
	
	post_req.write(data);
	post_req.end(); 
    }

}
