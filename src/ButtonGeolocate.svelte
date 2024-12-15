<script>
    import { _ } from 'svelte-i18n';

    import Feature from 'ol/Feature';
    import {Icon, Style} from 'ol/style';
    import {Vector as VectorLayer} from 'ol/layer';
    import Point from 'ol/geom/Point';
    import {Vector as VectorSource} from 'ol/source';
    import Geolocation from 'ol/Geolocation';

    import { MEDIA_URL } from './config.js';
    import { map_state } from './map_state.svelte.js';

    import ButtonFooter from './ui/ButtonFooter.svelte';

    import SvgGeoPin from './svg/GeoPin.svelte';

    let is_enabled = $state(false);

    const marker = new Feature({
        style: new Style({
            image: new Icon({
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                opacity: 0.75,
                src: MEDIA_URL + 'img/marker.png'
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
        timeout: 7000
      }
    });

    geolocate.on('change', function() {
        let view = map_state.map.getView();
        let coords = geolocate.getPosition();
        if (coords) {
            geolocate.setProjection(view.getProjection());
            marker.setGeometry(new Point(coords));
            view.setCenter(coords);
            if (view.getZoom() < 9)
                view.setZoom(9);
        } else {
            marker.setGeometry(null);
        }
    });

    $effect(() => {
        geolocate.setTracking(is_enabled);
        if (!is_enabled) {
            marker.setGeometry(null);
        }
    });

    geolocate.on('error', function() { is_enabled = false; });
</script>

<ButtonFooter title={$_('locate_me')} onclick={() => {is_enabled = !is_enabled;}}><SvgGeoPin color={is_enabled ? "lightgreen" : "white"} /></ButtonFooter>
