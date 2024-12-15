<script>
    import { _ } from 'svelte-i18n';
    import { onDestroy } from 'svelte';
    import { API_URL } from './config.js';
    import { page_state } from './page_state.svelte.js';
    import { map_state } from './map_state.svelte.js';
    import SidePanel from './ui/SidePanel.svelte';
    import OsmObjectLink from './ui/OsmObjectLink.svelte';
    import { json_load } from './util/load_json.js';
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

    let osm_type = $state();
    let osm_id = $state();
    let bbox = $state();

    let loader = $state();
    let extra_routes_in_view = $state([]);

    function process_route(route) {
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

        const extent = map_state.extent;
        if (!extent && route.bbox) {
            map_state.set_map_view(route.bbox);
        }
        bbox = route.bbox;
        map_state.vector_routes = [{type: route.type, id: route.id}]
                                   .concat(route.subroutes || [], route.superroutes || []);
        map_state.highlighted_route = {type: route.type, id: route.id};

        return route;
    }

    $effect(() => {
        const extent = map_state.extent;

        if (extent && extra_routes_in_view.length > 0) {
            load_routes(extra_routes_in_view, extent);
        }
    });

    $effect(() => {
        if (page_state.page !== 'route') {
            return;
        }

        let new_osm_id = page_state.params.get('id');
        let new_osm_type = page_state.params.get('type') || 'relation';

        if (osm_id === new_osm_id && osm_type === new_osm_type) {
            return;
        }

        osm_id = new_osm_id;
        osm_type = new_osm_type;

        if (typeof osm_id === 'undefined') {
            loader = Promise.reject('error.missing_id');
            return;
        }

        let controller = new AbortController();
        const signal = controller.signal;

        loader = json_load('/details/' + osm_type + '/' + osm_id, {}, signal)
            .then((json) => process_route(json));
    });

    onDestroy(() => {
        map_state.vector_routes = [];
    });
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

<SidePanel>
{#snippet title()}
    <OsmObjectLink osm_type={osm_type} osm_id={osm_id}/>
{/snippet}
{#snippet content()}
    {#if loader}{#await loader}
        {$_('routelist.loading')}
    {:then route}
    <ItineraryLine itinerary={route.itinerary} />

    <DetailsHeader img_alt={$_('details.route_symbol')} img_src="{API_URL}/symbols/id/{route.symbol_id}" ref={route.ref}>
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
        <ul><SimpleRouteList route_data={route.subroutes} parent_route={route} /></ul>
    </Collapsible>
    {/if}

    {#if route.superroutes}
    <Collapsible title={$_('details.superroutes_title')} init_collapsed={true}>
        <ul><SimpleRouteList route_data={route.superroutes} parent_route={route} /></ul>
    </Collapsible>
    {/if}

    <CollapsibleTagList tags={route.tags} />

    <Collapsible title={$_('details.analyze.title')} init_collapsed={true}>
        <RouteAnalyzeView {route} />
    </Collapsible>
    {:catch error}
        {$_(error.message)}
    {/await}{/if}
{/snippet}

{#snippet footer()}
    <DetailsFooter {osm_type} {osm_id} {bbox} />
{/snippet}

</SidePanel>
