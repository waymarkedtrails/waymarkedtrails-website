<script>
    export let title = '';
    export let value;
</script>

<style>
    dt {
        padding-right: 5px;
        float: left;
    }

    dd {
        margin: 0
    }
</style>

{#if value}
<dt>{title}:</dt><dd>{value}</dd>
{/if}
