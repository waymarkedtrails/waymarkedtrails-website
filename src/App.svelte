<script>
    import '../css/global.css';

    import { onMount } from 'svelte';
    import jQuery from 'jquery';
    import WMTConfig from 'theme';
    import { basemap_id, map_opacity_base, map_opacity_shade, map_opacity_route } from './app_state.js';
    import Map from './Map.svelte';
    import MapXYZLayer from './MapXYZLayer.svelte';
    import MapGeolocateLayer from './MapGeolocateLayer.svelte';
    import Headline from './Headline.svelte';
    import MapFooter from './MapFooter.svelte';

    let db_update = '';
    let copyright;

    onMount(() => {
        jQuery.getJSON(WMTConfig.API_URL + '/status', function (data) {
            if (data.server_status == 'OK') {
                const update = new Date(Date.parse(data.last_update));
                db_update = update.toLocaleString(navigator.languages);
            } else {
                db_update = "API unavailable";
            }
        });
    });
</script>

<svelte:head>
  <title>DEV: Waymarked Trails - {WMTConfig.TITLE}</title>
</svelte:head>

<Headline>
  <span slot="subleft">Last Update: {db_update}</span>
  <span slot="subright">{copyright}</span>
</Headline>
<Map bind:copyright={copyright}>
  <MapXYZLayer {...WMTConfig.BASEMAPS[$basemap_id]} opacity={$map_opacity_base}/>
  <MapXYZLayer name="hillshading" url={WMTConfig.HILLSHADING_URL} opacity={$map_opacity_shade} />
  <MapXYZLayer name="routelayer" url={WMTConfig.TILE_URL} opacity={$map_opacity_route}/>
  <MapGeolocateLayer />
</Map>
<MapFooter />
