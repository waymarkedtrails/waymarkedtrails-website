<script context="module">
    let map;

    export function set_map_view(bbox) {
        if (bbox && map) {
            map.getView().fit(bbox, {size: map.getSize(), maxZoom: 18});
        }
    };
</script>

<script>
    import { onMount, setContext } from 'svelte';
    import { map_view } from './app_state.js';
    import { get_mapview } from './util/saved_state.js';
    import { get} from 'svelte/store';

    import {Map, View} from 'ol';
    import {transform} from 'ol/proj';
    import {Attribution, ScaleLine, defaults as defaultControls} from 'ol/control';

    let component;

    setContext('olContext', () => map);

    onMount(() => {
        let m = get_mapview();
        let attribution = new Attribution({
            className: 'map-attribution',
            target: 'map-attribution',
            collapsible: false,
            label: ''
        });
        map = new Map({
                  target: component,
                  view: new View({
                      center: transform(m.center, "EPSG:4326", "EPSG:3857"),
                      zoom: m.zoom,
                      maxZoom: 18,
                      constrainResolution: true
                  }),
                  controls: defaultControls({attribution: false})
                             .extend([attribution, new ScaleLine()]),
              });

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

            let zoom = Math.round(view.getZoom());
            let x = (Math.round(fx * 10000) / 10000);
            let y = (Math.round(center[1] * 10000) / 10000);
            map_view.set({center: [x, y], zoom: zoom, extent: extent});
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
{#if map}<slot></slot>{/if}
</div>
