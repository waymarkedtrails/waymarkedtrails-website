import { writable } from 'svelte/store';
import { WindowHash } from './util/window_hash.js';
import WMTConfig from 'theme';

export const page_state = writable(false);
export const map_view = writable(false);
export const basemap_id = writable(false);
export const map_opacity_base = writable(false);
export const map_opacity_route = writable(false);
export const map_opacity_shade = writable(false);
export const geolocation_tracking_enabled = writable(false);
export const map_view_demand = writable(false);

export function show_page(page = '', params = []) {
    page_state.set({page: page, params : new Map(params)});
}

map_view.subscribe(function (value) {
    if (value !== false) {
        let map_param = value.zoom.toFixed(4)
                        + '/' + value.center[0]
                        + '/' + value.center[1];

        localStorage.setItem('position', map_param);

        let h = WindowHash();
        h.set_param("map", map_param)
        h.replace_history();
    }
});

basemap_id.subscribe(function (value) {
    if (value !== false) {
        localStorage.setItem('basemap-id', WMTConfig.BASEMAPS[value].id);
    }
});

map_opacity_base.subscribe(function (value) {
    if (value !== false) {
        localStorage.setItem('opacity-base-layer', (value*100).toFixed(0));
    }
});

map_opacity_route.subscribe(function (value) {
    if (value !== false) {
        localStorage.setItem('opacity-route-layer', (value*100).toFixed(0));
    }
});

map_opacity_shade.subscribe(function (value) {
    if (value !== false) {
        localStorage.setItem('opacity-shade-layer', (value*100).toFixed(0));
    }
});

page_state.subscribe(function (value) {
    if (value !== false) {
        WindowHash(value.page, value.params).push_history();
    }
});
