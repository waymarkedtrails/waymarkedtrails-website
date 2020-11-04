<script>
    import { json_loader } from './util/load_json.js';
    import WMTConfig from 'theme';
    import { onDestroy } from 'svelte';
    import SidePanel from './ui/SidePanel.svelte';
    import RouteList from './ui/RouteList.svelte';
    import { map_view } from './app_state.js';
    import { make_route_title, make_route_subtitle } from './util/route_transforms.js';

    const groups = WMTConfig.ROUTE_GROUPS;
    let fail_message = '';
    let route_data = false;

    const loader =json_loader(function(json) {
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

        route_data = data;
    }, function(error) { fail_message = "Request failed: " + error; });

    onDestroy(map_view.subscribe((value) => {
        if (typeof value.extent === 'undefined') {
            return;
        }

        fail_message = '';
        loader.load('/list/by_area', { bbox: value.extent.join(",") });
    }));

</script>

<SidePanel title="Routes" fail_message={fail_message}>
    <RouteList groups={groups} route_data={route_data} />
</SidePanel>
