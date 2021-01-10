<script context="module">
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
</script>

<script>
    import { getContext, onDestroy } from 'svelte';
    import WMTConfig from '../../theme.js';
    import { page_state } from '../app_state.js';
    import VectorLayer from 'ol/layer/Vector';
    import GeoJSON from 'ol/format/GeoJSON';
    import { highlight_stroke, highlight_circle } from './styles.js';

    const getMap = getContext('olContext');
    layer = new VectorLayer({source: null, style: null});
    getMap().addLayer(layer);

    onDestroy(page_state.subscribe((value) => {
        if (value.page === 'route') {
            let osm_id = value.params.get('id');
            if (typeof osm_id !== 'undefined') {
                let osm_type = value.params.get('type') || 'relation';

                layer.setStyle(highlight_stroke);
                layer.setSource(new VectorSource({
                                    url: WMTConfig.API_URL + "/details/" + osm_type + "/" + osm_id + '/geometry/geojson',
                                    format: new GeoJSON()
                }));
                layer.setVisible(true);

                return;
            }
        }
        if (value.page === 'guidepost') {
            layer.setStyle(highlight_circle);
            return;
        }

        layer.setStyle(null);
        layer.setSource(null);
    }));
</script>
