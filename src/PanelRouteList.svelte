<script>
    import jQuery from 'jquery';
    import WMTConfig from 'theme';
    import { onDestroy } from 'svelte';
    import SidePanel from './ui/SidePanel.svelte';
    import RouteList from './ui/RouteList.svelte';
    import { map_view } from './app_state.js';

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
            route.title = display_name(route);
            route.subtitle = make_subtitle(route);
            let key = data.has(route.group)? route.group : '';
            data.get(key).push(route);
        })

        return data;
    };

    const display_name = function (rel) {
        if (rel.name)
          return rel.name;
        if (rel.itinerary)
          return rel.itinerary.join(' - ');
        if (rel.symbol_description)
          return rel.symbol_description;
        if (rel.ref)
          return '[' + rel.ref + ']';
        return '(' + rel.id + ')';
    };

    const make_subtitle = function (rel) {
        if (rel.local_name)
            return rel.local_name;
        if (rel.name && rel.itinerary)
            return rel.itinerary.join(' - ');
        return '';
    };

    let unsubscribe_map_view = map_view.subscribe((value) => {
        if (ongoing_request || typeof value.extent === 'undefined') {
            return;
        }

        ongoing_request = true;
        fail_message = '';
        jQuery.getJSON(WMTConfig.API_URL + '/list/by_area',
                       { bbox: value.extent.join(",") })
              .done(function (json) {
                  console.log(json);
                  route_data = convert_json(json.results);
                  ongoing_request = false;
              })
              .fail(function (jqxhr, textStatus, error) {
                  fail_message = "Request failed: " + textStatus + ", " + error;
              });
    });

</script>

<SidePanel title="Routes">
<RouteList groups={groups} route_data={route_data} />
{#if fail_message !== ''}
  {fail_message}
{/if}
</SidePanel>
