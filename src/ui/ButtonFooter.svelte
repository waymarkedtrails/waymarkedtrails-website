<script>
    export let title = '';
</script>

<button title={title} type="button" class="btn btn-secondary" on:click>
<slot></slot>
</button>
