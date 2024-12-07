<script>
    import { _, locale } from 'svelte-i18n';
    import { getContext } from 'svelte';
    import TileLayer from 'ol/layer/Tile';
    import XYZ from 'ol/source/XYZ';

    let { url, attribution = '', opacity } = $props();

    const getMap = getContext('olContext');
    const map = getMap();

    let all_attribution = $derived.by(() => {
        let secondary = '';
        if (attribution === 'elevation') {
            secondary = $_('attribution.elevation_title');
        } else if (attribution) {
            secondary = $_('settings.base_map') + ': ' + attribution;
        }
        return [$_('attribution.data'), secondary];
    });

    const layer = new TileLayer({
                      maxZoom: 18
                  });
    map.addLayer(layer);

    locale.subscribe(() => {
       layer.setSource(new XYZ({url: url, attributions: all_attribution})); 
    });

    $effect(() => {
        layer.setSource(new XYZ({url: url, attributions: all_attribution}));
    });

    $effect(() => {
        layer.setOpacity(opacity);
        layer.setVisible(opacity > 0.0);
    });
</script>
