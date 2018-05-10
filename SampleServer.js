const https = require('https') 
const url = require('url')  
const fs = require('fs') 
const API = require("./instagram/endpoints.js")

const options = {
    key: fs.readFileSync('certs/domain.key', 'utf8'),
    cert: fs.readFileSync('certs/domain.crt', 'utf8')
};

// constructor(client_id, client_secret, redir_uri) {

var InstAPI = new API.Endpoints('<client_id>', '<client_secret>', '<redirect_uri>'); 

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
        // InstAPI.get_selfMediaRecent();
        // InstAPI.get_areaMedia(40.7831, -73.9712, 3000);  // Won't work because I'm in Sandbox mode *Note 1
        // InstAPI.get_mediaComments("1545237543116572325_1715989885"); 
        // InstAPI.get_taggedObject("yeezy");  // 8768714 tags lol holy shit 
        // InstAPI.get_recentTags("yeezy", "1545237543116572325_1715989885", "0_0", "10");  // Probably works, but I'm in Sandbox mode 
        // InstAPI.get_recentTags("yeezy", null, null, null);  // Invokes the shorthand version 
        // InstAPI.get_searchTags("pokemon");  // :) 
        // InstAPI.get_locationFromLatLng(40.7831, -73.9712, 3000);  // "3000913" = American Museum of Natural History, "345177122588760" = Central Park 
        // InstAPI.get_locationInfo("3000913"); 
        // InstAPI.get_recentMediaByLocation(3000913, "1545237543116572325_1715989885", "0_0"); 
        // InstAPI.get_recentMediaByLocation(3000913); 
        // InstAPI.get_locationFromFbID(345177122588760, 3000); 
    }   
    else
        res.end('SampleServer.js up and running! Good job dude\n'); 

}).listen(8081);



/* 
 * Note 1: "The first point is important and it means that the API 
 * behaves as if the only users on Instagram were your sandbox users, and 
 * the only media ever posted were the last 20 for each of these users."
 *   
 */ 