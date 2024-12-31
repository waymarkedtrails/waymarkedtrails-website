import { API_URL } from '../config.js';
import LineString from 'ol/geom/LineString.js';
import Feature from 'ol/Feature.js';

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
}

function make_route_subtitle(route) {
    if (route.local_name)
        return route.local_name;
    if (route.name && route.itinerary)
        return route.itinerary.join(' - ');
    return '';
}

function add_features(flist, route, role, inrel) {
    if (route.route_type === 'route') {
        const newinrel = inrel.slice();
        newinrel.push(route.id);
        for (const seg of route.main) {
            add_features(flist, seg, role, newinrel);
        }
        for (const alt of route.appendices) {
            for (const seg of alt.main) {
                add_features(flist, seg, role || alt.role, newinrel);
            }
        }
    } else if (route.route_type === 'split') {
        for (const seg of route.forward) {
            add_features(flist, seg, role, inrel);
        }
        for (const seg of route.backward) {
            add_features(flist, seg, role, inrel);
        }
    } else if (route.route_type === 'linear') {
        var coords = [];
        for (const way of route.ways) {
            coords.pop();
            coords = coords.concat(way.geometry.coordinates);
        }
        flist.push(new Feature({
            id: route.ways[0].id,
            role: role,
            relations: inrel,
            dir: route.ways[0].direction,
            geometry: new LineString(coords)
        }));
    }
}



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

    get_features() {
        const flist = [];
        add_features(flist, this.route, '', []);

        return flist;
    }

}

export function make_route_details(json) {
    return new RouteDetails(json);
}
