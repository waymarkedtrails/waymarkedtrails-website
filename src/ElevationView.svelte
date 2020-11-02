<script>
    import jQuery from 'jquery';
    import { onMount, onDestroy } from 'svelte';
    import { json as loadJSON } from 'd3-fetch';
    import HourGlass from './svg/HourGlass.svelte';
    import D3ElevationProfile from './svg/D3ElevationProfile.svelte';

    export let osm_type;
    export let osm_id;

    let profile;
    let fail_message = '';

    onMount(() => {
        profile = false;

        loadJSON(WMTConfig.API_URL + '/details/' + osm_type + '/' + osm_id + '/elevation')
            .then(function(json) {
                profile = json;
            })
            .catch(function (error) {
                  fail_message = "Request failed: " + error;
            });
    });
</script>

<style>
    .diagram-label {
        font-size: smaller;
    }

    .altitude {
        width: 200px;
        transform: translateX(calc(5px - 50%)) translateY(100px) rotate(270deg);
        text-align: center
    }

    .distance {
        width: 100%;
        text-align: center;
    }
</style>

{#if fail_message}
Error: {fail_message}
{:else if profile}
<div>
<div class="altitude diagram-label">Altitude (in m)</div>
<D3ElevationProfile data={profile} width="100%" height="200" y_axis_width="55"/>
<div class="distance diagram-label">Distance (in km)</div>
</div>
<p>Total ascent: {profile.ascent}m</p>
<p>Total descent: {profile.descent}m</p>
{:else}
    <HourGlass />
{/if}
