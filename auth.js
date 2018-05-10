const fs = require('fs') 

module.exports = {  
    CLIENT_ID: '<client_id>', 
    CLIENT_SECRET: '<client_secret>,  

    SSL_KEY: fs.readFileSync('certs/domain.key', 'utf8'),  
    SSL_CERT: fs.readFileSync('certs/domain.crt', 'utf8'),   
    
    REDIRCT_URI: String('https://localhost:8081/callback_uri') 

}
