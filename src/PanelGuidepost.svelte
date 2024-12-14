<script>
    import { _ } from 'svelte-i18n';
    import Point from 'ol/geom/Point';

    import { page_state } from './page_state.svelte.js';
    import { json_load } from './util/load_json.js';
    import { map_state } from './map_state.svelte.js';

    import SidePanel from './ui/SidePanel.svelte';
    import OsmObjectLink from './ui/OsmObjectLink.svelte';
    import DetailsHeader from './ui/DetailsHeader.svelte';
    import DetailsPropertyList from './ui/DetailsPropertyList.svelte';
    import DetailsPropertyItem from './ui/DetailsPropertyItem.svelte';
    import DetailsWeblink from './ui/DetailsWeblink.svelte';
    import Collapsible from './ui/Collapsible.svelte';
    import CollapsibleTagList from './ui/CollapsibleTagList.svelte';
    import GuidepostDestination from './GuidepostDestination.svelte';
    import SVGZoom from './svg/Zoom.svelte';
    import HourGlass from './svg/HourGlass.svelte';
    import { set_highlight_point } from './map/LayerRouteDetails.svelte';

    let osm_id = $state();
    let loader = $state();
    let guidepost_location;

    function onMapFocus(ev) {
        ev.preventDefault();
        if (guidepost_location) {
            map_state.set_map_view(guidepost_location);
        }
    }

    $effect(() => {
        if (page_state.page !== 'guidepost') {
            return;
        };

        osm_id = page_state.params.get('id');
        if (typeof osm_id === 'undefined') {
            loader = Promise.reject(new Error('error.missing_id'));
            return;
        }

        let controller = new AbortController();
        const signal = controller.signal;

        loader = json_load('/details/guidepost/' + osm_id, {}, signal)
                     .then((json) => {
                        json.location = new Point([json.x, json.y]);
                        set_highlight_point(json.location);
                        guidepost_location = json.location;
                        return json;
                        });
    });
</script>

<style>
    .description, .note {
        margin: 3px
    }

    .properties {
        margin: 10px;
    }

    .weblinks {
        padding: 10px;
        display: flex;
    }

    button {
        width: 100%;
        flex-grow: 1;
        background-color: #cecece;
        color: black;
        font-size: 16px;
        padding: 6px 0px;
        border-color: #bbb;
        text-align: center;
        border-top: 1px solid #eee;
        border-left: 1px solid #eee;
        border-bottom: 1px solid #bbb;
        border-right: 1px solid #bbb;
    }
</style>

<SidePanel>
{#snippet title()}
    <OsmObjectLink osm_type="guidepost" osm_id={osm_id} />
{/snippet}

{#snippet content()}
{#if loader}
{#await loader}
    <HourGlass />
{:then guidepost}
<DetailsHeader img_alt={$_('details.type.guidepost')} img_src="/img/guidepost.svg" ref={guidepost.ref}>
    {#if guidepost.name}
        {guidepost.name}
    {:else if guidepost.ref}
        {guidepost.ref}
    {:else}
        <i>{$_('details.type.guidepost')} {osm_id}</i>
    {/if}
</DetailsHeader>

{#if guidepost.description}<div class="description">{guidepost.description}</div>{/if}

<dl class="properties">
    <DetailsPropertyItem title={$_('details.altitude')} value={guidepost.ele} />
    <DetailsPropertyItem title={$_('details.operator')} value={guidepost.tags.operator} />
</dl>

<div class="weblinks">
    <DetailsWeblink title={$_('details.image')} url={guidepost.image} />
    <DetailsWeblink title={$_('details.website')} url={guidepost.url} />
    <DetailsWeblink title={$_('details.wikipedia')} url={guidepost.wiki_url} />
</div>

{#if guidepost.note}<div class="note"><i>{$_('details.note')}:</i> {guidepost.note}</div>{/if}

<Collapsible title={$_('destination_sign.title')} init_collapsed={true}>
    <GuidepostDestination osm_id={osm_id} />
</Collapsible>

<CollapsibleTagList tags={guidepost.tags} />
{:catch error}
    {$_(error.message)}
{/await}
{/if}
{/snippet}

{#snippet footer()}
    <button type="button" onclick={onMapFocus}>
        <span class="btn-img"><SVGZoom /></span>
       {$_('details.zoom_to')}
    </button>
{/snippet}
</SidePanel>
