<script>
    import { _ } from 'svelte-i18n';
    import { onDestroy } from 'svelte';
    import { ROUTE_GROUPS } from './config.js';
    import { json_load } from './util/load_json.js';
    import SidePanel from './ui/SidePanel.svelte';
    import RouteList from './ui/RouteList.svelte';
    import { page_state } from './page_state.svelte.js';
    import { map_state } from './map_state.svelte.js';
    import { make_route_title, make_route_subtitle } from './util/route_transforms.js';

    const max_routes = 20;
    let is_id_mode = false;

    let loader = $state();

    let aborter;

    function process_result(json) {
        const data = new Map();
        ROUTE_GROUPS.forEach(function(group) {
            data.set(group.id, []);
        });

        const has_more = json.results.length >= max_routes;

        json.results.forEach(function(route) {
            route.title = make_route_title(route);
            route.subtitle = make_route_subtitle(route);
            let key = data.has(route.group)? route.group : '';
            data.get(key).push(route);
        });

        map_state.vector_routes = json.results;
        return {data: data, has_more: has_more};
    };

    $effect(() => {
        if (page_state.page === 'routelist') {
            let rel_ids = page_state.params.get('relations');
            let ws_ids = page_state.params.get('waysets');
            let way_ids = page_state.params.get('ways');
            let do_ids = false;

            let args = {};
            if (typeof rel_ids !== 'undefined') {
                do_ids = true;
                args['relations'] = rel_ids;
            }
            if (typeof ws_ids !== 'undefined') {
                do_ids = true;
                args['waysets'] = ws_ids;
            }
            if (typeof way_ids !== 'undefined') {
                do_ids = true;
                args['ways'] = way_ids;
            }

            if (do_ids) {
                is_id_mode = true;
                aborter?.abort()
                aborter = new AbortController();
                const signal = aborter.signal;

                loader = json_load('/list/by_ids', args, signal)
                    .then((json) => process_result(json));
            }
        }
    });

    $effect(() => {
        const extent = map_state.extent;
        if (!is_id_mode && extent) {
            aborter?.abort()
            aborter = new AbortController();
            const signal = aborter.signal;
            loader = json_load('/list/by_area', {bbox: extent.join(","), limit: max_routes},
                               signal)
                .then((json) => process_result(json));
        }
    });

    onDestroy(() => {
        map_state.vector_routes = [];
    });
</script>

<SidePanel>
{#snippet title()}Routes{/snippet}
{#snippet content()}
    {#if loader}
        {#await loader then routes}
            <RouteList groups={ROUTE_GROUPS} route_data={routes.data} />
            {#if routes.has_more}<p>{$_('routelist.more')}</p>{/if}
        {:catch error}
            {$_(error.message)}
        {/await}
    {/if}
{/snippet}
</SidePanel>
