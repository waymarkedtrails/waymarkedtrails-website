import { API_URL } from '../config.js';

class RouteDetails {

    constructor(json) {
        Object.assign(this, json)
    }

    get wiki_url() {
        if (this.wikipedia) {
            return API_URL + '/details/' + osm_type + '/' + osm_id + '/wikilink'
        }
    }
}

export function make_route_details(json) {
    return new RouteDetails(json);
}
