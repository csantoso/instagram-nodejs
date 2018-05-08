const fs = require('fs') 

module.exports = {  
    CLIENT_ID: String('3a6c6164d69646fbba17c4b7bb515aeb'), 
    CLIENT_SECRET: String('915951d0c22143269b8fcd0725f65595'),  

    SSL_KEY: fs.readFileSync('certs/domain.key', 'utf8'),  
    SSL_CERT: fs.readFileSync('certs/domain.crt', 'utf8'),   
    
    REDIRCT_URI: String('https://localhost:8081/callback_uri') 

}
