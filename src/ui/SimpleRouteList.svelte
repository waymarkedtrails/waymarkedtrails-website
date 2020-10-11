<script>
    import WMTConfig from 'theme';
    import { show_page } from '../app_state.js';

    export let route_data;

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
</style>

{#if route_data}
    <ul>
        {#each route_data as route}
        <li>
          <button type="button" class="btn-outline-dark"on:click={show_route(route.id)}>
          <div class="main-info">
          <span class="route-title">{route.title}</span>
          <span class="route-ref">{route.ref || ''}</span>
          </div>
          {#if route.subtitle}
              <div class="subtitle">{route.subtitle}</div>
          {/if}
        </li>
        {/each}
    </ul>
{/if}

