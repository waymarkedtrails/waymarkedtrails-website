<script>
    import { _ } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import { json_load } from './util/load_json.js';
    import HourGlass from './svg/HourGlass.svelte';
    import D3ElevationProfile from './svg/D3ElevationProfile.svelte';

    let { osm_type, osm_id, route } = $props();

    let loader = $state();

    onMount(() => {
        let controller = new AbortController();
        const signal = controller.signal;
        const maxlen = route.route.length < 5000 ? 10 : route.route.length / 500;
        loader = json_load('/details/' + osm_type + '/' + osm_id + '/way-elevation',
                            {simplify: Math.floor(maxlen)}, signal)
                  .then((ele) => {  return route.get_elevation_profile(ele) });

        return () => { if (controller) controller.abort(); };
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

    .warn-unsorted {
        font-size: smaller;
        font-style: italic;
        margin: 0
    }

    .total {
        margin-top: 10px;
        width: 100%;
        text-align: center;
    }

    .total span {
        padding-left: 10px
    }
</style>

{#if loader}
{#await loader}
   <HourGlass />
{:then profile}
{#if route.continuity === 'none'}
<p class="warn-unsorted">{$_('elevation.warn_unsorted')}</p>
{/if}
<div>
<div class="altitude diagram-label">{$_('elevation.diagram.altitude')}</div>
<D3ElevationProfile data={profile} width="100%" height="200" y_axis_width="55"/>
<div class="distance diagram-label">{$_('elevation.diagram.distance')}</div>
</div>
<div class="total">{$_('elevation.total')}:
    <span>↗ {profile.ascent}m</span>
    <span>↘ {profile.descent}m</span>
</div>
{:catch error}
  {$_(error.message)}
{/await}
{/if}
