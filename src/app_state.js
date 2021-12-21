import { writable } from 'svelte/store';
import { BASEMAPS } from './config.js';
import { WindowHash } from './util/window_hash.js';
import { get_page_state, get_basemap, get_opacity } from './util/saved_state.js';

export const map_view = writable(false);
export const page_state = writable(get_page_state());
export const basemap_id = writable(get_basemap());
export const map_opacity_base
    = writable(get_opacity('opacity-base-layer', 'basemap-opacity', 1.0));
export const map_opacity_route
    = writable(get_opacity('opacity-route-layer', 'routemap-opacity', 0.8));
export const map_opacity_shade
    = writable(get_opacity('opacity-shade-layer', 'hill', 0.0));

export function show_page(page = '', params = []) {
    page_state.set({page: page, params : new Map(params)});
}

map_view.subscribe(function (value) {
    if (value !== false) {
        let map_param = value.zoom.toFixed(1)
                        + '/' + value.center[1]
                        + '/' + value.center[0];

        localStorage.setItem('position', map_param);

        let h = WindowHash();
        h.set_param("map", map_param)
        h.replace_history();
    }
});

basemap_id.subscribe(function (value) {
    localStorage.setItem('basemap-id', BASEMAPS[value].id);
});

map_opacity_base.subscribe(function (value) {
    localStorage.setItem('opacity-base-layer', (value*100).toFixed(0));
});

map_opacity_route.subscribe(function (value) {
    localStorage.setItem('opacity-route-layer', (value*100).toFixed(0));
});

map_opacity_shade.subscribe(function (value) {
    localStorage.setItem('opacity-shade-layer', (value*100).toFixed(0));
});

page_state.subscribe(function (value) {
    WindowHash(value.page, value.params).push_history();
});
