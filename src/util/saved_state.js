import { WindowHash } from './window_hash.js';
import WMTConfig from 'theme';

let hash = WindowHash();

let with_local_storage = function(key, f) {
    let v = localStorage.getItem(key);
    if (v !== null) {
        f(v);
    }
};

export function get_mapview() {
    let center = [-7.9, 34.6];
    let zoom = 3.0;

    let parse_coords = function(mapview) {
        let parts = mapview.split('/');
        if (parts.length !== 3) {
            parts = mapview.split('!');
        }
        if (parts.length === 3) {
          zoom = parseFloat(parts[0]);
          center = [parseFloat(parts[1]), parseFloat(parts[2])];
        }
    };

    with_local_storage('position', parse_coords);
    hash.with_param('map', parse_coords);

    return {center: [((center[0] + 180) % 360) - 180,
                     ((center[1] + 90) % 180) - 90],
            zoom: zoom};
};

export function get_basemap() {
    let basemap_id = 0;

    let set_id_from = function (saved_id) {
        WMTConfig.BASEMAPS.forEach(function(item, i) {
            if (item.id === saved_id) {
                basemap_id = i;
            }
        });
    }

    with_local_storage('basemap-id', set_id_from);
    hash.with_param('basemap', set_id_from);

    return basemap_id;
};

export function get_opacity(storage_id, uri_id, defvalue) {
    let value = defvalue;

    with_local_storage(storage_id, function(saved) {
        let parsed = parseInt(saved, 10);
        if (parsed >= 0 && parsed <= 100) {
            value = parsed/100.0;
        }
    });

    hash.with_param(uri_id, function(v) {
        let parsed = parseFloat(v);
        if (parsed >= 0.0 && parsed <= 100.0) {
            value = parsed;;
        }
    });

    return defvalue;
};

export function get_page_state() {
    return {page: hash.get_page(), params: hash.get_params()};
};

