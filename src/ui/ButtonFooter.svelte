<script>
    export let title = '';
</script>

<button class="btn-primary" title={title} type="button" on:click>
<slot></slot>
</button>
