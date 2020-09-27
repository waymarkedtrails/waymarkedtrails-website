import WMTConfig from 'theme';

export const SavedState = {
    mapview : function () {
        let center = [-7.9, 34.6];
        let zoom = 3.0;

        if (localStorage.getItem('position') !== null) {
            let view = JSON.parse(localStorage.getItem('position'));
            center = view.center || center;
            zoom = view.zoom || zoom;
        }

        let url_view = decodeURI(window.location.hash.replace(
                   new RegExp("^(?:.*[&\\?]map(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        if (url_view) {
            let parts = url_view.split('/');
            if (parts.length !== 3) {
                parts = url_view.split('!');
            }
            if (parts.length === 3) {
              zoom = parseFloat(parts[0]);
              center = [parseFloat(parts[2]), parseFloat(parts[1])];
            }
        }

        return {center: [((center[0] + 180) % 360) - 180, ((center[1] + 90) % 180) - 90],
                zoom: zoom};
    },

    basemap : function() {
        let basemap_id = 0;

        let saved_id = localStorage.getItem('basemap-id');
        if (saved_id !== null) {
            WMTConfig.BASEMAPS.forEach(function(item, i) {
                if (item.id === saved_id) {
                    basemap_id = i;
                }
            });
        }

        saved_id = decodeURI(window.location.hash.replace(
                    new RegExp("^(?:.*[&\\?]basemap(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        if (saved_id) {
            WMTConfig.BASEMAPS.forEach(function(item, i) {
                if (item.id === saved_id) {
                    basemap_id = i;
                }
            });
        }

        return basemap_id;
    },

    opacity : function(storage_id, uri_id, defvalue) {
        let saved = decodeURI(window.location.hash.replace(
                        new RegExp("^(?:.*[&\\?]" + uri_id + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        if (saved) {
            let val = parseFloat(saved);
            if (val >= 0.0 && val <= 100.0) {
                return val;
            }
        }

        saved = localStorage.getItem(storage_id);
        if (saved !== null) {
            let val = parseInt(saved, 10);
            if (val >= 0 && val <= 100) {
                return val/100.0;
            }
        }

        return defvalue;
    },

    page_state : function() {
        let hash = window.location.hash;
        if (!hash) {
            return '';
        }

        return hash.split('?', 1)[0].substr(1);
    }
}

