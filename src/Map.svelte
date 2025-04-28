<script>
    import { onMount } from 'svelte';
    import { map_state } from './map_state.svelte.js';
    import { WindowHash } from './util/window_hash.js';

    import {View} from 'ol';
    import {transform} from 'ol/proj';
    import {Attribution, ScaleLine, Zoom} from 'ol/control';

    let { children } = $props();
    const children_render = $derived(children);

    let component;

    function get_mapview() {
        let center = [-7.9, 34.6];
        let zoom = 3;

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

        let win = new WindowHash();

        if (win.params.size === 0) {
            let stored_pos = localStorage.getItem('position');
            if (stored_pos !== null) {
                parse_coords(stored_pos);
            }
        }
        win.with_param('map', parse_coords);

        return {center: [((center[0] + 180) % 360) - 180,
                         ((center[1] + 90) % 180) - 90],
                zoom: zoom};
    };


    onMount(() => {
        let m = get_mapview();
        let map = map_state.map;
        map.setTarget(component);
        map.setView(new View({
                      center: transform(m.center, "EPSG:4326", "EPSG:3857"),
                      zoom: m.zoom,
                      maxZoom: 18,
                      constrainResolution: true
        }));
        map.addControl(new Zoom());
        map.addControl(new Attribution({
            className: 'map-attribution',
            target: 'map-attribution',
            collapsible: false,
            label: ''
        }));
        map.addControl(new ScaleLine());

        map.on('moveend', function(evt) {
            let view = evt.map.getView();
            let center = transform(view.getCenter(), "EPSG:3857", "EPSG:4326");
            let extent = view.calculateExtent(evt.map.getSize());

            let fx = center[0];
            if (fx > 180) {
                fx = (fx + 180) % 360 - 180;
                let shift = (center[0] - fx) / 360 * 2 * 20037508.34;
                extent = [extent[0] - shift, extent[1],
                                extent[2] - shift, extent[3]]
            } else if (fx < -180) {
                fx = 180 - (-fx - 180) % 360;
                let shift = (center[0] - fx) / 360 * 2 * 20037508.34;
                extent = [extent[0] - shift, extent[1],
                                extent[2] - shift, extent[3]]
            }

            map_state.zoom = Math.round(view.getZoom());
            map_state.center = [Math.round(fx * 10000) / 10000, Math.round(center[1] * 10000) / 10000];
            map_state.extent = extent;
        });
    });
</script>

<style>
    div {
        position: relative;
        width: 100%;
        flex-grow: 1;
    }
</style>

<div bind:this={component}>
    {@render children_render?.()}
</div>
