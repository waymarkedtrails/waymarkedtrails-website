<script>
    import { _ } from 'svelte-i18n';
    import { ROUTE_GROUPS } from './config.js';
    import { json_loader } from './util/load_json.js';
    import SidePanel from './ui/SidePanel.svelte';
    import RouteList from './ui/RouteList.svelte';
    import { map_view, page_state } from './app_state.js';
    import { make_route_title, make_route_subtitle } from './util/route_transforms.js';
    import { load_routes } from './map/LayerVectorData.svelte';

    const max_routes = 20;
    let fail_message = '';
    let route_data = false;
    let is_id_mode = false;
    let has_more = false;

    $: {
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

            fail_message = '';
            if (do_ids) {
                is_id_mode = true;
                loader.load('/list/by_ids', args);
            }
        }
    }

    $: {
        let extent = $map_view.extent;
        if (!is_id_mode && typeof extent !== 'undefined') {
            fail_message = '';
            loader.load('/list/by_area', {bbox: extent.join(","), limit: max_routes});
        }
    }

    const loader = json_loader(function(json) {
        let data = new Map();
        ROUTE_GROUPS.forEach(function(group) {
            data.set(group.id, []);
        });

        has_more = json.results.length >= max_routes;

        json.results.forEach(function(route) {
            route.title = make_route_title(route);
            route.subtitle = make_route_subtitle(route);
            let key = data.has(route.group)? route.group : '';
            data.get(key).push(route);
        });

        load_routes(json.results, json.bbox);
        route_data = data;
    }, function(error) { fail_message = $_('error.load_error'); });

</script>

<SidePanel title="Routes" fail_message={fail_message}>
    <RouteList groups={ROUTE_GROUPS} route_data={route_data} />
    {#if has_more}<p>{$_('routelist.more')}</p>{/if}
</SidePanel>
