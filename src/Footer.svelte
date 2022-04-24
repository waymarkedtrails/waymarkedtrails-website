<script>
    import { _ } from 'svelte-i18n';
    import { TITLE, MEDIA_URL, BASE_URL } from './config.js';
    import { enable_geolocation } from './map/LayerGeolocate.svelte';
    import { show_page } from './app_state.js';

    import SearchForm from './ui/SearchForm.svelte';
    import ButtonFooter from './ui/ButtonFooter.svelte';
    import InterLinkMapList from './ui/InterLinkMapList.svelte';
    import SvgGeoPin from './svg/GeoPin.svelte';
    import SvgGear from './svg/Gear.svelte';
    import SvgQuestion from './svg/Question.svelte';
    import SVGListTask from './svg/ListTask.svelte';
    import SVGSearch from './svg/Search.svelte';

    export let sidepanel = '';
    let headline_div;
    let show_maplink_menu = false;
    let map_link_tail = '';

    

    const themes = ['hiking', 'cycling', 'mtb', 'skating', 'riding', 'slopes'];

    function handleClick(ev) {
        if (headline_div.clientWidth <= 650) {
            show_maplink_menu = !show_maplink_menu;
        }
    }
</script>

<style>
    .toolbar {
        display: flex;
        position:absolute;
        top:0px;
        left:0%;
        right: 0px;
        justify-content: space-between;
        margin: 0;
        padding: 4px;
        z-index: 1000;
    }

    .toolbar div {
        display: flex;
    }

    .toolbar .mobile-yes {
        display: none
    }
    .trail-chooser{
        height:38.5px;
        background-color: rgb(255, 255, 255);
        padding:5px;
        
        padding-bottom:0px;
    }
    .website-name{
        padding-top:5px;
        padding-right:10px;
        font-size: large;
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
    <div>
    <div class="mobile-no"><SearchForm /></div>
    <div class="mobile-yes"><ButtonFooter title={$_('search.title')} on:click={() => show_page(sidepanel === 'search' ? '' : 'search')}><SVGSearch /></ButtonFooter></div>
    
            
        <ButtonFooter on:click={() => show_page(sidepanel === 'routelist' ? '' : 'routelist')}>
          <span class="mobile-yes"><SVGListTask /></span>
          <span class="mobile-no">{$_('routelist.title')}</span>
          </ButtonFooter>
          <ButtonFooter title={$_('settings.title')} on:click={() => show_page('settings')}><SvgGear /></ButtonFooter>

    </div>
    <div class="trail-chooser">
        <div class="website-name">
            {            $_('site_title.' + TITLE)        }
        </div>
        <div class="map_maplinks">
            {#each themes as theme}
              <a class="maplink" href="https://{theme}.{BASE_URL}{map_link_tail}"><img src="{MEDIA_URL}img/map_{theme}.png" alt="{$_('site_title.' + theme)}" title="{$_('site_title.' + theme)}" /></a>
            {/each}
          </div>
    </div>
    <div>
        <ButtonFooter title={$_('locate_me')} on:click={enable_geolocation}><SvgGeoPin /></ButtonFooter>
        <ButtonFooter title={$_('help')} on:click={() => show_page(sidepanel.startsWith('help')?'':'help-about')}><SvgQuestion /></ButtonFooter>
    </div>

    
</div>
