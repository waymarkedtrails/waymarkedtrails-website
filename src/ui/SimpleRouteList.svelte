<script>
    import { onDestroy } from 'svelte';
    import { preventDefault } from 'svelte/legacy';
    import { API_URL } from '../config.js';
    import { page_state } from '../page_state.svelte.js';
    import { map_state } from '../map_state.svelte.js';
    import LinearState from './LinearState.svelte';

    function show_route(route) {
        page_state.show_page();
        page_state.show_page('route', [['id', route.id], ['type', route.type]]);
    }

    function default_begin_hover(route) {
        map_state.highlighted_route = {id: route.id, type: route.type};
    }

    function default_end_hover() {
        map_state.highlighted_route = false;
    }

    let { route_data,
          callback = show_route,
          begin_hover = default_begin_hover,
          end_hover = default_end_hover
        } = $props();

    onDestroy(end_hover);
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
        flex: 1 1 auto;
        align-items: flex-start;
        min-width: 20px
    }

    .subtitle {
        color: #777;
        text-align: left
    }

    .title-line {
        display: flex;
        width: 100%;
        min-width: 20px
    }

    .route-title {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: left;
        flex: 0 1 auto;
        min-width: 20px
    }

    .route-state {
        white-space: nowrap;
        padding-left: 2px;
        flex: 1 0 15px;
        text-align: left;
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
        <button type="button" onclick={() => preventDefault(callback(route))} onmouseenter={() => begin_hover(route)} onmouseleave={end_hover}>
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
                <div class="route-state"><LinearState state={route.linear} /></div>
                <div class="route-ref">{route.ref || ''}</div>
            </div>
            {#if route.subtitle}
            <div class="subtitle">{route.subtitle}</div>
            {/if}
        </div>
    </li>
{/each}
{/if}

