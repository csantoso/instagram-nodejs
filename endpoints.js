/********************************************************************************************
*                              I M P O R T S  /  C O N S T A N T S                          *
*********************************************************************************************/
const API = require("./InstagramAPI.js")
const Helpers = require("./common.js")

var SELF_URL = "https://api.instagram.com/v1/users/self/?access_token=${access_token}"
var SELF_MEDIA_RECENT_URL = "https://api.instagram.com/v1/users/self/media/recent/?access_token=${access_token}"

var MEDIA_SEARCH_URL = "https://api.instagram.com/v1/media/search?lat=${lat}&lng=${lng}&distance=${distance}&access_token=${access_token}"

var COMMENTS_URL = "https://api.instagram.com/v1/media/${media_id}/comments?access_token=${access_token}"

var TAGGED_OBJ_URL = "https://api.instagram.com/v1/tags/${tag_name}?access_token=${access_token}"
var RECENT_TAG_URL = "https://api.instagram.com/v1/tags/${tag_name}/media/recent?access_token=${access_token}&max_tag_id=${max_tag_id}&min_tag_id=${min_tag_id}&count=${count}"
var SHORT_RECENT_TAG_URL = "https://api.instagram.com/v1/tags/${tag_name}/media/recent?access_token=${access_token}"
var SEARCH_TAGS_URL = "https://api.instagram.com/v1/tags/search?q=${tag}&access_token=${access_token}"

var LOCATION_INFO_URL = "https://api.instagram.com/v1/locations/${location_id}?access_token=${access_token}"
var MEDIA_BY_LOCATION_URL = "https://api.instagram.com/v1/locations/${location_id}/media/recent?max_id=?${max_id}&min_id=${min_id}&access_token=${access_token}"
var SHORT_MEDIA_BY_LOCATION_URL = "https://api.instagram.com/v1/locations/${location_id}/media/recent?access_token=${access_token}"
var SEARCH_LOCATION_URL = "https://api.instagram.com/v1/locations/search?lat=${lat}&lng=${lng}&distance=${distance}&access_token=${access_token}"
var FB_SEARCH_LOCATION_URL = "https://api.instagram.com/v1/locations/search?facebook_places_id=${facebook_places_id}&distance=${distance}&access_token=${access_token}"


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

    get_areaMedia(latitude, longitude, distance) {
        const host_url = Helpers.format_url(MEDIA_SEARCH_URL, 'lat', latitude.toString(),
                                                                'lng', longitude.toString(), 
                                                                'distance', distance.toString(), 
                                                                'access_token', this.access_token.token['access_token']); 
        console.log(host_url); 
        Helpers.HTTPS_Helper.Get(host_url, this._def_get_callback);
    }

    get_mediaComments(media_id) {
        const host_url = Helpers.format_url(COMMENTS_URL, 'media_id', media_id.toString(), 
                                                        'access_token', this.access_token.token['access_token']);
        console.log(host_url); 
        Helpers.HTTPS_Helper.Get(host_url, this._def_get_callback);
    }

    get_taggedObject(tag_name) {
        const host_url = Helpers.format_url(TAGGED_OBJ_URL, 'tag_name', tag_name.toString(), 
                                                            'access_token', this.access_token.token['access_token']);
        console.log(host_url); 
        Helpers.HTTPS_Helper.Get(host_url, this._def_get_callback);
    }

    get_recentTags(tag_name, max_tag_id, min_tag_id, count) {
        // console.log(max_tag_id, min_tag_id, count); 
        let host_url = ''; 
        if (max_tag_id == null || min_tag_id == null || count == null) {
            host_url = Helpers.format_url(SHORT_RECENT_TAG_URL, 'tag_name', tag_name.toString(), 
                                                                'access_token', this.access_token.token['access_token']);
        } else {
            host_url = Helpers.format_url(RECENT_TAG_URL, 'tag_name', tag_name.toString(), 
                                                            'max_tag_id', max_tag_id.toString(), 
                                                            'min_tag_id', min_tag_id.toString(),
                                                            'count', count.toString(), 
                                                            'access_token', this.access_token.token['access_token']);
        }
        console.log(host_url); 
        Helpers.HTTPS_Helper.Get(host_url, this._def_get_callback);
    }

    get_searchTags(tag) {
        const host_url = Helpers.format_url(SEARCH_TAGS_URL, 'tag', tag.toString(), 
                                                            'access_token', this.access_token.token['access_token']);
        console.log(host_url); 
        Helpers.HTTPS_Helper.Get(host_url, this._def_get_callback);
    }

    get_locationInfo(location_id) {
        const host_url = Helpers.format_url(LOCATION_INFO_URL, 'location_id', location_id.toString(), 
                                                            'access_token', this.access_token.token['access_token']);
        console.log(host_url); 
        Helpers.HTTPS_Helper.Get(host_url, this._def_get_callback);
    }

    get_recentMediaByLocation(location_id, max_id, min_id) {
        let host_url = ''; 
        if (max_id == null || min_id == null) {
            host_url = Helpers.format_url(SHORT_MEDIA_BY_LOCATION_URL, 'location_id', location_id.toString(), 
                                                                    'access_token', this.access_token.token['access_token']);
        } else {
            host_url = Helpers.format_url(MEDIA_BY_LOCATION_URL, 'location_id', location_id.toString(), 
                                                                'max_id', max_id.toString(), 
                                                                'min_id', min_id.toString(), 
                                                                'access_token', this.access_token.token['access_token']);
        }
        console.log(host_url); 
        Helpers.HTTPS_Helper.Get(host_url, this._def_get_callback);
    }

    get_locationFromLatLng(latitude, longitude, distance) {
        const host_url = Helpers.format_url(SEARCH_LOCATION_URL, 'lat', latitude.toString(), 
                                                                'lng', longitude.toString(), 
                                                                'distance', distance.toString(), 
                                                                'access_token', this.access_token.token['access_token']);
        console.log(host_url); 
        Helpers.HTTPS_Helper.Get(host_url, this._def_get_callback);
    }    

    get_locationFromFbID(fb_places_id, distance) {
        const host_url = Helpers.format_url(FB_SEARCH_LOCATION_URL, 'facebook_places_id', fb_places_id.toString(),  
                                                                'distance', distance.toString(),
                                                                'access_token', this.access_token.token['access_token']);
        console.log(host_url); 
        Helpers.HTTPS_Helper.Get(host_url, this._def_get_callback);
    }

}


module.exports = {
    Endpoints: Endpoints, 
}
