<script>
    import { _ } from 'svelte-i18n';
    import { onDestroy } from 'svelte';
    import { API_URL } from './config.js';
    import { page_state } from './page_state.svelte.js';
    import { map_state } from './map_state.svelte.js';
    import SidePanel from './ui/SidePanel.svelte';
    import OsmObjectLink from './ui/OsmObjectLink.svelte';
    import { json_load } from './util/load_json.js';
    import { make_route_details } from './util/route_details.js';
    import { WindowHash } from './util/window_hash.js';
    import Collapsible from './ui/Collapsible.svelte';
    import CollapsibleTagList from './ui/CollapsibleTagList.svelte';
    import SimpleRouteList from './ui/SimpleRouteList.svelte';
    import DetailsPropertyList from './ui/DetailsPropertyList.svelte';
    import DetailsPropertyItem from './ui/DetailsPropertyItem.svelte';
    import DetailsHeader from './ui/DetailsHeader.svelte';
    import DetailsWeblink from './ui/DetailsWeblink.svelte';
    import ElevationView from './ElevationView.svelte';
    import RouteAnalyzeView from './RouteAnalyzeView.svelte';
    import RouteDownloadView from './RouteDownloadView.svelte';
    import ItineraryLine from './ui/ItineraryLine.svelte';
    import DetailsFooter from './ui/DetailsFooter.svelte';
    import VectorLayer from 'ol/layer/Vector';
    import VectorSource from 'ol/source/Vector';
    import Collection from 'ol/Collection.js';
    import { make_style, make_shadow_style } from './map/style_details.js';

    let osm_type = $state();
    let osm_id = $state();
    let bbox = $state();

    let loader = $state();

    const vsrc = new VectorSource();
    const shadow_layer = new VectorLayer({
        source: vsrc,
        style: make_shadow_style(),
        zIndex: 10});
    map_state.map.addLayer(shadow_layer);
    const draw_layer = new VectorLayer({
        source: vsrc,
        style: make_style(),
        zIndex: 11});
    map_state.map.addLayer(draw_layer);

    function process_route(json) {
        const route = make_route_details(json);

        if (route.bbox && !map_state.extent) {
            map_state.set_map_view(route.bbox);
        }
        bbox = route.bbox;

        vsrc.addFeatures(route.get_features());

        return route;
    }

    $effect(() => {
        if (page_state.page !== 'route') {
            return;
        }

        let new_osm_id = page_state.params.get('id');
        let new_osm_type = page_state.params.get('type') || 'relation';

        if (osm_id === new_osm_id && osm_type === new_osm_type) {
            return;
        }

        vsrc.clear();

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
        vsrc.clear();
    });

    function begin_hover(route) {
        draw_layer.setStyle(make_style(route.id));
    }

    function end_hover() {
        draw_layer.setStyle(make_style());
    }
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

    .subproperties {
        margin-left: 2em;
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

    .route-properties {
        border-top: solid lightgray 0px;
        border-bottom: solid lightgray 0px;
        margin-top: 1ex;
        margin-right: 0.8em;
        cursor: default;
        line-height: 85%;
        background-image: linear-gradient(to right, #f9f9f9 60%, white)
    }

    .spacer {
        flex-grow: 1
    }

    .btn-roundtrip {
        color: var(--theme-sub-color);
    }

    .btn-oneway .btn-education {
        font-size: 0.65em;
        vertical-align: top
    }

    .btn-sngdir {
        font-size: 110%
    }

    .btn-pilgrim {
        filter: grayscale(100%);
        font-size: 80%
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
        {route.title}
        {#if route.local_name}<div class="subtitle">{route.local_name}</div>{/if}
        <div class="spacer" />
        <div class="route-properties">
          {#if route.tags.pilgrimage == 'yes'}
            {#if route.tags.religion == 'christian'}<span title={$_('details.pilgrimage.christian')} class="btn-pilgrim">✝</span>
            {:else}<span title={$_('details.pilgrimage.other')} class="btn-pilgrim">🛐</span>
            {/if}
          {/if}
          {#if route.tags.educational == 'yes'}<span title={$_('details.educational.other')} class="btn-education">🎓</span>{/if}
          {#if route.tags.roundtrip == 'yes'}<span title={$_('details.roundtrip')} class="btn-roundtrip">⟳</span>{/if}
          {#if route.tags.oneway == 'yes'}<span title={$_('details.oneway')} class="btn-oneway">⛔</span>{/if}
          {#if route.tags.signed_direction == 'yes'}<span title={$_('details.signed_direction')} class="btn-sngdir">☞</span>{/if}
        </div>
    </DetailsHeader>


    {#if route.description}<div class="description">{route.description}</div>{/if}

    <dl class="properties">
        <DetailsPropertyItem title={$_('details.mapped_len')} value={route.route.length} type="km" />
        {#if route.route.appendices}
        <dl class="subproperties">
          {#each Object.entries(route.appendix_lengths()) as app}
          <DetailsPropertyItem title='+ "{app[0]}"' value={app[1]} type="km" />
          {/each}
        </dl>
        {/if}
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
        <ElevationView {osm_type} {osm_id} {route} />
    </Collapsible>

    {#if route.subroutes}
    <Collapsible title={$_('details.subroutes_title')} init_collapsed={true}>
        <ul><SimpleRouteList route_data={route.section_list()} {begin_hover} {end_hover} /></ul>
    </Collapsible>
    {/if}

    {#if route.superroutes}
    <Collapsible title={$_('details.superroutes_title')} init_collapsed={true}>
        <ul><SimpleRouteList route_data={route.parent_list()} begin_hover={() => {}} end_hover={() => {}} /></ul>
    </Collapsible>
    {/if}

    <CollapsibleTagList tags={route.tags} />

    <Collapsible title={$_('details.download.title')} init_collapsed={true}>
        <RouteDownloadView {route} />
    </Collapsible>

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
