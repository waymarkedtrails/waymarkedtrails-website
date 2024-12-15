<script>
    import '../css/global.css';

    import { TITLE, BASEMAPS, HILLSHADING_URL, TILE_URL } from './config.js';
    import { isLoading, _ } from 'svelte-i18n';
    import { page_state } from './page_state.svelte.js';
    import { map_state } from './map_state.svelte.js';
    import { WindowHash } from './util/window_hash.js';
    import Map from './Map.svelte';
    import MapXYZLayer from './map/XYZLayer.svelte';
    import MapLayerRouteDetails from './map/LayerRouteDetails.svelte';
    import MapLayerVectorData from './map/LayerVectorData.svelte';
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

    let showhelp = false;

    $effect(() => {
        if (!$isLoading) {
            document.title = 'Waymarked Trails - ' + $_('site_title.' + TITLE);
            document.getElementById('meta-description')
                    .setAttribute('content', $_('site_description.' + TITLE));
        }
    });

    $effect(() => {
        if (map_state.extent !== false) {
            let map_param = map_state.zoom.toFixed(1)
                            + '/' + map_state.center[1]
                            + '/' + map_state.center[0];

            localStorage.setItem('position', map_param);

            const h = new WindowHash();
            h.set_param("map", map_param)
            h.replace_history();
        }
    });

    $effect(() => {
        const mapid = map_state.basemap_id;
        localStorage.setItem('basemap-id', BASEMAPS[mapid].id);
    });

    $effect(() => {
        localStorage.setItem('opacity-base-layer', (map_state.map_opacity_base * 100).toFixed(0));
    });

    $effect(() => {
        localStorage.setItem('opacity-route-layer', (map_state.map_opacity_route * 100).toFixed(0));
    });

    $effect(() => {
        localStorage.setItem('opacity-shade-layer', (map_state.map_opacity_shade * 100).toFixed(0));
    });

    $effect(() => {
        new WindowHash(page_state.page, page_state.params).push_history();
    });

    function handlePopState() {
        const hash = new WindowHash();
        page_state.show_page(hash.page, hash.params);
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

<svelte:window onpopstate={handlePopState} />

{#if $isLoading}
    Loading...
{:else}
<div class="screen">
    <Headline>
        {#snippet subleft()}
            <UpdateInfo />
        {/snippet}
        {#snippet subright()}
            <MapAttribution />
        {/snippet}
    </Headline>

    <Map>
        {#if page_state.page === 'settings'}<PanelSettings/>
        {:else if page_state.page === 'routelist'}<PanelRouteList/>
        {:else if page_state.page === 'route'}<PanelRouteDetails />
        {:else if page_state.page === 'search'}<PanelSearch />
        {:else if page_state.page === 'guidepost'}<PanelGuidepost />
        {/if}
    </Map>

    <MapXYZLayer {...BASEMAPS[map_state.basemap_id]} opacity={map_state.map_opacity_base}/>
    <MapXYZLayer name="hillshading" url={HILLSHADING_URL} opacity={map_state.map_opacity_shade} attribution='elevation' />
    <MapXYZLayer name="routelayer" url={TILE_URL} opacity={map_state.map_opacity_route}/>
    <MapLayerRouteDetails />
    <MapLayerVectorData />
    <MapLayerElevation />

    <Footer />
</div>

{#if page_state.page?.startsWith('help')}<PanelHelp />{/if}

{/if}
