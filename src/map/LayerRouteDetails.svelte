<script>
    import { getContext, onDestroy } from 'svelte';
    import WMTConfig from 'theme';
    import { page_state } from '../app_state.js';
    import VectorLayer from 'ol/layer/Vector';
    import {Vector as VectorSource} from 'ol/source';
    import GeoJSON from 'ol/format/GeoJSON';
    import { highlight_stroke } from './styles.js';

    const getMap = getContext('olContext');
    const map = getMap();

    let layer = new VectorLayer({source: null, style: null});
    map.addLayer(layer);

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

                return;
            }
        }

        layer.setStyle(null);
        layer.setSource(null);
    }));
</script>
