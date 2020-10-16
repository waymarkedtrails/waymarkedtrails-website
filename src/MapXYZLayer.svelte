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

    let make_attribs = function() {
        return ['Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> under <a href= "https://www.openstreetmap.org/copyright">ODbL</a>', attribution];
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
