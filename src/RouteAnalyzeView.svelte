<script>
    import { _ } from 'svelte-i18n';
    import { onMount, onDestroy, getContext } from 'svelte';
    import { get_geometry } from './map/LayerRouteDetails.svelte';
    import { analyze_line, highlight_circle } from './map/styles.js';
    import VectorLayer from 'ol/layer/Vector';
    import VectorSource from 'ol/source/Vector';
    import Feature from 'ol/Feature.js';
    import Point from 'ol/geom/Point.js';
    import LineString from 'ol/geom/LineString.js';

    let num_segments = 0;
    let segments = [];
    let layer = null;
    const getMap = getContext('olContext');

    onMount(() => {
        let geom = get_geometry();

        if (geom ==- null) {
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
        let features = [];

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
            features.push(feat);

            if (prev_point !== null) {
                feat = new Feature({geometry: new LineString(
                                                   [prev_point, line.getFirstCoordinate()]),
                                    virtual: 1});
                feat.setId(line_id++);
                features.push(feat);
            }

            prev_point = line.getLastCoordinate();
        }

        let coord_id = 10000;
        for (const c of Object.values(intersections)) {
            if (c.num > 0.6) {
                let feat = new Feature({geometry: new Point(c.obj),
                                        numlines: c.num});
                feat.setId(coord_id++);
                features.push(feat);
            }
        }

        layer = new VectorLayer({source: new VectorSource({features: features}),
                                 style: analyze_line});
        getMap().addLayer(layer);

        segments = new_segments;
    });

    onDestroy(() => {
        if (layer !== null) {
            getMap().removeLayer(layer);
            layer = null;
        }
    });
</script>


<p>{$_('details.analyze.summary', {values: {num: num_segments}})}</p>
<p>{$_('details.analyze.legend')}</p>
<p><i>{$_('details.analyze.disclaimer')}</i></p>
