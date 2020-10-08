<script>
    import '../css/global.css';

    import { onMount, onDestroy } from 'svelte';
    import jQuery from 'jquery';
    import WMTConfig from 'theme';
    import { basemap_id, map_opacity_base, map_opacity_shade, map_opacity_route, page_state } from './app_state.js';
    import Map from './Map.svelte';
    import MapXYZLayer from './MapXYZLayer.svelte';
    import MapGeolocateLayer from './MapGeolocateLayer.svelte';
    import Headline from './Headline.svelte';
    import MapFooter from './MapFooter.svelte';
    import PanelRouteList from './PanelRouteList.svelte';
    import PanelSettings from './PanelSettings.svelte';

    let db_update = '';
    let copyright;
    let sidepanel = '';

    onDestroy(page_state.subscribe(value => sidepanel = value.page));

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

<Map bind:copyright={copyright}>
  <MapXYZLayer {...WMTConfig.BASEMAPS[$basemap_id]} opacity={$map_opacity_base}/>
  <MapXYZLayer name="hillshading" url={WMTConfig.HILLSHADING_URL} opacity={$map_opacity_shade} />
  <MapXYZLayer name="routelayer" url={WMTConfig.TILE_URL} opacity={$map_opacity_route}/>
  <MapGeolocateLayer />
</Map>
<Headline>
  <span slot="subleft">Last Update: {db_update}</span>
  <span slot="subright">{copyright}</span>
</Headline>
<MapFooter />

{#if sidepanel === 'settings'}<PanelSettings/>{/if}
{#if sidepanel === 'routelist'}<PanelRouteList/>{/if}
