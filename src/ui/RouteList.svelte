<script>
    import { _ } from 'svelte-i18n';
    import { show_page } from '../app_state.js';
    import SimpleRouteList from './SimpleRouteList.svelte';

    export let route_data;
    export let groups;
</script>

<style>
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .divider {
        background-color: var(--theme-background-color);
        color: var(--theme-font-color);
        font-weight: bold;
        margin-bottom: 5px;
        margin-top: 10px;
    }

    .divider:first-of-type {
        margin-top: 0;
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
{:else}
    {$_('routelist.loading')}
{/if}

