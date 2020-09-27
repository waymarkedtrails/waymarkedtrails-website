<script>
    import { onMount, setContext } from 'svelte';

    import 'ol/ol.css';
    import {Map, View} from 'ol';
    import TileLayer from 'ol/layer/Tile';
    import XYZ from 'ol/source/XYZ';

    export let lat = 0;
    export let lon = 0;
    export let zoom = 2;

    let map;

    onMount(() => {
            map = new Map({target: 'app-map',
                 layers: [
                   new TileLayer({source: new XYZ({
                        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                       })
                      })
                         ],
                 view: new View({center: [lon, lat], zoom: zoom})
            });
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

<div id="app-map"></div>
