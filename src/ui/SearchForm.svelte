<script>
    import { _ } from 'svelte-i18n';
    import { page_state } from '../app_state.js';

    import SVGSearch from '../svg/Search.svelte';

    let searchterm;
    let params;
    $: params = [['query', searchterm]];

    function turn_page() {
        page_state.set({page: 'search', params: new Map(params)});
    }

    function toggle_search_box() {
    }
</script>

<style>
    form {
        display: flex;
    }

    input {
        font-size: 18px;
        padding: 8px 12px;
    }

    .mobile {
        display: none;
    }

    @media (max-width: 650px) {
        form {
            display: none;
        }

        .mobile {
            display: block;
        }
    }
</style>

<form class="input-group" action=""  on:submit|preventDefault={turn_page}>
    <input bind:value={searchterm} type="search" placeholder={$_('search.title')}>
    <button type="submit" class="btn-primary"><SVGSearch /></button>
</form>
<button class="mobile btn-primary" action=""  on:submit|preventDefault={toggle_search_box}><SVGSearch /></button>

