import { writable } from 'svelte/store';
import { SavedState } from './utils.js';

export const page_state = writable(SavedState.page_state());
export const map_view = writable(SavedState.mapview());
export const basemap_id = writable(SavedState.basemap());
export const map_opacity_base =
    writable(SavedState.opacity('opacity-base-layer', 'basemap-opacity', 1.0));
export const map_opacity_route =
    writable(SavedState.opacity('opacity-route-layer', 'routemap-opacity', 0.8));
export const map_opacity_shade =
    writable(SavedState.opacity('opacity-shade-layer', 'hill', 0.0));

map_view.subscribe(function (value) {
    let map_param = "map=" + value.zoom.toFixed(4)
                    + '/' + value.center[0]
                    + '/' + value.center[1];

    let h = window.location.hash || '#';
    if (h.indexOf('?') < 0)
        h = h + '?' + map_param;
    else if (h.indexOf('map=') >= 0)
        h = h.replace(new RegExp("map=[^&]*"), map_param);
    else
        h = h + '&' + map_param;

    window.history.replaceState(window.history.state, document.title, h);

    localStorage.setItem('position',
                         JSON.stringify({ center: value.center, zoom: value.zoom}));
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


