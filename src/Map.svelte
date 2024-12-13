<script module>
    let map;

    export function set_map_view(bbox) {
        if (bbox && map) {
            map.getView().fit(bbox, {size: map.getSize(), maxZoom: 18});
        }
    };
</script>

<script>
    import { onMount, setContext } from 'svelte';
    import { map_state } from './map_state.svelte.js';
    import { WindowHash } from './util/window_hash.js';

    import {Map, View} from 'ol';
    import {transform} from 'ol/proj';
    import {Attribution, ScaleLine, defaults as defaultControls} from 'ol/control';

    let { overlay } = $props();

    let has_map = $state(false);
    let component;

    setContext('olContext', () => map);

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

        let stored_pos = localStorage.getItem('position');
        if (stored_pos !== null) {
            parse_coords(stored_pos);
        }
        new WindowHash().with_param('map', parse_coords);

        return {center: [((center[0] + 180) % 360) - 180,
                         ((center[1] + 90) % 180) - 90],
                zoom: zoom};
    };


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

        has_map = true;

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
{#if has_map}{@render overlay?.()}{/if}
</div>
