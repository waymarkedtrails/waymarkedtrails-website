<script>
    import { _ } from 'svelte-i18n';

    import { enable_geolocation } from './map/LayerGeolocate.svelte';
    import { show_page } from './app_state.js';

    import SearchForm from './ui/SearchForm.svelte';
    import ButtonFooter from './ui/ButtonFooter.svelte';

    import SvgGeoPin from './svg/GeoPin.svelte';
    import SvgGear from './svg/Gear.svelte';
    import SvgInfo from './svg/Info.svelte';

    export let sidepanel = '';
</script>

<style>
    .toolbar {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin: 0;
        padding: 4px 0;
        background-color: var(--theme-background-color);
    }

    .toolbar div {
        display: flex;
    }
</style>

<div class="toolbar" >
    <div><SearchForm /></div>
    <div>
        <ButtonFooter title={$_('settings.title')} on:click={() => show_page('settings')}><SvgGear /></ButtonFooter>
        <ButtonFooter title={$_('locate_me')} on:click={enable_geolocation}><SvgGeoPin /></ButtonFooter>
        <ButtonFooter title={$_('help')} on:click={() => show_page(sidepanel.startsWith('help')?'':'help-about')}><SvgInfo /></ButtonFooter>
    </div>
    <div>
        <ButtonFooter on:click={() => show_page('routelist')}>{$_('routelist.title')}</ButtonFooter>
    </div>
</div>
