import { writable } from 'svelte/store';
import { SavedState, WindowHash } from './utils.js';

let s = SavedState();

export const page_state = writable(s.page_state());
export const map_view = writable(s.mapview());
export const basemap_id = writable(s.basemap());
export const map_opacity_base =
    writable(s.opacity('opacity-base-layer', 'basemap-opacity', 1.0));
export const map_opacity_route =
    writable(s.opacity('opacity-route-layer', 'routemap-opacity', 0.8));
export const map_opacity_shade =
    writable(s.opacity('opacity-shade-layer', 'hill', 0.0));
export const geolocation_tracking_enabled = writable(false);

map_view.subscribe(function (value) {
    let map_param = value.zoom.toFixed(4)
                    + '/' + value.center[0]
                    + '/' + value.center[1];

    localStorage.setItem('position', map_param);

    let h = WindowHash();
    h.set_param("map", map_param)
    h.replace_history();
});

basemap_id.subscribe(function (value) {
    localStorage.setItem('basemap-id', value);
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
