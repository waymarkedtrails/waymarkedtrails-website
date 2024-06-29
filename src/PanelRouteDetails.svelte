<script>
    import { _ } from 'svelte-i18n';
    import { onDestroy } from 'svelte';
    import { API_URL } from './config.js';
    import { map_view, page_state } from './app_state.js';
    import { set_map_view } from './Map.svelte';
    import SidePanel from './ui/SidePanel.svelte';
    import { json_loader } from './util/load_json.js';
    import { load_routes } from './map/LayerVectorData.svelte';
    import { make_route_title, make_route_subtitle } from './util/route_transforms.js';
    import Collapsible from './ui/Collapsible.svelte';
    import CollapsibleTagList from './ui/CollapsibleTagList.svelte';
    import SimpleRouteList from './ui/SimpleRouteList.svelte';
    import DetailsPropertyList from './ui/DetailsPropertyList.svelte';
    import DetailsPropertyItem from './ui/DetailsPropertyItem.svelte';
    import DetailsHeader from './ui/DetailsHeader.svelte';
    import DetailsWeblink from './ui/DetailsWeblink.svelte';
    import ElevationView from './ElevationView.svelte';
    import RouteAnalyzeView from './RouteAnalyzeView.svelte';
    import ItineraryLine from './ui/ItineraryLine.svelte';
    import DetailsFooter from './ui/DetailsFooter.svelte';

    let osm_type = '';
    let osm_id = '';
    let fail_message = '';
    let route;
    let extent = $map_view.extent;

    const loader = json_loader(function(json) {
        route = json;

        if (route.wikipedia) {
            route.wiki_url = API_URL + '/details/' + osm_type + '/' + osm_id + '/wikilink';
        }

        if (route.subroutes) {
            route.subroutes.forEach(function(route) {
                route.title = make_route_title(route);
                route.subtitle = make_route_subtitle(route);
            });
        }

        if (route.superroutes) {
            route.superroutes.forEach(function(route) {
                route.title = make_route_title(route);
                route.subtitle = make_route_subtitle(route);
            });
        }

        if (!extent && route.bbox) {
            set_map_view(route.bbox);
        }

        load_routes([].concat(route.subroutes || [], route.superroutes || []), extent);

        fail_message = '';
    },
    function(error) { fail_message = $_(error); });

    onDestroy(page_state.subscribe((value) => {
        if (value.page !== 'route') {
            return;
        }

        osm_id = value.params.get('id');
        if (typeof osm_id === 'undefined') {
            fail_message = $_('error.missing_id');
            return;
        }
        osm_type = value.params.get('type') || 'relation';

        loader.load('/details/' + osm_type + '/' + osm_id);
    }));

</script>

<style>
    .subtitle {
        font-size: smaller;
        color: #777;
    }

    .description, .note {
        margin: 3px
    }

    .properties {
        margin: 10px;
    }

    ul {
        list-style: none;
        margin: 2px;
        padding: 0;
    }

    .weblinks {
        padding: 10px;
        display: flex;
    }
</style>

<SidePanel osm_type={osm_type} osm_id={osm_id} title="{$_('details.type.' + osm_type)} {osm_id}" fail_message={fail_message}>
{#key route}{#if route}
<ItineraryLine itinerary={route.itinerary} />

<DetailsHeader img_alt="{$_('details.route_symbol')}" img_src="{API_URL}/symbols/id/{route.symbol_id}" ref={route.ref}>
    {make_route_title(route)}
    {#if route.local_name}<div class="subtitle">{route.local_name}</div>{/if}
</DetailsHeader>


{#if route.description}<div class="description">{route.description}</div>{/if}

<dl class="properties">
    <DetailsPropertyItem title={$_('details.mapped_len')} value={route.mapped_length} type="km" />
    <DetailsPropertyItem title={$_('details.official_len')} value={route.official_length} type="km" />
    <DetailsPropertyItem title={$_('details.operator')} value={route.operator} />
    <DetailsPropertyItem title={$_('details.symbol')} value={route.symbol} />
</dl>


<div class="weblinks">
    <DetailsWeblink title={$_('details.website')} url={route.url} />
    <DetailsWeblink title={$_('details.wikipedia')} url={route.wiki_url} />
</div>

{#if route.note}<div class="note"><i>{$_('details.note')}:</i> {route.note}</div>{/if}

<Collapsible title={$_('elevation.title')} init_collapsed={true}>
    <ElevationView osm_type={osm_type} osm_id={osm_id} length={route.mapped_length} />
</Collapsible>

{#if route.subroutes}
<Collapsible title={$_('details.subroutes_title')} init_collapsed={true}>
    <ul><SimpleRouteList route_data={route.subroutes} /></ul>
</Collapsible>
{/if}

{#if route.superroutes}
<Collapsible title={$_('details.superroutes_title')} init_collapsed={true}>
    <ul><SimpleRouteList route_data={route.superroutes} /></ul>
</Collapsible>
{/if}

<CollapsibleTagList tags={route.tags} />
{:else}
{$_('routelist.loading')}
{/if}{/key}

<Collapsible title={$_('details.analyze.title')} init_collapsed={true}>
    <RouteAnalyzeView />
</Collapsible>

<div slot="footer">
    <DetailsFooter {route} />
<div>

</SidePanel>
