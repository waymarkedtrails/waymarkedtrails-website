<script>
    import WMTConfig from 'theme';
    import { getContext, onDestroy } from 'svelte';
    import { geolocation_tracking_enabled } from './app_state.js';
    import Feature from 'ol/Feature';
    import {Icon, Style} from 'ol/style';
    import {Vector as VectorLayer} from 'ol/layer';
    import Point from 'ol/geom/Point';
    import {Vector as VectorSource} from 'ol/source';
    import Geolocation from 'ol/Geolocation';


    const getMap = getContext('olContext');
    const map = getMap();

    const marker = new Feature({
        style : new Style({
            image: new Icon({
                anchor: [0.5, 0],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                opacity: 0.75,
                src: WMTConfig.MEDIA_URL + '/img/marker.png'
            })
       })
    });

    map.addLayer(new VectorLayer({
        source: new VectorSource({
            features: [marker]
        })
    }));

    const geolocate = new Geolocation({
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
        geolocation_tracking_enabled.set(false);
    });

    geolocate.on('error', function() {
        // XXX show popup
        geolocation_tracking_enabled.set(false);
    });

    const unsubscribe = geolocation_tracking_enabled.subscribe(value => {
        geolocate.setTracking(value);
    });

    onDestroy(unsubscribe);
</script>
