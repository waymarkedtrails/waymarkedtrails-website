<script>
    export let url;
    export let title;
</script>

{#if url}
<a href="{url}">{title}</a>
{/if}
