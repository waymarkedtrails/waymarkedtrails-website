<script>
    import { _ } from 'svelte-i18n';

    let { osm_type, osm_id} = $props();
    let link_type = $derived(osm_type === 'wayset' ? 'way' :
                              (osm_type === 'guidepost' ? 'node' : osm_type));
</script>

<a target="_new" href="https://openstreetmap.org/{link_type}/{osm_id}">{$_('details.type.' + osm_type)} {osm_id}</a>
