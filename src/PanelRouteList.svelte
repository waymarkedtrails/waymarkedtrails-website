<script>
    import jQuery from 'jquery';
    import WMTConfig from 'theme';
    import { onDestroy } from 'svelte';
    import SidePanel from './ui/SidePanel.svelte';
    import RouteList from './ui/RouteList.svelte';
    import { map_view } from './app_state.js';
    import { make_route_title, make_route_subtitle } from './util/route_transforms.js';

    const groups = WMTConfig.ROUTE_GROUPS;
    let fail_message = '';
    let route_data = false;
    let ongoing_request = false;

    const convert_json = function(routes) {
        let data = new Map();
        WMTConfig.ROUTE_GROUPS.forEach(function(group) {
            data.set(group.id, []);
        });

        routes.forEach(function(route) {
            route.title = make_route_title(route);
            route.subtitle = make_route_subtitle(route);
            let key = data.has(route.group)? route.group : '';
            data.get(key).push(route);
        })

        return data;
    };

    onDestroy(map_view.subscribe((value) => {
        if (ongoing_request || typeof value.extent === 'undefined') {
            return;
        }

        ongoing_request = true;
        fail_message = '';
        jQuery.getJSON(WMTConfig.API_URL + '/list/by_area',
                       { bbox: value.extent.join(",") })
              .done(function (json) {
                  route_data = convert_json(json.results);
                  ongoing_request = false;
              })
              .fail(function (jqxhr, textStatus, error) {
                  fail_message = "Request failed: " + textStatus + ", " + error;
              });
    }));

</script>

<SidePanel title="Routes" fail_message={fail_message}>
    <RouteList groups={groups} route_data={route_data} />
</SidePanel>
