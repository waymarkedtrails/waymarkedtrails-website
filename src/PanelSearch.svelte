<script>
    import jQuery from 'jquery';
    import {transformExtent} from 'ol/proj';
    import SidePanel from './ui/SidePanel.svelte';
    import SimpleRouteList from './ui/SimpleRouteList.svelte';
    import { onDestroy } from 'svelte';
    import { page_state, map_view_demand } from './app_state.js';
    import { make_route_title, make_route_subtitle } from './util/route_transforms.js';

    let fail_message = '';
    let query = '';
    let route_results = [];
    let place_results = [];

    let show_place = function (place) {
        let ext = [
            parseFloat(place.boundingbox[2]),
            parseFloat(place.boundingbox[0]),
            parseFloat(place.boundingbox[3]),
            parseFloat(place.boundingbox[1])];
        ext = transformExtent(ext, "EPSG:4326", "EPSG:3857");
        map_view_demand.set(ext);
    };

    onDestroy(page_state.subscribe((value) => {
        if (value.page !== 'search') {
            return;
        }

        query = value.params.get('query');
        if (typeof query === 'undefined') {
            fail_message = "Missing parameter 'query'.";
            return;
        }

        fail_message = '';

        jQuery.getJSON(WMTConfig.API_URL + '/list/search', {query: query})
            .done(function (json) {
                route_results = json.results;

                route_results.forEach(function(route) {
                    route.title = make_route_title(route);
                    route.subtitle = make_route_subtitle(route);
                });
            });

        jQuery.getJSON('http://nominatim.loar/search.php',
                       {q: query, format: 'jsonv2'})
            .done(function (json) {
                place_results = json;

                place_results.forEach(function (place) {
                    place.icon = 'http://nominatim.loar' + place.icon;
                    let split = place.display_name.indexOf(',');
                    if (split < 0) {
                        place.title = place.display_name;
                        place.subtitle = '';
                    } else {
                        place.title = place.display_name.substring(0, split);
                        place.subtitle = place.display_name.substring(split + 1);
                    }


                });
            });

    }));
</script>

<style>
    ul {
        list-style: none;
        margin: 2px -5px;
        padding: 0;
    }
</style>

<SidePanel title="Results for '{query}'" fail_message={fail_message}>
<h4>Routes</h4>
{#if route_results}
    <ul><SimpleRouteList route_data={route_results} /></ul>
{/if}
<h4>Places</h4>
{#if place_results}
    <ul><SimpleRouteList route_data={place_results} callback={show_place} /></ul>
{/if}

</SidePanel>
