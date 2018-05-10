const https = require('https') 
const url = require('url')  
const fs = require('fs') 
const API = require("./endpoints.js")

const options = {
    key: fs.readFileSync('certs/domain.key', 'utf8'),
    cert: fs.readFileSync('certs/domain.crt', 'utf8')
};


var InstAPI = new API.Endpoints('3a6c6164d69646fbba17c4b7bb515aeb', '915951d0c22143269b8fcd0725f65595', 'https://localhost:8081/callback_uri'); 

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
        InstAPI.get_selfInfo(); 
        // InstAPI.get_selfMediaRecent();
        InstAPI.get_areaMedia(48.858844, 2.294351); 


    }   
    else
        res.end('HAAAY FUCKKEERRSSSS\n'); 

}).listen(8081);