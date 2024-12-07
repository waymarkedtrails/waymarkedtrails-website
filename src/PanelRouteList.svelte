<script>
    import { _ } from 'svelte-i18n';
    import { ROUTE_GROUPS } from './config.js';
    import { json_load } from './util/load_json.js';
    import SidePanel from './ui/SidePanel.svelte';
    import RouteList from './ui/RouteList.svelte';
    import { map_view, page_state } from './app_state.js';
    import { make_route_title, make_route_subtitle } from './util/route_transforms.js';
    import { load_routes } from './map/LayerVectorData.svelte';

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

        load_routes(json.results, json.bbox);
        return {data: data, has_more: has_more};
    };

    $effect(() => {
        let page = $page_state;
        if (page.page === 'routelist') {
            let rel_ids = page.params.get('relations');
            let ws_ids = page.params.get('waysets');
            let way_ids = page.params.get('ways');
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
        let extent = $map_view.extent;
        if (!is_id_mode && typeof extent !== 'undefined') {
            aborter?.abort()
            aborter = new AbortController();
            const signal = aborter.signal;
            loader = json_load('/list/by_area', {bbox: extent.join(","), limit: max_routes},
                               signal)
                .then((json) => process_result(json));
        }
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
