<script>
    import { page_state } from '../app_state.js';

    export let page;

    function open_panel() {
        page_state.set({page: page});
    }
</script>

<button type="button" class="btn btn-secondary" on:click={open_panel}>
    <slot></slot>
</button>
