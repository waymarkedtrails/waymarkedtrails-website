<script>
    import { _ } from 'svelte-i18n';
    import { json_loader } from './util/load_json.js';
    import {transformExtent} from 'ol/proj';
    import SearchForm from './ui/SearchForm.svelte';
    import SidePanel from './ui/SidePanel.svelte';
    import SimpleRouteList from './ui/SimpleRouteList.svelte';
    import { onDestroy } from 'svelte';
    import { page_state } from './app_state.js';
    import { set_map_view } from './Map.svelte';
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
        set_map_view(ext);
    };

    const route_search = json_loader((json) => {
        json.results.forEach(function(route) {
            route.title = make_route_title(route);
            route.subtitle = make_route_subtitle(route);
        });

        route_results = json.results;
    });

    const place_search = json_loader((json) => {
        json.forEach(function (place) {
            let split = place.display_name.indexOf(',');
            if (split < 0) {
                place.title = place.display_name;
                place.subtitle = '';
            } else {
                place.title = place.display_name.substring(0, split);
                place.subtitle = place.display_name.substring(split + 1);
            }
         });

        place_results = json;
    }, function(error) {}, 'https://nominatim.openstreetmap.org');

    onDestroy(page_state.subscribe((value) => {
        if (value.page !== 'search') {
            return;
        }

        fail_message = '';

        query = value.params.get('query');
        if (typeof query === 'undefined') {
            return;
        }

        route_search.load('/list/search', {query: query});
        place_search.load('/search.php', {q: query, format: 'jsonv2'});
    }));

</script>

<style>
    ul {
        list-style: none;
        margin: 2px -5px;
        padding: 0;
    }

    .search-input-div {
        margin: 0px 12px;
    }

    .search-input-div :global(input) {
        width: 100%
    }

    .search-input-div :global(button) {
        background-color: #efefef;
        color: black;
        border-color: #eee;
    }

    @media (min-width: 650px) {
        .search-input-div {
            display: none
        }
    }

</style>

<SidePanel title="{$_('search.title')}{query ? (': ' + query) : ''}" fail_message={fail_message}>
<div class="search-input-div"><SearchForm /></div>
{#if query}
    <h2 class="panel-heading">{$_('search.routes')}</h2>
    {#if route_results}
        <ul><SimpleRouteList route_data={route_results} /></ul>
    {/if}
    <h2 class="panel-heading">{$_('search.places')}</h2>
    {#if place_results}
        <ul><SimpleRouteList route_data={place_results} callback={show_place} /></ul>
    {/if}
{:else}
{$_('search.help')}
{/if}

</SidePanel>
