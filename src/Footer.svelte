<script>
    import { _ } from 'svelte-i18n';

    import { enable_geolocation } from './map/LayerGeolocate.svelte';
    import { show_page } from './app_state.js';

    import SearchForm from './ui/SearchForm.svelte';
    import ButtonFooter from './ui/ButtonFooter.svelte';

    import SvgGeoPin from './svg/GeoPin.svelte';
    import SvgGear from './svg/Gear.svelte';
    import SvgQuestion from './svg/Question.svelte';
    import SVGListTask from './svg/ListTask.svelte';
    import SVGSearch from './svg/Search.svelte';

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

    .toolbar .mobile-yes {
        display: none
    }

    @media (max-width: 650px) {
        .toolbar .mobile-yes {
            display: unset
        }

        .toolbar .mobile-no {
            display: none
        }
    }
</style>

<div class="toolbar" >
    <div class="mobile-no"><SearchForm /></div>
    <div class="mobile-yes"><ButtonFooter title={$_('search.title')} on:click={() => show_page(sidepanel === 'search' ? '' : 'search')}><SVGSearch /></ButtonFooter></div>
    <div>
        <ButtonFooter title={$_('settings.title')} on:click={() => show_page('settings')}><SvgGear /></ButtonFooter>
        <ButtonFooter title={$_('locate_me')} on:click={enable_geolocation}><SvgGeoPin /></ButtonFooter>
        <ButtonFooter title={$_('help')} on:click={() => show_page(sidepanel.startsWith('help')?'':'help-about')}><SvgQuestion /></ButtonFooter>
    </div>
    <div>
        <ButtonFooter on:click={() => show_page(sidepanel === 'routelist' ? '' : 'routelist')}>
          <span class="mobile-yes"><SVGListTask /></span>
          <span class="mobile-no">{$_('routelist.title')}</span>
          </ButtonFooter>
    </div>
</div>
