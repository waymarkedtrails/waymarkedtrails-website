<script>
    import { _ } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import { json_loader } from './util/load_json.js';
    import HourGlass from './svg/HourGlass.svelte';
    import D3ElevationProfile from './svg/D3ElevationProfile.svelte';

    export let osm_type;
    export let osm_id;
    export let length = 0;

    let profile;
    let fail_message = '';

    const loader = json_loader((json) => { profile = json; },
                               (error) => { fail_message = $_('error.load_error'); });

    onMount(() => {
        profile = false;
        fail_message = '';

        loader.load('/details/' + osm_type + '/' + osm_id + '/elevation');

        return () => { loader.abort(); };
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
</style>

{#if fail_message}
{fail_message}
{:else if profile}
{#if length > 0 && length * 1.1 < profile.end_position}
<p class="warn-unsorted">{$_('elevation.warn_unsorted')}</p>
{/if}
<div>
<div class="altitude diagram-label">{$_('elevation.diagram.altitude')}</div>
<D3ElevationProfile data={profile} width="100%" height="200" y_axis_width="55"/>
<div class="distance diagram-label">{$_('elevation.diagram.distance')}</div>
</div>
<p>{$_('elevation.ascent')}: {profile.ascent}m</p>
<p>{$_('elevation.descent')}: {profile.descent}m</p>
{:else}
    <HourGlass />
{/if}
