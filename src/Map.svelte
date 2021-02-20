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
    import {Attribution, defaults as defaultControls} from 'ol/control';

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
                      maxZoom: 18
                  }),
                  controls: defaultControls({attribution: false}).extend([attribution]),
              });

        map.on('moveend', function(evt) {
            let view = evt.map.getView();
            let center = transform(view.getCenter(), "EPSG:3857", "EPSG:4326");

            let zoom = view.getZoom();
            let x = (Math.round(center[0] * 10000) / 10000);
            let y = (Math.round(center[1] * 10000) / 10000);
            map_view.set({center: [x, y], zoom: zoom,
                          extent: view.calculateExtent(evt.map.getSize())});
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
