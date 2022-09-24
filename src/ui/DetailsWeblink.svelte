<script>
    import SVGForward from '../svg/Forward.svelte';

    export let url;
    export let title;
</script>

<style>
    div {
        display: flex;
        align-items: center;
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
