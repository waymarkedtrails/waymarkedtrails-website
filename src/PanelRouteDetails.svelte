<script>
    import jQuery from 'jquery';
    import WMTConfig from 'theme';
    import SidePanel from './ui/SidePanel.svelte';
    import { page_state } from './app_state.js';
    import { onDestroy } from 'svelte';

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
            return
        }
        osm_type = value.params.get('type') || 'relation';

        jQuery.getJSON(WMTConfig.API_URL + '/details/' + osm_type + '/' + osm_id)
            .done(function (json) {
                route = json;
                fail_message = '';
            })
            .fail(function (jqxhr, textStatus, error) {
                  fail_message = "Request failed: " + textStatus + ", " + error;
            });
    }));

</script>

<style>
</style>

<SidePanel title="{osm_type} {osm_id}" fail_message={fail_message}>
{#if route}
<h3>
    <img alt="route symbol" src="{WMTConfig.API_URL}/symbols/id/{route.symbol_id}" height=45 />
</h3>
{/if}
</SidePanel>
