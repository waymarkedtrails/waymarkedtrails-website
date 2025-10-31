<script>
    import { untrack } from 'svelte';
    import VectorSource from 'ol/source/Vector';
    import GeoJSON from 'ol/format/GeoJSON';
    import { API_URL } from '../config.js';
    import { highlight_stroke } from './styles.js';
    import { map_state } from '../map_state.svelte.js';
    import VectorLayer from 'ol/layer/Vector';
    import VectorTileLayer from 'ol/layer/VectorTile';
    import VectorTileSource from 'ol/source/VectorTile';
    import { boundingExtent } from 'ol/extent'
    import { page_state } from '../page_state.svelte.js';

    let segment_fragment = $derived.by(() => {
        const routes = map_state.vector_routes;
        if (routes.length == 0) {
            return;
        }

        let ids = {};
        for (const r of routes) {
            if (r.type in ids)
                ids[r.type] += ',' + r.id;
            else
                ids[r.type] = '' + r.id;
        }
        const extent = untrack(() => map_state.extent);
        let segment_url = `bbox=${extent}`;
        for (let [key, vals] of Object.entries(ids)) {
                segment_url += `&${key}s=${vals}`;
        }

        return segment_url;
    });

    const map = map_state.map;

    let vtile_layer, vector_layer;

    $effect(() => {
        if (segment_fragment) {
            const extent = untrack(() => map_state.extent);
            vector_layer.setSource(new VectorSource({
                format: new GeoJSON(),
                url: `${API_URL}/list/segments?${segment_fragment}`,
            }));
        } else {
            vector_layer.setSource(null);
        }
    });

    // Simple vector layer to use when vtiles are inactive.
    vector_layer = new VectorLayer({
        maxZoom: 12,
        style: null
    });
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

    $effect(() => {
        const route = map_state.highlighted_route;
        if (!route) {
            vtile_layer.setStyle(null);
            vector_layer.setStyle(null);
        } else {
            vtile_layer.setStyle(function(feature, resolution) {
                let prop = feature.getProperties();
                if (route.type === 'relation') {
                    if (prop.type === 'way' &&
                        (((prop.top_relations && prop.top_relations.indexOf(route.id) >= 0)
                        || (prop.child_relations && prop.child_relations.indexOf(route.id) >= 0)))) {
                        return highlight_stroke;
                    }
                } else {
                    if (prop.type =='wayset' &&
                        ((route.type === 'way' && prop.way_id == route.id)
                         || (route.type === 'wayset' && prop.wayset_ids && prop.wayset_ids.indexOf(route.id) >= 0))) {
                        return highlight_stroke;
                    }
                }

                return null;
            });
            vector_layer.setStyle(function(feature, resolution) {
                if (feature.getId() == route.id && feature.getProperties().type == route.type) {
                    return highlight_stroke;
                }

                return null;
            });
        }
    });

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
                page_state.show_page();
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
            page_state.show_page();
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
