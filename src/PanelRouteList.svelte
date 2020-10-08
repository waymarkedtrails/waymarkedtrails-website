<script>
    import jQuery from 'jquery';
    import WMTConfig from 'theme';
    import { onDestroy } from 'svelte';
    import SidePanel from './ui/SidePanel.svelte';
    import { map_view } from './app_state.js';

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

    function show_route(route_id) {
        console.log(route_id);
    }


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

<style>
    ul {
        list-style: none;
        margin: 2px -5px;
        padding: 0;
    }

    .divider {
        background-color: var(--theme-background-color);
        font-weight: bold
    }

    button {
        width: 100%;
        border: none;
        padding-left: 0;
    }

    .main-info {
        display: flex;
        align-items: baseline;
    }

    .subtitle {
        text-align: left;
        margin-left: 45px;
        margin-top: -5px;
        text-size: smaller;
        color: #777;
    }

    img {
        max-width: 32px;
        max-height: 16px;
    }

    .route-symbol {
        flex: 0 0 45px;
    }

    .route-title {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: left;
        flex: auto
    }

    .route-ref {
        flex: none;
        padding-left: 2px;
        color: rgb(90, 90, 150);
        font-familiy: mono
    }
</style>

<SidePanel title="Routes">
{#if route_data}
    <ul>
    {#each WMTConfig.ROUTE_GROUPS as group}
        {#if route_data.get(group.id).length > 0}
            <li class="divider">{group.label}</li>
            {#each route_data.get(group.id) as route}
            <li>
              <button type="button" class="btn-outline-dark"on:click={show_route(route.id)}>
              <div class="main-info">
              <span class="route-symbol"><img alt="route symbol" src="{WMTConfig.API_URL}/symbols/id/{route.symbol_id}" /></span>
              <span class="route-title">{route.title}</span>
              <span class="route-ref">{route.ref || ''}</span>
              </div>
              {#if route.subtitle}
                  <div class="subtitle">{route.subtitle}</div>
              {/if}
            </li>
            {/each}
        {/if}
    {/each}
    </ul>
{/if}
{#if fail_message !== ''}
  {fail_message}
{/if}
</SidePanel>
