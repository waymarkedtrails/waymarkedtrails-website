<script>
    import { _ } from 'svelte-i18n';
    import WMTConfig from '../../theme.js';
    import { show_page } from '../app_state.js';
    import SimpleRouteList from './SimpleRouteList.svelte';

    export let route_data;
    export let groups;

    function show_route(route_id) {
        show_page('route', [['id', route_id]]);
    }
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
</style>

{#if route_data}
    <ul>
    {#each groups as group}
        {#if route_data.get(group.id).length > 0}
            <li class="divider">{$_(group.label)}</li>
            <SimpleRouteList route_data={route_data.get(group.id)} />
        {/if}
    {/each}
    </ul>
{/if}

