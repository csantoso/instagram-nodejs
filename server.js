/* Server runs on: 
 * http://35.199.168.212:8081/
 *
 *
 */ 

var mongo = require('mongodb') 
var http = require('http')

http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('FUCK YOU!');
    res.end();
}).listen(8081);



