<script>
    import '../css/global.css';
    import 'bootstrap/dist/css/bootstrap.css';

    import { TITLE, BASEMAPS, HILLSHADING_URL, TILE_URL } from './config.js';
    import { isLoading, _ } from 'svelte-i18n';
    import { onDestroy } from 'svelte';
    import { basemap_id, map_opacity_base, map_opacity_shade, map_opacity_route, page_state, show_page } from './app_state.js';
    import { WindowHash } from './util/window_hash.js';
    import Map from './Map.svelte';
    import MapXYZLayer from './map/XYZLayer.svelte';
    import MapLayerRouteDetails from './map/LayerRouteDetails.svelte';
    import MapLayerVectorData from './map/LayerVectorData.svelte';
    import MapGeolocateLayer, { enable_geolocation } from './map/LayerGeolocate.svelte';
    import MapLayerElevation from './map/LayerElevation.svelte';
    import Headline from './Headline.svelte';
    import PageFooter from './PageFooter.svelte';
    import PanelRouteList from './PanelRouteList.svelte';
    import PanelRouteDetails from './PanelRouteDetails.svelte';
    import PanelSettings from './PanelSettings.svelte';
    import PanelSearch from './PanelSearch.svelte';
    import PanelGuidepost from './PanelGuidepost.svelte';
    import PanelHelp from './PanelHelp.svelte';
    import UpdateInfo from './UpdateInfo.svelte';
    import SearchForm from './ui/SearchForm.svelte';
    import ButtonFooter from './ui/ButtonFooter.svelte';
    import SvgGeoPin from './svg/GeoPin.svelte';
    import SvgGear from './svg/Gear.svelte';
    import SvgInfo from './svg/Info.svelte';

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

<svelte:head>
  <link rel="shortcut icon" href="/img/map_{TITLE}.ico" />
</svelte:head>

<svelte:window on:popstate={handlePopState} />

{#if $isLoading}
Loading...
{:else}
<Map>
  <MapXYZLayer {...BASEMAPS[$basemap_id]} title={$_('settings.base_map')} opacity={$map_opacity_base}/>
  <MapXYZLayer name="hillshading" url={HILLSHADING_URL} opacity={$map_opacity_shade} title={$_('attribution.elevation_title')} attribution='<a href= "/help/acknowledgements">SRTM/ASTER</a>' />
  <MapXYZLayer name="routelayer" url={TILE_URL} opacity={$map_opacity_route}/>
  <MapGeolocateLayer />
  <MapLayerRouteDetails />
  <MapLayerVectorData />
  <MapLayerElevation />
</Map>

<Headline>
  <span slot="subleft"><UpdateInfo /></span>
  <span slot="subright"><span id="map-attribution"></span></span>
</Headline>

<PageFooter>
    <SearchForm />
    <div class="btn-group" role="group">
        <ButtonFooter title={$_('settings.title')} on:click={() => show_page('settings')}><SvgGear /></ButtonFooter>
        <ButtonFooter title={$_('locate_me')} on:click={enable_geolocation}><SvgGeoPin /></ButtonFooter>
        <ButtonFooter title={$_('help')} on:click={() => show_page(sidepanel.startsWith('help')?'':'help-about')}><SvgInfo /></ButtonFooter>
    </div>
    <div class="btn-group" role="group">
        <ButtonFooter on:click={() => show_page('routelist')}>{$_('routelist.title')}</ButtonFooter>
    </div>
</PageFooter>

{#if sidepanel === 'settings'}<PanelSettings/>{/if}
{#if sidepanel === 'routelist'}<PanelRouteList/>{/if}
{#if sidepanel === 'route'}<PanelRouteDetails />{/if}
{#if sidepanel === 'search'}<PanelSearch />{/if}
{#if sidepanel === 'guidepost'}<PanelGuidepost />{/if}
{#if sidepanel.startsWith('help')}<PanelHelp />{/if}
{/if}
