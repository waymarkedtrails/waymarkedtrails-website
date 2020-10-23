<script>
    import WMTConfig from 'theme';
    import { show_page } from '../app_state.js';
    import {set_visible as set_map_details_visible } from '../map/LayerRouteDetails.svelte';

    function show_route(route) {
        show_page('route', [['id', route.id]]);
    }

    function begin_hover(route_id) {
        set_map_details_visible(false);
    }

    function end_hover(route_id) {
        set_map_details_visible(true);
    }

    export let route_data;
    export let callback = show_route;
</script>

<style>
    button {
        width: 100%;
        border: none;
        padding-left: 5px;
    }

    .main-info {
        display: flex;
        align-items: baseline;
    }

    .subtitle {
        text-align: left;
        margin-top: -5px;
        text-size: smaller;
        color: #777;
        margin-left: 45px;
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

    img {
        max-width: 32px;
        max-height: 16px;
    }

    .route-symbol {
        flex: 0 0 45px;
    }
</style>

{#if route_data}
{#each route_data as route}
    <li>
        <button type="button" class="btn-outline-dark" on:click|preventDefault={callback(route)} on:mouseenter={() => begin_hover(route.id)} on:mouseleave={() => end_hover(route.id)}>
        <div class="main-info">
            <span class="route-symbol">
            {#if route.icon}
                <img alt="place icon" src="{route.icon}" />
            {:else}
                <img alt="route symbol" src="{WMTConfig.API_URL}/symbols/id/{route.symbol_id}" />
            {/if}
            </span>
            <span class="route-title">{route.title}</span>
            <span class="route-ref">{route.ref || ''}</span>
        </div>
        {#if route.subtitle}
            <div class="subtitle">{route.subtitle}</div>
        {/if}
    </li>
{/each}
{/if}

