<script>
    import { _ } from 'svelte-i18n';
    import { page_state } from '../page_state.svelte.js';
    import SVGSearch from '../svg/Search.svelte';

    let searchterm = '';

    function turn_page(ev) {
        ev.preventDefault();
        page_state.show_page('search', [['query', searchterm]]);
    }
</script>

<style>
    form {
        display: flex;
    }

    input {
        padding: 8px 12px;
    }
</style>

<form class="input-group" action=""  onsubmit={turn_page}>
    <input bind:value={searchterm} type="search" results=5 name=s placeholder={$_('search.title')}>
    <button type="submit" class="btn-primary"><SVGSearch /></button>
</form>

