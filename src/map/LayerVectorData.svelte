<script module>
    import VectorSource from 'ol/source/Vector';
    import GeoJSON from 'ol/format/GeoJSON';
    import { API_URL } from '../config.js';
    import { highlight_stroke } from './styles.js';
    import { map_state } from '../map_state.svelte.js';

    let vtile_layer, vector_layer;

    export function load_routes(routes, extent) {
        if (!is_vtiles_active() && routes && routes.length) {
            let ids = {};
            routes.forEach(function(r, i) {
                if (r.type in ids)
                    ids[r.type] += ',' + r.id;
                else
                    ids[r.type] = '' + r.id;
            });
            let segment_url = API_URL + "/list/segments?bbox=" + extent;
            for (let k in ids) {
                segment_url += '&' + k + 's=' + ids[k];
            }

            vector_layer.setSource(new VectorSource({
                url : segment_url,
                format: new GeoJSON()
            }));
        }
    }

    export function highlight_route(rid, rtype) {
        if (is_vtiles_active()) {
            vtile_layer.setStyle(function(feature, resolution) {
                let prop = feature.getProperties();
                if (rtype === 'relation') {
                    if (prop.type === 'way' &&
                        (((prop.top_relations && prop.top_relations.indexOf(rid) >= 0)
                        || (prop.child_relations && prop.child_relations.indexOf(rid) >= 0)))) {
                        return highlight_stroke;
                    }
                } else {
                    if (prop.type =='wayset' &&
                        ((rtype === 'way' && prop.way_id == rid)
                         || (rtype === 'wayset' && prop.wayset_ids && prop.wayset_ids.indexOf(rid) >= 0))) {
                        return highlight_stroke;
                    }
                }

                return null;
            });
        } else {
            if (rtype === 'wayset') {
                rtype = 'way';
            }
            vector_layer.setStyle(function(feature, resolution) {
                if (feature.getId() == rid && feature.getProperties().type == rtype) {
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
        return map_state.map.getView()?.getZoom() >= 12;
    }

</script>

<script>
    import VectorLayer from 'ol/layer/Vector';
    import VectorTileLayer from 'ol/layer/VectorTile';
    import VectorTileSource from 'ol/source/VectorTile';
    import { boundingExtent } from 'ol/extent'
    import { page_state } from '../page_state.svelte.js';

    const map = map_state.map;

    // Simple vector layer to use when vtiles are inactive.
    vector_layer = new VectorLayer({source: null, style: null});
    map.addLayer(vector_layer);

    // Vtile layer.
    vtile_layer = new VectorTileLayer({
        source: new VectorTileSource({
            format: new GeoJSON(),
            url: API_URL + "/tiles/{z}/{x}/{y}.json",
            maxZoom: 12,
            minZoom: 12
        }),
        minZoom: 12,
        style: null
    });
    map.addLayer(vtile_layer);

    map.on('singleclick', showFeatureInfo);

    function showFeatureInfo(evt) {
        let map = map_state.map;
        let current_zoom = map.getView().getZoom();
        if (current_zoom < 12) {
            return;
        }

        let p1 = map.getCoordinateFromPixel([evt.pixel[0] - 5, evt.pixel[1] - 5]);
        let p2 = map.getCoordinateFromPixel([evt.pixel[0] + 5, evt.pixel[1] + 5]);

        var feats = vtile_layer.getFeaturesInExtent(boundingExtent([p1, p2]));

        let relations = [];
        let ways = [];
        let waysets = [];
        for (const feature of feats) {
            let props = feature.getProperties();
            if (props.type === 'way') {
                relations = relations.concat(props.top_relations);
            }
            if (props.type === 'wayset') {
                if (props.wayset_ids) {
                    waysets = waysets.concat(props.wayset_ids);
                } else {
                    ways.push(props.way_id);
                }
            }
            if (current_zoom > 13 && props.type === 'guidepost') {
                page_state.show_page('guidepost', [['id', props.osm_id]]);
                return;
            }
        }

        // deduplicate the lists
        relations = relations.filter(function(elem, index, self) {
            return index === self.indexOf(elem);
        });
        waysets = waysets.filter(function(elem, index, self) {
            return index === self.indexOf(elem);
        });
        ways = ways.filter(function(elem, index, self) {
            return index === self.indexOf(elem);
        });

        let total = relations.length + waysets.length + ways.length;

        if (total == 1) {
            if (relations.length) {
                page_state.show_page('route', [['id', relations[0]]]);
            } else if (waysets.length) {
                page_state.show_page('route', [['id', waysets[0]], ['type', 'wayset']]);
            } else if (ways.length) {
                page_state.show_page('route', [['id', ways[0]], ['type', 'way']]);
            }
        } else if (total > 1) {
            let args = [];
            if (relations.length) {
                args.push(['relations', relations.join()]);
            }
            if (waysets.length) {
                args.push(['waysets', waysets.join()]);
            }
            if (ways.length) {
                args.push(['ways', ways.join()]);
            }
            page_state.show_page('routelist', args);
        }
    }
</script>
