/********************************************************************************************
*                              I M P O R T S  /  C O N S T A N T S                          *
*********************************************************************************************/
const API = require("./InstagramAPI.js")
const Helpers = require("./common.js")

var SELF_URL = "https://api.instagram.com/v1/users/self/?access_token=${access_token}"
var SELF_MEDIA_RECENT_URL = "https://api.instagram.com/v1/users/self/media/recent/?access_token=${access_token}"

var MEDIA_SEARCH_URL = "https://api.instagram.com/v1/media/search?lat=${lat}&lng=${lng}&access_token=${access_token}"


class Endpoints extends API.InstagramAPI {
    constructor(client_id, client_secret, redir_uri) {
        super(client_id, client_secret, redir_uri);
    }

    get_selfInfo() {
        const host_url = Helpers.format_url(SELF_URL, 'access_token', this.access_token.token['access_token']); 
        console.log(host_url); 
        Helpers.HTTPS_Helper.Get(host_url, this._def_get_callback);
    }

    get_selfMediaRecent() {
        const host_url = Helpers.format_url(SELF_MEDIA_RECENT_URL, 'access_token', this.access_token.token['access_token']); 
        console.log(host_url); 
        Helpers.HTTPS_Helper.Get(host_url, this._def_get_callback);    
    }

    get_areaMedia(latitude, longitude) {
        const host_url = Helpers.format_url(MEDIA_SEARCH_URL, 'lat', latitude.toString(), 'lng', longitude.toString(), 'access_token', this.access_token.token['access_token']); 
        console.log(host_url); 
        Helpers.HTTPS_Helper.Get(host_url, this._def_get_callback);
    }

}


module.exports = {
    Endpoints: Endpoints, 
}
