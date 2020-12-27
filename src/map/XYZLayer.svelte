<script>
    import { _ } from 'svelte-i18n';
    import { getContext } from 'svelte';
    import TileLayer from 'ol/layer/Tile';
    import XYZ from 'ol/source/XYZ';

    const getMap = getContext('olContext');
    const map = getMap();

    export let url;
    export let attribution = '';
    export let opacity;
    export let title = '';
    let visible;
    $: visible = opacity > 0.0;

    let make_attribs = function() {
        return [$_('attribution.data'),
                (title && attribution) ? title + ': ' + attribution : ''];
    };


    const layer = new TileLayer({
                      source: new XYZ({url: url, attributions: make_attribs()}),
                      opacity: opacity,
                      visible: visible,
                      maxZoom: 18
                  });
    map.addLayer(layer);

    $: layer.setSource(new XYZ({url: url, attributions: make_attribs()}));
    $: layer.setOpacity(opacity);
    $: layer.setVisible(visible);
</script>
