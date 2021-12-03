<script>
    export let classes = '';
</script>

<style>
    button {
        background-color: #ccc;
        color: black;
        font-size: 21px;
        padding: 10px 6px 5px 7px;
        border-left: 1px solid white;
        border-right: 1px solid #bbb;
        border-top: none;
        border-bootom: none;
    }
</style>

<button class={classes} type="button" on:click>
  <slot></slot>
</button>
