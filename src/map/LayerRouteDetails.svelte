<script module>
    import {Vector as VectorSource} from 'ol/source';
    import Feature from 'ol/Feature';

    let layer;

    export function set_visible(state) {
        layer.setVisible(state);
    };

    export function set_highlight_point(pt) {
        let src = new VectorSource();
        src.addFeature(new Feature(pt));
        layer.setSource(src);
    };

    export function get_geometry() {
        let src = layer.getSource();
        if (src === null) {
            return null;
        }

        let features = src.getFeatures();

        if (features !== null && features.length > 0) {
            return features[0].getGeometry();
        }

        return null;
    }
</script>

<script>
    import { getContext } from 'svelte';
    import { page_state } from '../page_state.svelte.js';
    import VectorLayer from 'ol/layer/Vector';
    import GeoJSON from 'ol/format/GeoJSON';
    import { API_URL } from '../config.js';
    import { highlight_stroke, highlight_circle } from './styles.js';

    const getMap = getContext('olContext');
    layer = new VectorLayer({source: null, style: null});
    getMap().addLayer(layer);

    $effect(() => {
        let page_name = page_state.page;
        if (page_name === 'route') {
            let osm_id = page_state.params.get('id');
            if (typeof osm_id !== 'undefined') {
                let osm_type = page_state.params.get('type') || 'relation';

                layer.setStyle(highlight_stroke);
                layer.setSource(new VectorSource({
                                    url: API_URL + "/details/" + osm_type + "/" + osm_id + '/geometry/geojson',
                                    format: new GeoJSON()
                }));
                layer.setVisible(true);

                return;
            }
        } else if (page_name === 'guidepost') {
            layer.setStyle(highlight_circle);
            return;
        }

        layer.setStyle(null);
        layer.setSource(null);
    });
</script>
