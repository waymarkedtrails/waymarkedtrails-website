<script>
    import { _ } from 'svelte-i18n';

    import { page_state } from './page_state.svelte.js';

    import SearchForm from './ui/SearchForm.svelte';
    import ButtonFooter from './ui/ButtonFooter.svelte';
    import ButtonGeolocate from './ButtonGeolocate.svelte';

    import SvgGeoPin from './svg/GeoPin.svelte';
    import SvgGear from './svg/Gear.svelte';
    import SvgQuestion from './svg/Question.svelte';
    import SVGListTask from './svg/ListTask.svelte';
    import SVGSearch from './svg/Search.svelte';
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
    <div class="mobile-yes"><ButtonFooter title={$_('search.title')} onclick={() => page_state.toggle_page('search')}><SVGSearch /></ButtonFooter></div>
    <div>
        <ButtonFooter title={$_('settings.title')} onclick={() => page_state.toggle_page('settings')}><SvgGear /></ButtonFooter>
        <ButtonGeolocate />
        <ButtonFooter title={$_('help')} onclick={() => page_state.show_page(page_state.page?.startsWith('help')?'':'help-about')}><SvgQuestion /></ButtonFooter>
    </div>
    <div>
        <ButtonFooter onclick={() => page_state.toggle_page('routelist')}>
          <span class="mobile-yes"><SVGListTask /></span>
          <span class="mobile-no">{$_('routelist.title')}</span>
          </ButtonFooter>
    </div>
</div>
