<script module>
    import {Vector as VectorSource} from 'ol/source';
    import Feature from 'ol/Feature';

    let layer;

    export function set_visible(state) {
        layer.setVisible(state);
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
    import { page_state } from '../page_state.svelte.js';
    import { map_state } from '../map_state.svelte.js';
    import VectorLayer from 'ol/layer/Vector';
    import GeoJSON from 'ol/format/GeoJSON';
    import { API_URL } from '../config.js';
    import { highlight_stroke } from './styles.js';

    layer = new VectorLayer({source: null, style: highlight_stroke});
    map_state.map.addLayer(layer);

    $effect(() => {
        let page_name = page_state.page;
        if (page_name === 'route') {
            let osm_id = page_state.params.get('id');
            if (typeof osm_id !== 'undefined') {
                let osm_type = page_state.params.get('type') || 'relation';

                layer.setSource(new VectorSource({
                                    url: API_URL + "/details/" + osm_type + "/" + osm_id + '/geometry/geojson',
                                    format: new GeoJSON()
                }));
                layer.setVisible(true);

                return;
            }
        }
        layer.setSource(null);
    });
</script>
