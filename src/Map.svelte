<script>
    import { onMount, setContext, onDestroy } from 'svelte';
    import { map_view, map_view_demand } from './app_state.js';
    import { get_mapview } from './util/saved_state.js';
    import { get} from 'svelte/store';

    import 'ol/ol.css';
    import {Map, View} from 'ol';
    import {transform} from 'ol/proj';
    import {Attribution, defaults as defaultControls} from 'ol/control';

    let map;
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
                      zoom: m.zoom
                  }),
                  controls: defaultControls({attribution: false}).extend([attribution]),
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
    });

    onDestroy(map_view_demand.subscribe(function (value) {
        if (value && map) {
            map.getView().fit(value, { size: map.getSize(),
                                       maxZoom: 18
                                     });
        }
    }));
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
