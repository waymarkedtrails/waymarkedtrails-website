<script>
    import { _ } from 'svelte-i18n';

    import { enable_geolocation } from './map/LayerGeolocate.svelte';
    import { show_page } from './app_state.js';

    import SearchForm from './ui/SearchForm.svelte';
    import ButtonFooter from './ui/ButtonFooter.svelte';

    import SvgGeoPin from './svg/GeoPin.svelte';
    import SvgGear from './svg/Gear.svelte';
    import SvgInfo from './svg/Info.svelte';
    import SVGListTask from './svg/ListTask.svelte';

    export let sidepanel = '';
</script>

<style>
    .toolbar {
        display: flex;
        justify-content: space-between;
        margin: 0;
        padding: 4px;
        background-color: var(--theme-background-color);
    }

    .toolbar div {
        display: flex;
    }

    .mobile-yes {
        display: none
    }

    @media (max-width: 650px) {
        .mobile-yes {
            display: unset
        }

        .mobile-no {
            display: none
        }
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
        <ButtonFooter on:click={() => show_page(sidepanel === 'routelist' ? '' : 'routelist')}>
          <span class="mobile-yes"><SVGListTask /></span>
          <span class="mobile-no">{$_('routelist.title')}</span>
          </ButtonFooter>
    </div>
</div>
