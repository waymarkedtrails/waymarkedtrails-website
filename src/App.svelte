<script>
    import '../css/global.css';

    import { onMount, onDestroy } from 'svelte';
    import jQuery from 'jquery';
    import WMTConfig from 'theme';
    import { basemap_id, map_opacity_base, map_opacity_shade, map_opacity_route, page_state } from './app_state.js';
    import { get_page_state, get_basemap, get_opacity } from './util/saved_state.js';
    import Map from './Map.svelte';
    import MapXYZLayer from './MapXYZLayer.svelte';
    import MapGeolocateLayer from './MapGeolocateLayer.svelte';
    import Headline from './Headline.svelte';
    import MapFooter from './MapFooter.svelte';
    import PanelRouteList from './PanelRouteList.svelte';
    import PanelRouteDetails from './PanelRouteDetails.svelte';
    import PanelSettings from './PanelSettings.svelte';
    import PanelSearch from './PanelSearch.svelte';

    let db_update = '';
    let copyright;
    let sidepanel = '';

    page_state.set(get_page_state());
    basemap_id.set(get_basemap());
    map_opacity_base.set(get_opacity('opacity-base-layer', 'basemap-opacity', 1.0));
    map_opacity_route.set(get_opacity('opacity-route-layer', 'routemap-opacity', 0.8));
    map_opacity_shade.set(get_opacity('opacity-shade-layer', 'hill', 0.0));

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

    const hillattr='elevation data by <a href= "https://hiking.waymarkedtrails.org/help/acknowledgements">SRTM/ASTER</a>';
</script>

<svelte:head>
  <title>DEV: Waymarked Trails - {WMTConfig.TITLE}</title>
</svelte:head>

<Map>
  <MapXYZLayer {...WMTConfig.BASEMAPS[$basemap_id]} opacity={$map_opacity_base}/>
  <MapXYZLayer name="hillshading" url={WMTConfig.HILLSHADING_URL} opacity={$map_opacity_shade} attribution={hillattr} />
  <MapXYZLayer name="routelayer" url={WMTConfig.TILE_URL} opacity={$map_opacity_route}/>
  <MapGeolocateLayer />
</Map>
<Headline>
  <span slot="subleft">Last Update: {db_update}</span>
  <span slot="subright"><span id="map-attribution"></span></span>
</Headline>
<MapFooter />

{#if sidepanel === 'settings'}<PanelSettings/>{/if}
{#if sidepanel === 'routelist'}<PanelRouteList/>{/if}
{#if sidepanel === 'route'}<PanelRouteDetails />{/if}
{#if sidepanel === 'search'}<PanelSearch />{/if}
