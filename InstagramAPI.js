/********************************************************************************************
*                                     I M P O R T S                                         *
*********************************************************************************************/
const https = require('https') 
const oauth2 = require('simple-oauth2')
const Helpers = require("./common.js") 


/********************************************************************************************
*                                   C O N S T A N T S                                       *
*********************************************************************************************/
const InstagramTokenHost = "https://api.instagram.com"; 
const InstagramTokenPath = "https://api.instagram.com/oauth/access_token"; 
const InstagramAuthorizePath = "https://api.instagram.com/oauth/authorize";  


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
   
    /* The first step in retrieving an access token from the Instagram API is to prompt the user whose account we're tyring to gain access to for permission to do so. This is done by simply telling the user to grant us access via. the URL template below 
     * :params: None
     * :return: None 
     */
    _prompt_auth_url() {
        console.log("https://api.instagram.com/oauth/authorize/?client_id=" + String(this.client_id) + "&redirect_uri=" + String(this.redir_uri) + "&response_type=code&scope=public_content"); 
    }
    
    _prompt_implicit_auth_url() {
        console.log("https://api.instagram.com/oauth/authorize/?client_id=" + String(this.client_id) + "&redirect_uri=" + String(this.redir_uri) + "&response_type=token"); 
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
        console.log(this.access_token); 
    }

    _def_get_callback(res) {
        res.on('data', function (res_data) {
            // console.log(JSON.parse(res_data.toString())); 
            console.log(res_data.toString()); 
        });    
        res.on('error', function (err) {
            console.error(err);  
        });    
    }     
} 

module.exports = {
    InstagramAPI: InstagramAPI
}
