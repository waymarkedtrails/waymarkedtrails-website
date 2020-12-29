<script context="module">
    import WMTConfig from '../../theme.js';
    import VectorSource from 'ol/source/Vector';
    import GeoJSON from 'ol/format/GeoJSON';
    import { highlight_stroke } from './styles.js';

    let getMap;
    let vtile_layer, vector_layer;

    let h

    export function load_routes(routes) {
        if (!is_vtiles_active()) {
            let ids = {};
            routes.forEach(function(r, i) {
                if (r.type in ids)
                    ids[r.type] += ',' + r.id;
                else
                    ids[r.type] = '' + r.id;
            });
            let map = getMap();
            let extent = map.getView().calculateExtent(map.getSize());
            let segment_url = WMTConfig.API_URL + "/list/segments?bbox=" + extent;
            for (let k in ids) {
                segment_url += '&' + k + 's=' + ids[k];
            }

            vector_layer.setSource(new VectorSource({
                url : segment_url,
                format: new GeoJSON()
            }));
        }
    }

    export function highlight_route(rid) {
        if (is_vtiles_active()) {
            vtile_layer.setStyle(function(feature, resolution) {
                let prop = feature.getProperties();
                if ((prop.top_relations && prop.top_relations.indexOf(rid) >= 0)
                    || (prop.child_relations && prop.child_relations.indexOf(rid) >= 0)) {
                    return highlight_stroke;
                }

                return null;
            });
        } else {
            vector_layer.setStyle(function(feature, resolution) {
                if (feature.getId() === 'r' + rid) {
                    return highlight_stroke;
                }

                return null;
            });
        }
    }

    export function unhighlight_route() {
        vtile_layer.setStyle(null);
        vector_layer.setStyle(null);
    }

    const is_vtiles_active = function() {
        return getMap().getView().getZoom() >= 12;
    }

</script>

<script>
    import { getContext, onDestroy } from 'svelte';
    import VectorLayer from 'ol/layer/Vector';
    import VectorTileLayer from 'ol/layer/VectorTile';
    import VectorTileSource from 'ol/source/VectorTile';
    import { boundingExtent } from 'ol/extent'
    import { show_page } from '../app_state.js';

    getMap = getContext('olContext');

    // Simple vector layer to use when vtiles are inactive.
    vector_layer = new VectorLayer({source: null, style: null});
    getMap().addLayer(vector_layer);

    // Vtile layer.
    vtile_layer = new VectorTileLayer({
        source: new VectorTileSource({
            format: new GeoJSON(),
            url: WMTConfig.API_URL + "/tiles/{z}/{x}/{y}.json",
            maxZoom: 12,
            minZoom: 12
        }),
        minZoom: 12,
        style: null
    });
    getMap().addLayer(vtile_layer);

    getMap().on('singleclick', showFeatureInfo);

    function showFeatureInfo(evt) {
        let map = getMap();
        let current_zoom = map.getView().getZoom();
        if (current_zoom < 12) {
            return;
        }

        let p1 = map.getCoordinateFromPixel([evt.pixel[0] - 5, evt.pixel[1] - 5]);
        let p2 = map.getCoordinateFromPixel([evt.pixel[0] + 5, evt.pixel[1] + 5]);

        var feats = vtile_layer.getSource().getFeaturesInExtent(boundingExtent([p1, p2]));

        let relations = [];
        for (const feature of feats) {
            let props = feature.getProperties();
            if (props.type === 'way') {
                relations = relations.concat(props.top_relations);
            }
            if (current_zoom > 13 && props.type === 'guidepost') {
                show_page('guidepost', [['id', props.osm_id]]);
                return;
            }
        }

        relations = relations.filter(function(elem, index, self) {
            return index === self.indexOf(elem);
        });
        if (relations.length === 1) {
            show_page('route', [['id', relations[0]]]);
        } else {
            console.log(relations.join());
            show_page('routelist', [['relations', relations.join()]]);
        }
    }
</script>
