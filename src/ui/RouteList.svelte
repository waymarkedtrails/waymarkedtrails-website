<script>
    import WMTConfig from 'theme';

    export let route_data;
    export let groups;

    function show_route(route_id) {
        console.log(route_id);
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

    button {
        width: 100%;
        border: none;
        padding-left: 0;
    }

    .main-info {
        display: flex;
        align-items: baseline;
    }

    .subtitle {
        text-align: left;
        margin-left: 45px;
        margin-top: -5px;
        text-size: smaller;
        color: #777;
    }

    img {
        max-width: 32px;
        max-height: 16px;
    }

    .route-symbol {
        flex: 0 0 45px;
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
    {#each groups as group}
        {#if route_data.get(group.id).length > 0}
            <li class="divider">{group.label}</li>
            {#each route_data.get(group.id) as route}
            <li>
              <button type="button" class="btn-outline-dark"on:click={show_route(route.id)}>
              <div class="main-info">
              <span class="route-symbol"><img alt="route symbol" src="{WMTConfig.API_URL}/symbols/id/{route.symbol_id}" /></span>
              <span class="route-title">{route.title}</span>
              <span class="route-ref">{route.ref || ''}</span>
              </div>
              {#if route.subtitle}
                  <div class="subtitle">{route.subtitle}</div>
              {/if}
            </li>
            {/each}
        {/if}
    {/each}
    </ul>
{/if}

