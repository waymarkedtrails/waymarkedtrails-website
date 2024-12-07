<script>
    import { _ } from 'svelte-i18n';
    import { set_map_view } from '../Map.svelte';
    import { API_URL } from '../config.js';

    import SVGZoom from '../svg/Zoom.svelte';
    import SVGDownload from '../svg/Download.svelte';

    let { osm_type, osm_id, bbox } = $props();
</script>

<style>
    div {
        display: flex;
        width: 100%;
    }

    button, a {
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

    .btn-img {
        padding-right: 3px;
    }
</style>

{#if osm_type}
<div>
    <button type="button" onclick={(ev) => {ev.preventDefault(); set_map_view(bbox)}}>
        <span class="btn-img"><SVGZoom /></span>
        {$_('details.zoom_to')}
    </button>

    <a href="{API_URL}/details/{osm_type}/{osm_id}/geometry/gpx">
        <span class="btn-img"><SVGDownload /></span>
        {$_('details.GPX')}
    </a>

    <a href="{API_URL}/details/{osm_type}/{osm_id}/geometry/kml">
        <span class="btn-img"><SVGDownload /></span>
        {$_('details.KML')}
    </a>

</div>
{/if}
