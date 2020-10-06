import WMTConfig from 'theme';

export function WindowHash(page, params = new Map()) {
    var obj = {};

    obj.set_page = function(page_name) {
        page = page_name;
    };

    obj.get_page = function() {
        return page;
    }

    obj.get_params = function() {
        return params;
    }

    obj.with_param = function(k, f) {
        if (params.has(k)) {
            f(params.get(k));
        }
    }

    obj.set_param = function(k, v) {
        params.set(k, v);
    };

    obj.clear = function() {
        params.clear();
    };

    let to_str = function() {
        let h = '#' + page;

        if (params.size > 0) {
            h += '?';
            for (const k of params.keys()) {
                h += encodeURI(k) + '=' + encodeURI(params.get(k));
            }
        }

        return h;
    };

    obj.replace_history = function() {
        window.history.replaceState(window.history.state, document.title, to_str());
    };

    obj.push_history = function() {
        window.history.pushState({}, '', to_str());
    };

    if (typeof page !== 'undefined') {
        return obj;
    }

    if (!window.location.hash) {
        page = '';
        return obj;
    }

    let parts = window.location.hash.substr(1).split('?', 2);
    page = parts[0];

    if (parts.length > 1) {
        parts[1].split('&').forEach(function(param) {
            let kv = param.split('=');
            if (kv.length == 2) {
                params.set(decodeURI(kv[0]), decodeURI(kv[1]));
            }
        });
    }

    return obj;
}

export function SavedState() {
    var hash = WindowHash();

    var with_local_storage = function(key, f) {
        let v = localStorage.getItem(key);
        if (v !== null) {
            f(v);
        }
    };

    return {
        mapview : function () {
            let center = [-7.9, 34.6];
            let zoom = 3.0;

            let parse_coords = function(mapview) {
                let parts = mapview.split('/');
                if (parts.length !== 3) {
                    parts = mapview.split('!');
                }
                if (parts.length === 3) {
                  zoom = parseFloat(parts[0]);
                  center = [parseFloat(parts[2]), parseFloat(parts[1])];
                }
            };

            with_local_storage('position', parse_coords);
            hash.with_param('map', parse_coords);

            return {center: [((center[0] + 180) % 360) - 180, ((center[1] + 90) % 180) - 90],
                    zoom: zoom};
        },

        basemap : function() {
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
        },

        opacity : function(storage_id, uri_id, defvalue) {
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
        },

        page_state : function() {
            return {page: hash.get_page(), params: hash.get_params()};
        }
    }
}

