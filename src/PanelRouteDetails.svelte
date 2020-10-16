<script>
    import jQuery from 'jquery';
    import WMTConfig from 'theme';
    import SidePanel from './ui/SidePanel.svelte';
    import { page_state } from './app_state.js';
    import { onDestroy } from 'svelte';
    import { make_route_title, make_route_subtitle } from './util/route_transforms.js';
    import ButtonRouteZoom from './ui/ButtonRouteZoom.svelte';
    import ButtonRouteDownload from './ui/ButtonRouteDownload.svelte';
    import Collapsible from './ui/Collapsible.svelte';
    import SimpleRouteList from './ui/SimpleRouteList.svelte';

    let osm_type = '';
    let osm_id = '';
    let fail_message = '';
    let route;

    onDestroy(page_state.subscribe((value) => {
        if (value.page !== 'route') {
            return;
        }

        osm_id = value.params.get('id');
        if (typeof osm_id === 'undefined') {
            fail_message = "Missing parameter 'id'.";
            return;
        }
        osm_type = value.params.get('type') || 'relation';

        jQuery.getJSON(WMTConfig.API_URL + '/details/' + osm_type + '/' + osm_id)
            .done(function (json) {
                route = json;
                route.tag_keys = [];
                for (var k in route.tags)
                    route.tag_keys.push(k);
                route.tag_keys.sort((a, b) => a.localeCompare(b));

                if (route.subroutes) {
                    route.subroutes.forEach(function(route) {
                        route.title = make_route_title(route);
                        route.subtitle = make_route_subtitle(route);
                    });
                }

                if (route.superroutes) {
                    route.superroutes.forEach(function(route) {
                        route.title = make_route_title(route);
                        route.subtitle = make_route_subtitle(route);
                    });
                }

                console.log(route);

                fail_message = '';
            })
            .fail(function (jqxhr, textStatus, error) {
                  fail_message = "Request failed: " + textStatus + ", " + error;
            });
    }));

</script>

<style>
    h3 {
        padding-top: 5px;
    }

    h3 img {
        height: 45px
    }

    dl {
        font-size: smaller
    }

    dt {
        padding-right: 5px;
        float: left;
    }

    dd {
        margin: 0
    }

    td {
        padding: 0 5px;
    }

    ul {
        list-style: none;
        margin: 2px -5px;
        padding: 0;
    }
</style>

<SidePanel title="{osm_type} {osm_id}" fail_message={fail_message}>
{#key route}{#if route}
<h3>
    <img alt="route symbol" src="{WMTConfig.API_URL}/symbols/id/{route.symbol_id}" />
    {make_route_title(route)}
</h3>
<div class="btn-group" role="group" aria-label="Quick access">
  <ButtonRouteZoom bbox={route.bbox} />
  <ButtonRouteDownload route_type={osm_type} route_id={osm_id} format="gpx">GPX</ButtonRouteDownload>
  <ButtonRouteDownload route_type={osm_type} route_id={osm_id} format="kml">KML</ButtonRouteDownload>
</div>

<p>{#if route.itinerary}{route.itinerary.join(' - ')}{/if}</p>

<dl>
{#if route.ref}<dt>Ref:</dt><dd>{route.ref}</dd>{/if}
{#if route.mapped_length}<dt>Mapped length:</dt><dd>{route.mapped_length}</dd>{/if}
{#if route.official_length}<dt>Mapped length:</dt><dd>{route.official_length}</dd>{/if}
{#if route.operator}<dt>Operator:</dt><dd>{route.operator}</dd>{/if}
{#if route.symbol}<dt>Symbol:</dt><dd>{route.symbol}</dd>{/if}
</dl>

{#if route.description}<p>{route.description}</p>{/if}
{#if route.note}<p><i>Note:</i> {route.note}<p>{/if}

<div>
    {#if route.url}<a href="{route.url}">Website</a>{/if}
    {#if route.wikipedia}<a href="{WMTConfig.API_URL + '/details/' + osm_type + '/' + osm_id + '/wikilink'}">Wikipedia</a>{/if}
</div>

<Collapsible title="Elevation profile" init_collapsed={true}>
    TODO
</Collapsible>

{#if route.subroutes}
<Collapsible title="Sections" init_collapsed={true}>
    <ul><SimpleRouteList route_data={route.subroutes} /></ul>
</Collapsible>
{/if}

{#if route.superroutes}
<Collapsible title="Part of" init_collapsed={true}>
    <ul><SimpleRouteList route_data={route.superroutes} /></ul>
</Collapsible>
{/if}


<Collapsible title="OpenStreetMap tags">
    <table>
        {#each route.tag_keys as key}
            <tr><td>{key}</td><td>{route.tags[key]}</td></tr>
        {/each}
    </table>
</Collapsible>

{/if}{/key}
</SidePanel>
