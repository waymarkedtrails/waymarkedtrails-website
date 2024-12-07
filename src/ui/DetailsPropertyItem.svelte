<script>
    let { title = '', value, type = '' } = $props();

    let formatted = $derived.by(() => {
        if (value) {
            if (type === 'km') {
                if (value < 1000) {
                    return {value: value, unit: 'm'};
                }
                if (value < 10000) {
                    return {value: (value/1000).toFixed(1), unit: 'km'};
                }
                return {value: (value/1000).toFixed(0), unit: 'km'};
            } else if (type === 'ele') {
                return {value: value.toFixed(1), unit: 'm'};
            }
        }
        return {value: value, unit: ''}
    });
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
<dt class="title">{title}:</dt><dd class="value">{formatted.value}&thinsp;{formatted.unit}</dd>
{/if}
