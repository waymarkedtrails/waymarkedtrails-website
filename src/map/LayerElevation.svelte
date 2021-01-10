<script context="module">
    import Feature from 'ol/Feature';
    import {Circle, Style, Fill, Stroke} from 'ol/style';
    import {Point} from 'ol/geom';

    const marker = new Feature();

    marker.setStyle(new Style({
            image: new Circle({
                radius: 5,
                fill: new Fill({color: '#0000ff'}),
                stroke: new Stroke({color: '#000', width: 1})
            })
       }));

    export function set_elevation_point(x, y) {
        marker.setGeometry(new Point([x, y]));
    }

    export function unset_elevation_point() {
        marker.setGeometry(null);
    }
</script>

<script>
    import { getContext } from 'svelte';
    import {Vector as VectorLayer} from 'ol/layer';
    import {Vector as VectorSource} from 'ol/source';

    const getMap = getContext('olContext');

    getMap().addLayer(new VectorLayer({
        source: new VectorSource({
            features: [marker]
        })
    }));
</script>
