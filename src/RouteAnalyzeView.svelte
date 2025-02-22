<script>
    import { _ } from 'svelte-i18n';
    import { onDestroy } from 'svelte';
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
    let layer = new VectorLayer({
        source: new VectorSource(),
        style: analyze_line,
        zIndex: 20});

    map_state.map.addLayer(layer);

    let featID;

    function add_virtual(pt1, pt2) {
        if (pt1) {
            const line = new LineString([pt1, pt2]);
            if (line.getLength() > 0.01) {
                const source = layer.getSource();
                source.addFeature(new Feature({geometry: line, virtual: 1, id: featID++}));
                source.addFeature(new Feature({
                         geometry: new Point(pt1),
                         pointpos: -1,
                         id: featID++}));
                source.addFeature(new Feature({
                         geometry: new Point(pt2),
                         pointpos: -1,
                         id: featID++}));

            }
        } else {
            const source = layer.getSource();
            source.addFeature(new Feature({
                     geometry: new Point(pt2),
                     pointpos: 0,
                     id: featID++}));
        }
    }

    function traverse_segments(intersections, start, segments) {
        let prev_point = start;
        for (const seg of segments) {
            if (seg.route_type === 'linear') {
                add_virtual(prev_point, seg.ways[0].geometry.coordinates[0]);
                for (const way of seg.ways) {
                    const wlen = way.geometry.coordinates.length;
                    for (let i = 0; i < wlen - 1; i++) {
                        const c = way.geometry.coordinates[i];
                        const old_weight = intersections[c] ? intersections[c].num : 0.0;
                        intersections[c] = {obj: c, num: old_weight + 0.6}
                    }
                }
                const c = seg.ways[0].geometry.coordinates[0];
                intersections[c] = {obj: c, num: intersections[c].num + 0.4}
                prev_point = seg.ways.at(-1).geometry.coordinates.at(-1);
                const old_weight = intersections[prev_point] ? intersections[prev_point].num : 0.0;
                intersections[prev_point] = {obj: prev_point, num: old_weight + 1.0}

            } else if (seg.route_type === 'split') {
                add_virtual(prev_point, seg.first);
                let last = traverse_segments(intersections, seg.first, seg.forward);
                add_virtual(last, seg.last);
                last = traverse_segments(intersections, seg.first, seg.backward);
                add_virtual(last, seg.last);
                prev_point = seg.last;
            } else if (seg.route_type === 'route') {
                prev_point = traverse_segments(intersections, prev_point, seg.main);
            }
        }

        return prev_point;
    }

    $effect(() => {
        const source = layer.getSource();
        source.clear();

        const rte = route.route;
        if (rte) {
            const intersections = {};
            featID = 1;
            const final_point = traverse_segments(intersections, null, rte.main);
            source.addFeature(new Feature({
                     geometry: new Point(final_point),
                     pointpos: 1,
                     id: featID++}));

            let seg_count = 1;
            layer.getSource().forEachFeature((feat) => {
                if (feat.getProperties().virtual)
                    seg_count += 1;
            });
            num_segments = seg_count;
        }
    });

    onDestroy(() => {
        layer.getSource().clear();
    });
</script>


<p>{$_('details.analyze.summary', {values: {num: num_segments}})}</p>
<p>{$_('details.analyze.legend')}</p>
<p><i>{$_('details.analyze.disclaimer')}</i></p>
