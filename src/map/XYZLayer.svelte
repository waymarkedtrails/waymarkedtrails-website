<script>
    import { _, locale } from 'svelte-i18n';
    import { getContext } from 'svelte';
    import TileLayer from 'ol/layer/Tile';
    import XYZ from 'ol/source/XYZ';

    const getMap = getContext('olContext');
    const map = getMap();

    export let url;
    export let attribution = '';
    export let opacity;
    let visible;
    $: visible = opacity > 0.0;

    let make_attribs = function() {
        let secondary = '';
        if (attribution === 'elevation') {
            secondary = $_('attribution.elevation_title');
        } else if (attribution) {
            secondary = $_('settings.base_map') + ': ' + attribution;
        }
        return [$_('attribution.data'), secondary];
    };

    const layer = new TileLayer({
                      source: new XYZ({url: url, attributions: make_attribs()}),
                      opacity: opacity,
                      visible: visible,
                      maxZoom: 18
                  });
    map.addLayer(layer);

    locale.subscribe(() => {
       layer.setSource(new XYZ({url: url, attributions: make_attribs()})); 
    });

    $: layer.setSource(new XYZ({url: url, attributions: make_attribs()}));
    $: layer.setOpacity(opacity);
    $: layer.setVisible(visible);
</script>
