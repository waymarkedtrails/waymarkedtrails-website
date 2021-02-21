<script>
    import SVGChevron from '../svg/DoubleChevron.svelte';
    export let itinerary;
</script>

<style>
    div {
        display: flex;
        width: 100%;
        background-color: #cbcbcb;
        font-size: 16px;
        align-items: flex-start;
        flex-wrap: wrap
    }

    .delimiter {
        color: white;
        font-size: 24px;
        height: 20px;
        margin-top: -3px;
        margin-right: 3px;
    }
</style>

{#if itinerary}
    <div>
        {#each itinerary as stop, idx}
            {#if idx > 0}<span class="delimiter"><SVGChevron /></span>{/if}
            {stop}
        {/each}
    </div>
{/if}
