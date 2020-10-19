<script>
    import '../css/global.css';
    import 'bootstrap/dist/css/bootstrap.css';

    import { onDestroy } from 'svelte';
    import WMTConfig from 'theme';
    import { basemap_id, map_opacity_base, map_opacity_shade, map_opacity_route, page_state, show_page } from './app_state.js';
    import { get_page_state, get_basemap, get_opacity } from './util/saved_state.js';
    import Map from './Map.svelte';
    import MapXYZLayer from './MapXYZLayer.svelte';
    import MapGeolocateLayer from './map/LayerGeolocate.svelte';
    import Headline from './Headline.svelte';
    import PageFooter from './PageFooter.svelte';
    import PanelRouteList from './PanelRouteList.svelte';
    import PanelRouteDetails from './PanelRouteDetails.svelte';
    import PanelSettings from './PanelSettings.svelte';
    import PanelSearch from './PanelSearch.svelte';
    import UpdateInfo from './UpdateInfo.svelte';
    import { enable_geolocation } from './map/LayerGeolocate.svelte';
    import SearchForm from './ui/SearchForm.svelte';
    import ButtonFooter from './ui/ButtonFooter.svelte';
    import GeoPin from './svg/GeoPin.svelte';
    import Gear from './svg/Gear.svelte';

    let copyright;
    let sidepanel = '';

    page_state.set(get_page_state());
    basemap_id.set(get_basemap());
    map_opacity_base.set(get_opacity('opacity-base-layer', 'basemap-opacity', 1.0));
    map_opacity_route.set(get_opacity('opacity-route-layer', 'routemap-opacity', 0.8));
    map_opacity_shade.set(get_opacity('opacity-shade-layer', 'hill', 0.0));

    onDestroy(page_state.subscribe(value => sidepanel = value.page));

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
  <span slot="subleft"><UpdateInfo /></span>
  <span slot="subright"><span id="map-attribution"></span></span>
</Headline>

<PageFooter>
    <SearchForm />
    <div class="btn-group" role="group">
        <ButtonFooter on:click={() => show_page('settings')}><Gear /></ButtonFooter>
        <ButtonFooter on:click={enable_geolocation}><GeoPin /></ButtonFooter>
        <ButtonFooter>Right</ButtonFooter>
    </div>
    <div class="btn-group" role="group">
        <ButtonFooter on:click={() => show_page('routelist')}>Routes</ButtonFooter>
    </div>
</PageFooter>

{#if sidepanel === 'settings'}<PanelSettings/>{/if}
{#if sidepanel === 'routelist'}<PanelRouteList/>{/if}
{#if sidepanel === 'route'}<PanelRouteDetails />{/if}
{#if sidepanel === 'search'}<PanelSearch />{/if}
