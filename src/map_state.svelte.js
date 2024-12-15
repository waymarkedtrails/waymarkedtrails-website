import { BASEMAPS } from './config.js';
import { WindowHash } from './util/window_hash.js';
import {Map} from 'ol';

function with_local_storage(key, f) {
    let v = localStorage.getItem(key);
    if (v !== null) {
        f(v);
    }
}

function get_opacity(hash, storage_id, uri_id, defvalue) {
    let value = defvalue;

    with_local_storage(storage_id, function(saved) {
        let parsed = parseInt(saved, 10);
        if (parsed >= 0 && parsed <= 100) {
            value = parsed/100.0;
        }
    });

    hash.with_param(uri_id, function(v) {
        let parsed = parseFloat(v);
        if (parsed >= 0.0 && parsed <= 1.0) {
            value = parsed;
        }
    });

    return value;
};


class MapState {
    extent = $state(false);
    basemap_id = $state(0);
    map_opacity_base = $state();
    map_opacity_route = $state();
    map_opacity_shade = $state();
    vector_routes = $state.raw([]); // routes that need to be available as vector data
    highlighted_route = $state.raw();

    // derived properties
    zoom = 0;
    center = [0, 0];
    #ol_map;

    #set_basemap_id_from(saved_id) {
        let newidx = BASEMAPS.findIndex((elem) => { return elem.id === saved_id; });
        if (newidx >= 0) {
            this.basemap_id = newidx;
        }
    }

    constructor() {
        let hash = new WindowHash();

        with_local_storage('basemap-id', this.#set_basemap_id_from.bind(this));
        hash.with_param('basemap', this.#set_basemap_id_from.bind(this));

        this.map_opacity_base = get_opacity(hash, 'opacity-base-layer', 'basemap-opacity', 1.0);
        this.map_opacity_route = get_opacity(hash, 'opacity-route-layer', 'routemap-opacity', 0.8);
        this.map_opacity_shade = get_opacity(hash, 'opacity-shade-layer', 'hill', 0.0);

        this.ol_map = new Map({controls: []});
    }

    get map() {
        return this.ol_map;
    }

    set_map_view(bbox) {
        if (bbox && this.map) {
            this.map.getView()?.fit(bbox, {size: this.map.getSize(), maxZoom: 18});
        }
    };

};

export const map_state = new MapState();
