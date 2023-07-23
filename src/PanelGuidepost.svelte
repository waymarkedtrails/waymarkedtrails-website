<script>
    import { _ } from 'svelte-i18n';
    import { onDestroy } from 'svelte';
    import Point from 'ol/geom/Point';

    import { page_state } from './app_state.js';
    import { json_loader } from './util/load_json.js';

    import SidePanel from './ui/SidePanel.svelte';
    import ButtonRouteZoom from './ui/ButtonRouteZoom.svelte';
    import DetailsHeader from './ui/DetailsHeader.svelte';
    import DetailsPropertyList from './ui/DetailsPropertyList.svelte';
    import DetailsPropertyItem from './ui/DetailsPropertyItem.svelte';
    import DetailsWeblink from './ui/DetailsWeblink.svelte';
    import Collapsible from './ui/Collapsible.svelte';
    import CollapsibleTagList from './ui/CollapsibleTagList.svelte';
    import GuidepostDestination from './GuidepostDestination.svelte';
    import { set_highlight_point } from './map/LayerRouteDetails.svelte';

    let osm_id = '';
    let fail_message = '';
    let guidepost;

    const loader = json_loader(function(json) {
        guidepost = json;

        guidepost.location = new Point([guidepost.x, guidepost.y]);
        set_highlight_point(guidepost.location);
    },
    function(error) { fail_message = $_(error); });

    onDestroy(page_state.subscribe((value) => {
        if (value.page !== 'guidepost') {
            return;
        };

        osm_id = value.params.get('id');
        if (typeof osm_id === 'undefined') {
            fail_message = $_('error.missing_id');
            return;
        }

        loader.load('/details/guidepost/' + osm_id);
    }));
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
</style>

<SidePanel osm_type="node" osm_id={osm_id} title="{$_('details.type.guidepost')} {osm_id}" fail_message={fail_message}>
{#key guidepost}{#if guidepost}

<DetailsHeader img_alt={$_('details.type.guidepost')} img_src="/img/guidepost.svg" ref={guidepost.ref}>
    {#if guidepost.name}
        {guidepost.name}
    {:else if guidepost.ref}
        {guidepost.ref}
    {:else}
        <i>{$_('details.type.guidepost')} {osm_id}</i>
    {/if}
</DetailsHeader>

<div class="btn-group" role="group">
  <ButtonRouteZoom bbox={guidepost.location} />
</div>

{#if guidepost.description}<div class="description">{guidepost.description}</div>{/if}

<dl class="properties">
    <DetailsPropertyItem title={$_('details.altitude')} value="{guidepost.ele}" />
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
{/if}{/key}
</SidePanel>
