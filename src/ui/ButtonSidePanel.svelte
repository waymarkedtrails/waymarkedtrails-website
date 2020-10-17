<script>
    import { page_state } from '../app_state.js';

    export let page;
    export let params = [];

    function open_panel() {
        page_state.set({page: page, params: new Map(params)});
    }
</script>

<button type="button" class="btn btn-secondary" on:click={open_panel}>
    <slot></slot>
</button>
