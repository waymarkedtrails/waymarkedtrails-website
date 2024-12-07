<script>
    import SVGForward from '../svg/Forward.svelte';

    let { url, title } = $props();
</script>

<style>
    div {
        display: flex;
    }

    a {
        padding-left: 5px;
        padding-right: 15px;
    }
</style>

{#if url}
<div>
    <SVGForward /><a href="{url}">{title}</a>
</div>
{/if}
