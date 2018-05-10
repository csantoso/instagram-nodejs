const querystring = require('querystring');  
const https = require('https'); 
const http = require('http'); 

let auth = require('./auth.js') 
var client_id = auth.CLIENT_ID; 
var client_secret = auth.CLIENT_SECRET; 


class HTTPS_Helper {

    /* Https GET wrapper. 
     * :param host_url<String>: URL passed straight to https.get()
     * :param get_callback<Function> Callback function for https.get(). The callback function should accept a single parameter, which is an instance of http.IncomingMessage.
     * :return<Object>: The data_buffer object. 
     */
    static Get(host_url, get_callback) {
	https.get(host_url, get_callback);  
    } 

    static Post(host_url, data, post_callback) {
	/* UNIMPLEMENTED */ 
	return; 
    }
}

module.exports = {
    
    HTTPS_Helper: HTTPS_Helper, 

    /* Replaces the ${...} pattern in the <param>url_pattern</param> with some specified String. 
     * :param url_pattern<String>: The unformatted string containing ${...}s, which indicates 
     * patterns to in the input string toreplace. 
     * :param arguments[1...]<String>: String pattern to look for followed immediately by the pattern
     * to replace it with (tag_1, replacement_1, tag_2, replacement_2, tag_3, replacement_3, ...). 
     * e.g. 
     * var input_url = "https://api.instagram.com/v1/media/search?lat=${lat}&lng=${lng}&access_token=${access_token}"
     *					  |	tag  | replacement
     * ----------------------------------------- 
     format_url(input_url, 'lng', 'LONGITUDE', \
     *					   'lat', 'LATTITUDE', \
     *					   'access_token', 'WOOHOOACCESSTOKEN')
     * returns: https://api.instagram.com/v1/media/search?lat=LATTITUDE&lng=LONGITUDE&access_token=WOOHOOACCESSTOKEN
     *
     * :return<String>: Formatted string with patterns replaced by their consecutive arguments.
     * :comments: If duplicate tags are passed in, only the first one will be considered. 
     */
    format_url: function (url_pattern) {
		var formatted_url = url_pattern; 
		for(var i = 1; i < arguments.length - 1; i += 2) {
			var formatted_url = formatted_url.replace('${' + arguments[i] + '}', arguments[i+1]); 
		}
		return String(formatted_url); 
	}, 

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
