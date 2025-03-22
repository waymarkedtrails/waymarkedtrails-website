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

function add_appendix_lengths(lengths, route) {
        for (const seg of route.appendices) {
            lengths[seg.role] = (lengths[seg.role] || 0) + seg.length;
        }
        for (const seg of route.main) {
            if (seg.route_type === 'route') {
                add_appendix_lengths(lengths, seg);
            }
        }
}

function has_same_direction(way, ele) {
    if (way.at(0) == way.at(-1)) {
        const waysum = way.reduce(
            function(acc, cur) {
                return {sum: acc.sum + (cur[0] - acc.prev[0])*(cur[1] + acc.prev[1]),
                        prev: cur}
            },
            {sum: 0, prev: way[0]}
        ).sum;
        const elesum = way.reduce(
            function (acc, cur) {
                return {sum: acc.sum + (cur.x - acc.prev.x)*(cur.y + acc.prev.y),
                        prev: cur};
            },
            {sum: 0, prev: way[0]}
        ).sum;
        return (waysum <= 0) == (elesum <= 0);
    }

    const frontdiff = Math.hypot(way[0][0] - ele[0].x, way[0][1] - ele[0].y);
    const backdiff = Math.hypot(way[0][0] - ele.at(-1).x, way[0][1] - ele.at(-1).y);

    return frontdiff < backdiff;
}

function append_elevation_segments(segments, route, ele) {
    if (route.route_type === 'route') {
        for (const seg of route.main) {
            append_elevation_segments(segments, seg, ele);
        }
    } else if (route.route_type === 'split') {
        for (const seg of route.forward) {
            append_elevation_segments(segments, seg, ele);
        }
    } else if (route.route_type === 'linear') {
        let current = segments[segments.length - 1].elevation;

        if (current.length > 0
                && Math.abs(current[current.length - 1].pos - route.start) > 1) {
            segments.push({elevation: []});
            current = segments[segments.length - 1].elevation;
        }

        let needfirst = current.length == 0;

        for (const way of route.ways) {
            const wayele = ele[way.id];
            if (wayele) {
                let usept = needfirst;
                let posfunc;
                if (has_same_direction(way.geometry.coordinates, wayele.elevation)) {
                    posfunc = pos => way.start + pos;
                } else {
                    wayele.elevation.reverse();
                    const elelen = wayele.elevation[0].pos;
                    posfunc = pos => way.start + elelen - pos;
                }
                for (const pt of wayele.elevation) {
                    if (usept) {
                        current.push({
                            x: pt.x,
                            y: pt.y,
                            ele: pt.ele,
                            pos: posfunc(pt.pos)
                        });
                    } else {
                        usept = true;
                    }
                }
                needfirst = false;
            } else {
                needfirst = true;
            }
        }
    }
}

function smooth_elevation_segment(segment) {
    let ascent = 0;

    let prev_ele = false;
    for (const pt of segment.elevation) {
        if (prev_ele !== false && prev_ele < pt.ele) {
            ascent += pt.ele - prev_ele;
        }
        prev_ele = pt.ele;
    }

    return ascent;
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

    appendix_lengths() {
        const lengths = {};
        add_appendix_lengths(lengths, this.route);

        return lengths;
    }

    get_elevation_profile(ele) {
        const profile = { ascent: 0, descent: 0,
                          min_elevation: ele.min_elevation,
                          max_elevation: ele.max_elevation,
                          end_position: 0,
                          segments: []};

        const segments = [{elevation: []}];
        append_elevation_segments(segments, this.route, ele.segments);
        const endsegment = segments[segments.length - 1].elevation;

        let total_ascent = 0;
        for (let seg of segments) {
            total_ascent += smooth_elevation_segment(seg);
        }
        let total_descent = segments[0].elevation[0].ele
                          - endsegment[endsegment.length - 1].ele
                          + total_ascent;
        if (total_descent < 0) {
            total_descent = 0;
        }

        return { ascent: total_ascent,
                 descent: total_descent,
                 min_elevation: ele.min_elevation,
                 max_elevation: ele.max_elevation,
                 end_position: endsegment[endsegment.length - 1].pos,
                 segments: segments};
    }
}

export function make_route_details(json) {
    return new RouteDetails(json);
}
