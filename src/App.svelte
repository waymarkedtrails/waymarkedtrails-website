<script>
    import '../css/global.css';

    import { TITLE, BASEMAPS, HILLSHADING_URL, TILE_URL } from './config.js';
    import { isLoading, _ } from 'svelte-i18n';
    import { onDestroy } from 'svelte';
    import { basemap_id, map_opacity_base, map_opacity_shade, map_opacity_route, page_state } from './app_state.js';
    import { WindowHash } from './util/window_hash.js';
    import Map from './Map.svelte';
    import MapXYZLayer from './map/XYZLayer.svelte';
    import MapLayerRouteDetails from './map/LayerRouteDetails.svelte';
    import MapLayerVectorData from './map/LayerVectorData.svelte';
    import MapGeolocateLayer from './map/LayerGeolocate.svelte';
    import MapLayerElevation from './map/LayerElevation.svelte';
    import MapAttribution from './map/MapAttribution.svelte';
    import Headline from './Headline.svelte';
    import Footer from './Footer.svelte';
    import PanelRouteList from './PanelRouteList.svelte';
    import PanelRouteDetails from './PanelRouteDetails.svelte';
    import PanelSettings from './PanelSettings.svelte';
    import PanelSearch from './PanelSearch.svelte';
    import PanelGuidepost from './PanelGuidepost.svelte';
    import PanelHelp from './PanelHelp.svelte';
    import UpdateInfo from './UpdateInfo.svelte';

    let sidepanel = '';
    let showhelp = false;

    onDestroy(page_state.subscribe(value => sidepanel = value.page));

    $: {
        if (!$isLoading) {
            document.title = 'Waymarked Trails - ' + $_('site_title.' + TITLE);
            document.getElementById('meta-description')
                    .setAttribute('content', $_('site_description.' + TITLE));
        }
    }

    function handlePopState() {
        let hash = WindowHash();
        page_state.set({page: hash.get_page(), params: hash.get_params()});
    }
</script>

<style>
    .screen {
        position: absolute;
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%
    }
</style>

<svelte:head>
  <link rel="shortcut icon" href="/img/map_{TITLE}.ico" />
</svelte:head>

<svelte:window on:popstate={handlePopState} />

{#if $isLoading}
    Loading...
{:else}
<div class="screen">
    <Headline>
      <span slot="subleft"><UpdateInfo /></span>
      <span slot="subright"><MapAttribution /></span>
    </Headline>

    <Map>
      <MapXYZLayer {...BASEMAPS[$basemap_id]} opacity={$map_opacity_base}/>
      <MapXYZLayer name="hillshading" url={HILLSHADING_URL} opacity={$map_opacity_shade} attribution='elevation' />
      <MapXYZLayer name="routelayer" url={TILE_URL} opacity={$map_opacity_route}/>
      <MapGeolocateLayer />
      <MapLayerRouteDetails />
      <MapLayerVectorData />
      <MapLayerElevation />

      {#if sidepanel === 'settings'}<PanelSettings/>{/if}
      {#if sidepanel === 'routelist'}<PanelRouteList/>{/if}
      {#if sidepanel === 'route'}<PanelRouteDetails />{/if}
      {#if sidepanel === 'search'}<PanelSearch />{/if}
      {#if sidepanel === 'guidepost'}<PanelGuidepost />{/if}
    </Map>

    <Footer {sidepanel} />
</div>

{#if sidepanel.startsWith('help')}<PanelHelp />{/if}

{/if}
