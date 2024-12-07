<script>
    import { _ } from 'svelte-i18n';
    import { json_load } from './util/load_json.js';
    import {transformExtent} from 'ol/proj';
    import SearchForm from './ui/SearchForm.svelte';
    import SidePanel from './ui/SidePanel.svelte';
    import SimpleRouteList from './ui/SimpleRouteList.svelte';
    import HourGlass from './svg/HourGlass.svelte';
    import { onDestroy } from 'svelte';
    import { page_state } from './app_state.js';
    import { set_map_view } from './Map.svelte';
    import { make_route_title, make_route_subtitle } from './util/route_transforms.js';

    let query = $state('');
    let route_loader = $state();
    let place_loader = $state();

    let show_place = function (place) {
        let ext = [
            parseFloat(place.boundingbox[2]),
            parseFloat(place.boundingbox[0]),
            parseFloat(place.boundingbox[3]),
            parseFloat(place.boundingbox[1])];
        ext = transformExtent(ext, "EPSG:4326", "EPSG:3857");
        set_map_view(ext);
    };

    onDestroy(page_state.subscribe((value) => {
        if (value.page !== 'search') {
            return;
        }

        query = value.params.get('query') || '';
        if (query === '') {
            return;
        }

        let controller = new AbortController();
        const signal = controller.signal;

        route_loader = json_load('/list/search', {query: query}, signal)
            .then((json) => {
                json.results.forEach(function(route) {
                    route.title = make_route_title(route);
                    route.subtitle = make_route_subtitle(route);
                });
                return json.results;
            });

        place_loader = json_load('https://nominatim.openstreetmap.org/search',
                                 {q: query, format: 'jsonv2'}, signal)
            .then((json) => {
                json.forEach(function (place) {
                    const split = place.display_name.indexOf(',');
                    if (split < 0) {
                        place.title = place.display_name;
                        place.subtitle = '';
                    } else {
                        place.title = place.display_name.substring(0, split);
                        place.subtitle = place.display_name.substring(split + 1);
                    }
                });
                return json;
            });
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

<SidePanel>
{#snippet title()}{$_('search.title')}{#if query}: {query}{/if}{/snippet}
{#snippet content()}
<div class="search-input-div"><SearchForm /></div>
{#if query}
    <h2 class="panel-heading">{$_('search.routes')}</h2>
    {#if route_loader}
        {#await route_loader}
            <HourGlass />
        {:then route_results}
            <ul><SimpleRouteList route_data={route_results} /></ul>
        {/await}
    {/if}
    <h2 class="panel-heading">{$_('search.places')}</h2>
    {#if place_loader}
        {#await place_loader}
            <HourGlass />
        {:then place_results}
            <ul><SimpleRouteList route_data={place_results} callback={show_place} /></ul>
        {/await}
    {/if}
{:else}
{$_('search.help')}
{/if}
{/snippet}
</SidePanel>
