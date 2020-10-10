<script>
    import { onMount, setContext } from 'svelte';
    import { map_view } from './app_state.js';
    import { get_mapview } from './util/saved_state.js';
    import { get} from 'svelte/store';

    import 'ol/ol.css';
    import {Map, View} from 'ol';
    import {transform} from 'ol/proj';

    export let copyright = '';

    let map;
    let component;

    setContext('olContext', () => map);

    onMount(() => {
        let m = get_mapview();
        map = new Map({
                  target: component,
                  view: new View({
                      center: transform(m.center, "EPSG:4326", "EPSG:3857"),
                      zoom: m.zoom
                  })
              });

        map.on('moveend', function(evt) {
            let view = evt.map.getView();
            let center = transform(view.getCenter(), "EPSG:3857", "EPSG:4326");

            let zoom = view.getZoom();
            let lon = (Math.round(center[1] * 10000) / 10000);
            let lat = (Math.round(center[0] * 10000) / 10000);
            map_view.set({center: [lon, lat], zoom: zoom,
                          extent: view.calculateExtent(evt.map.getSize())});
        });

        copyright = 'Map data © OpenStreetMap under ODbL elevation data by SRTM/ASTER Base map: OpenStreetMap(CC-by-SA)';
        });
</script>

<style>
      div {
        position: absolute;
        top: var(--headline-total-height);
        bottom: 0;
        width: 100%;
      }
</style>

<div bind:this={component}>
{#if map}<slot></slot>{/if}
</div>
