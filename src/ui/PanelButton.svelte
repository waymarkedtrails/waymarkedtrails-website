<script>
    export let classes = '';
</script>

<style>
    button {
        background-color: #999;
        color: white;
        font-size: 21px;
        padding: 7px 6px 2px 7px;
        border-color: #bbb;
    }
</style>

<button class={classes} type="button" on:click>
  <slot></slot>
</button>
