<script>
    import { _ } from 'svelte-i18n';

    import Feature from 'ol/Feature';
    import {Icon, Style, Circle, Fill, Stroke} from 'ol/style';
    import {Vector as VectorLayer} from 'ol/layer';
    import Point from 'ol/geom/Point';
    import {Vector as VectorSource} from 'ol/source';
    import Geolocation from 'ol/Geolocation';

    import { MEDIA_URL } from './config.js';
    import { map_state } from './map_state.svelte.js';

    import ButtonFooter from './ui/ButtonFooter.svelte';

    import SvgGeoPin from './svg/GeoPin.svelte';

    let pinColor = $state('white');
    let is_enabled = false;

    const trackingColor = '#fd0e0e';
    const positioningColor = '#886868';

    const marker = new Feature({});

    const trackingStyle = new Style({
            image: new Circle({
                        radius: 9,
                        fill: new Fill({
                          color: trackingColor,
                        }),
                        stroke: new Stroke({
                          color: '#fff',
                          width: 3
                        })
                   })
            });
    const positioningStyle = new Style({
            image: new Circle({
                        radius: 9,
                        fill: new Fill({
                          color: positioningColor,
                        }),
                        stroke: new Stroke({
                          color: '#fff',
                          width: 3
                        })
                   })
            });

    map_state.map.addLayer(new VectorLayer({
        source: new VectorSource({
            features: [marker]
        })
    }));

    const geolocate = new Geolocation({
      trackingOptions: {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 7000,
      },
      projection: map_state.map.getView().getProjection()
    });

    geolocate.on('change:position', function() {
        let view = map_state.map.getView();
        let coords = geolocate.getPosition();
        if (coords) {
            marker.setGeometry(new Point(coords));
            marker.setStyle(trackingStyle);
            view.setCenter(coords);
            if (view.getZoom() < 9)
                view.setZoom(9);
        } else {
            marker.setGeometry(null);
        }
    });

    map_state.map.on('pointerdrag', function() {
        if (is_enabled) {
            geolocate.setTracking(false);
            pinColor = positioningColor;
            marker.setStyle(positioningStyle);
            is_enabled = false;
        }
    });

    function toggleEnable() {
        is_enabled = !is_enabled;
        geolocate.setTracking(is_enabled);
        if (is_enabled) {
            pinColor = trackingColor;
        } else {
            marker.setGeometry(null);
            pinColor = 'white';
        }
    }

    geolocate.on('error', function() { is_enabled = false; });
</script>

<ButtonFooter title={$_('locate_me')} onclick={() => {toggleEnable();}}><SvgGeoPin color={pinColor} /></ButtonFooter>
