<script>
    import { _ } from 'svelte-i18n';
    import { map_state } from '../map_state.svelte.js';

    let { osm_type, osm_id} = $props();
    let link_type = $derived(osm_type === 'wayset' ? 'way' :
                              (osm_type === 'guidepost' ? 'node' : osm_type));

    let mapcoord = $derived(map_state.extent ? `#map=${map_state.zoom}/${map_state.center[1]}/${map_state.center[0]}` : '')
</script>

<a target="_new" href="https://openstreetmap.org/{link_type}/{osm_id}{mapcoord}">{$_('details.type.' + osm_type)} {osm_id}</a>
