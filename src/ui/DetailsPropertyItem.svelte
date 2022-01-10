<script>
    export let title = '';
    export let value;
    export let type = '';

    let formatted_value;
    let unit;

    $: {
        if (value) {
            if (type === 'km') {
                if (value < 1000) {
                    formatted_value = value;
                    unit = 'm';
                } else if (value < 10000) {
                    formatted_value = (value/1000).toFixed(1);
                    unit = 'km';
                } else {
                    formatted_value = (value/1000).toFixed(0);
                    unit = 'km';
                }
            } else if (type === 'ele') {
                formatted_value = value.toFixed(1);
                unit = 'm';
            } else {
                formatted_value = value;
                unit = ''
            }
        }
    }

</script>

<style>
    .title {
        font-weight: bold;
        float: left
    }

    .value {
        overflow: auto;
        padding-left: 8px;
        margin-bottom: 4px
    }
</style>

{#if value}
<dt class="title">{title}:</dt><dd class="value">{formatted_value}&thinsp;{unit}</dd>
{/if}
