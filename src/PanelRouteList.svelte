<script>
    import { json_loader } from './util/load_json.js';
    import WMTConfig from '../theme.js';
    import SidePanel from './ui/SidePanel.svelte';
    import RouteList from './ui/RouteList.svelte';
    import { map_view, page_state } from './app_state.js';
    import { make_route_title, make_route_subtitle } from './util/route_transforms.js';
    import { load_routes } from './map/LayerVectorData.svelte';

    const groups = WMTConfig.ROUTE_GROUPS;
    let fail_message = '';
    let route_data = false;
    let current_ids;

    $: {
        let page = $page_state;
        if (page.page === 'routelist') {
            current_ids = page.params.get('ids');
            fail_message = '';
            if (typeof current_ids !== 'undefined') {
                loader.load('/list/by_ids', {ids : current_ids});
            }
        }
    }

    $: {
        let extent = $map_view.extent;
        if (typeof current_ids === 'undefined' && typeof extent !== 'undefined') {
            fail_message = '';
            loader.load('/list/by_area', {bbox: extent.join(",")});
        }
    }

    const loader = json_loader(function(json) {
        let data = new Map();
        WMTConfig.ROUTE_GROUPS.forEach(function(group) {
            data.set(group.id, []);
        });

        json.results.forEach(function(route) {
            route.title = make_route_title(route);
            route.subtitle = make_route_subtitle(route);
            let key = data.has(route.group)? route.group : '';
            data.get(key).push(route);
        });

        load_routes(json.results);
        route_data = data;
    }, function(error) { fail_message = "Request failed: " + error; });

</script>

<SidePanel title="Routes" fail_message={fail_message}>
    <RouteList groups={groups} route_data={route_data} />
</SidePanel>
