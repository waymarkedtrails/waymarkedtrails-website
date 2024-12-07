<script>
    let {children, ...button_props} = $props();
    const children_render = $derived(children);
</script>

<button class="btn-primary" type="button" {...button_props}>
{@render children_render?.()}
</button>
