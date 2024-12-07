<script>
    let { title = '', init_collapsed = false, children } = $props();

    let collapsed = $state(init_collapsed);
</script>

<style>
    h4 {
        cursor: pointer;
        display: flex;
        align-items: center;
    }
</style>

<h4 class="panel-heading" onclick={() => {collapsed = !collapsed}}>
    {#if collapsed}
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
        </svg>
    {:else}
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
        </svg>
    {/if}
    {title}
</h4>

{#if !collapsed}
<div>{@render children?.()}</div>
{/if}
