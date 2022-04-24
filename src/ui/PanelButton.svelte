<script>
    export let classes = '';
    export let title = '';
</script>

<style>
    button {
        background-color: none;
        color: black;
        font-size: 21px;
        padding: 10px 6px 5px 7px;
        border:none;
    }
</style>

<button title={title} class={classes} type="button" on:click>
  <slot></slot>
</button>
