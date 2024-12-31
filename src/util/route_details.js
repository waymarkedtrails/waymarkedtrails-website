import { API_URL } from '../config.js';

function make_route_title(route) {
    if (route.name)
      return route.name;
    if (route.itinerary)
      return route.itinerary.join(' - ');
    if (route.symbol_description)
      return route.symbol_description;
    if (route.ref)
      return '[' + route.ref + ']';
    return '(' + route.id + ')';
};

function make_route_subtitle(route) {
    if (route.local_name)
        return route.local_name;
    if (route.name && route.itinerary)
        return route.itinerary.join(' - ');
    return '';
};


class RouteOverview {

    constructor(json) {
        Object.assign(this, json);
        this.title = make_route_title(this);
        this.subtitle = make_route_subtitle(this);
    }

}

class RouteDetails {

    constructor(json) {
        Object.assign(this, json);
    }

    get title() {
        return make_route_title(this);
    }

    get osm_type() {
        return this.type || 'relation';
    }

    get wiki_url() {
        if (this.wikipedia) {
            return API_URL + '/details/' + this.osm_type + '/' + this.id + '/wikilink';
        }
    }

    parent_list() {
        return Object.values(this.superroutes).map((r) => new RouteOverview(r));
    }

    section_list() {
        const sections = [];

        for (const sec of this.route.main) {
            if (sec.route_type === 'route') {
                sections.push(new RouteOverview(this.subroutes[sec.id.toString()]));
            }
        }

        for (const alt of this.route.appendices) {
            for (const sec of alt.main) {
                if (sec.route_type === 'route') {
                    sections.push(new RouteOverview(this.subroutes[sec.id.toString()]));
                }
            }
        }

        return sections;
    }
}

export function make_route_details(json) {
    return new RouteDetails(json);
}
