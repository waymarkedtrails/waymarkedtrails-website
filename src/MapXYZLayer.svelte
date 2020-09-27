<script>
    import { getContext } from 'svelte';
    import TileLayer from 'ol/layer/Tile';
    import XYZ from 'ol/source/XYZ';

    const getMap = getContext('olContext');
    const map = getMap();

    export let name;
    export let url;
    export let attribution = '';
    export let opacity;
    let visible;
    $: visible = opacity > 0.0;


    const layer = new TileLayer({
                      source: new XYZ({url: url}),
                      opacity: opacity,
                      visible: visible
                  });
    map.addLayer(layer);

    $: layer.setSource(new XYZ({url: url}));
    $: layer.setOpacity(opacity);
    $: layer.setVisible(visible);
</script>
