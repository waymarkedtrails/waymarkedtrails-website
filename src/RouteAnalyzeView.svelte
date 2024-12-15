<script>
    import { _ } from 'svelte-i18n';
    import { onMount, onDestroy } from 'svelte';
    import { analyze_line, highlight_circle } from './map/styles.js';
    import { map_state } from './map_state.svelte.js';
    import { json_load } from './util/load_json.js';
    import VectorLayer from 'ol/layer/Vector';
    import VectorSource from 'ol/source/Vector';
    import Feature from 'ol/Feature.js';
    import Point from 'ol/geom/Point.js';
    import LineString from 'ol/geom/LineString.js';
    import GeoJSON from 'ol/format/GeoJSON';

    let { route } = $props();

    let num_segments = $state(0);
    let layer = new VectorLayer({source: null, style: analyze_line});

    map_state.map.addLayer(layer);

    function loadFromSource(extent, resolution, projection, success, failure) {
        let controller = new AbortController();
        const signal = controller.signal;

        json_load(`/details/${route.type}/${route.id}/geometry/geojson`, {}, signal)
            .then((json) => {
                const source = layer.getSource();
                let geom = source.getFormat().readFeatures(json);

                if (geom.length < 1) {
                    return;
                }

                geom = geom[0].getGeometry();

                if (!geom) {
                    return;
                }

                let lines = [];

                if (geom.getType() == 'LineString') {
                    lines = [geom];
                } else if (geom.getType() == 'MultiLineString') {
                    lines = geom.getLineStrings();
                }

                num_segments = lines.length;
                let new_segments = [];

                let intersections = {};
                let line_id = 0;
                let prev_point = null;
                for (const line of lines) {
                    let coords = line.getCoordinates();

                    for (let i = 0; i < coords.length; i++) {
                        let weight = (i == 0 || i == coords.length - 1) ? 1.0 : 0.6;
                        let c = coords[i];
                        let old_weight = intersections[c] ? intersections[c].num : 0.0;
                        intersections[c] = {obj: c,
                                            num: old_weight + weight}
                    }

                    let feat = new Feature({geometry: line, virtual: 0});
                    feat.setId(line_id++);
                    source.addFeature(feat);

                    if (prev_point !== null) {
                        feat = new Feature({geometry: new LineString(
                                                           [prev_point, line.getFirstCoordinate()]),
                                            virtual: 1});
                        feat.setId(line_id++);
                        source.addFeature(feat);
                    }

                    prev_point = line.getLastCoordinate();
                }

                let coord_id = 10000;
                for (const c of Object.values(intersections)) {
                    if (c.num > 0.6) {
                        let feat = new Feature({geometry: new Point(c.obj),
                                                numlines: c.num});
                        feat.setId(coord_id++);
                        source.addFeature(feat);
                    }
                }
            });
    }

    onMount(() => {
        layer.setSource(new VectorSource({loader: loadFromSource, format: new GeoJSON()}));
        layer.setVisible(true);

        return () => { layer.setVisible(false); };
    });
</script>


<p>{$_('details.analyze.summary', {values: {num: num_segments}})}</p>
<p>{$_('details.analyze.legend')}</p>
<p><i>{$_('details.analyze.disclaimer')}</i></p>
