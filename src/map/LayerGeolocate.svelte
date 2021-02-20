<script context="module">
    let geolocate;

    export function enable_geolocation() {
        geolocate.setTracking(true);
    }
</script>

<script>
    import { getContext } from 'svelte';
    import Feature from 'ol/Feature';
    import {Icon, Style} from 'ol/style';
    import {Vector as VectorLayer} from 'ol/layer';
    import Point from 'ol/geom/Point';
    import {Vector as VectorSource} from 'ol/source';
    import Geolocation from 'ol/Geolocation';
    import { MEDIA_URL } from '../config.js';


    const getMap = getContext('olContext');
    const map = getMap();

    const marker = new Feature();

    const style = new Style({
        image: new Icon({
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            opacity: 0.75,
            src: MEDIA_URL + 'img/marker.png'
        })
    });

    marker.setStyle(style);

    map.addLayer(new VectorLayer({
        source: new VectorSource({
            features: [marker]
        })
    }));

    geolocate = new Geolocation({
      projection: map.getView().getProjection(),
      trackingOptions: {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 7000
      }
    });

    geolocate.on('change:position', function() {
        let view = map.getView();
        let coords = geolocate.getPosition();
        if (coords) {
            marker.setGeometry(new Point(coords));
            view.setCenter(coords);
            if (view.getZoom() < 9)
                view.setZoom(9);
        } else {
            marker.setGeometry(null);
        }

        geolocate.setTracking(false);
    });

    geolocate.on('error', function() {
        // XXX show popup
        geolocate.setTracking(false);
    });
</script>
