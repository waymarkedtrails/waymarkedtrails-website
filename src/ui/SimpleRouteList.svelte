<script>
    import { API_URL } from '../config.js';
    import { show_page } from '../app_state.js';
    import {set_visible as set_map_details_visible } from '../map/LayerRouteDetails.svelte';
    import {highlight_route, unhighlight_route } from '../map/LayerVectorData.svelte';

    function show_route(route) {
        show_page('route', [['id', route.id], ['type', route.type]]);
    }

    function begin_hover(route_id, route_type) {
        set_map_details_visible(false);
        highlight_route(route_id, route_type);
    }

    function end_hover() {
        set_map_details_visible(true);
        unhighlight_route();
    }

    export let route_data;
    export let callback = show_route;
</script>

<style>
    button {
        width: 100%;
        border: none;
        padding-left: 5px;
        background: #f8f8f8;
        margin-bottom: 2px;
        display:flex;
        justify-content: space-between;
    }

    button:hover {
        background: #ddd;
    }

    img {
        max-width: 32px;
        max-height: 16px;
    }

    .route-symbol {
        flex: 0 0 45px;
    }

    .main-info {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        align-items: flex-start
    }

    .subtitle {
        color: #777;
        text-align: left
    }

    .title-line {
        display: flex;
        width: 100%
    }

    .route-title {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: left;
        flex: 1 1 auto;
        width: 5px;
    }

    .route-ref {
        white-space: nowrap;
        padding-left: 2px;
        color: rgb(90, 90, 150);
        font-family: mono;
        flex: 0 0 2px;
    }

</style>

{#if route_data}
{#each route_data as route}
    <li>
        <button type="button" on:click|preventDefault={callback(route)} on:mouseenter={() => begin_hover(route.id, route.type)} on:mouseleave={end_hover}>
        <div class="route-symbol">
            {#if route.icon}
                <img alt="place icon" src="{route.icon}" />
            {:else if route.symbol_id}
                <img alt="route symbol" src="{API_URL}/symbols/id/{route.symbol_id}.svg" />
            {/if}
        </div>
        <div class="main-info">
            <div class="title-line">
                <div class="route-title">{route.title}</div>
                <div class="route-ref">{route.ref || ''}</div>
            </div>
            {#if route.subtitle}
            <div class="subtitle">{route.subtitle}</div>
            {/if}
        </div>
    </li>
{/each}
{/if}

