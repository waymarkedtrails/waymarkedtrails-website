<script>
    let { children } = $props();
    const children_render = $derived(children);
</script>

<style>
    dl {
        font-size: smaller
    }
</style>

<dl>{@render children_render?.()}</dl>
