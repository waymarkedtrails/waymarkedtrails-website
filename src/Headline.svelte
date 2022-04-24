<script>
    import { TITLE, MEDIA_URL, BASE_URL } from './config.js';
    import { _ } from 'svelte-i18n';
    import InterLinkMapList from './ui/InterLinkMapList.svelte';
    import { map_view } from './app_state.js';

    let headline_div;
    let show_maplink_menu = false;
    let map_link_tail = '';

    map_view.subscribe(function (value) {
        if (value === false) {
            map_link_tail = '';
        } else {
            map_link_tail = "#?map=" + value.zoom.toFixed(1)
                            + '/' + value.center[1]
                            + '/' + value.center[0];
        }
    });

    const themes = ['hiking', 'cycling', 'mtb', 'skating', 'riding', 'slopes'];

    function handleClick(ev) {
        if (headline_div.clientWidth <= 650) {
            show_maplink_menu = !show_maplink_menu;
        }
    }
</script>

<style>
    .headline {
        width: 100%;
        background-color: var(--theme-background-color);
        background-image: var(--theme-banner-image);
        background-height: var(--headline-total-height);
        background-width: var(--headline-total-height);
        background-repeat: no-repeat;
        background-position: right top;
        /*display:none;*/
    }

    .main {
        display: block;
    }

    h1 {
        font-size: 30px;
        font-weight: 700;
        margin: 5px;
        color: var(--theme-font-color);
    }

    .map_maplinks {
        display:none;
        position: absolute;
        margin-left: 0px;
        width:100%;
        padding-right: 4px;
        padding-top: 12px;
        z-index:100;
    }

    .subheadline {
        height:14px;
        padding: 5px;
        position:fixed;
        bottom: -1px;
        z-index: 100;
        display: flex;
        font-size: 14px;
        background-color: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(4px);
        width: 100%;
        color: black;
        
    }


    .subright {
        margin-left: auto;
    }

    @media (max-width: 650px) {
        .map_maplinks {
            display: none;
        }

        .main {
            cursor: pointer;
        }

        h1 {
            font-size: 24px;
        }

        .subheadline {
            font-size: 12px;
        }
    }
</style>

<div bind:this={headline_div} on:click={handleClick} class="headline">
  <div class="main">
    <div class="map_maplinks">
      {#each themes as theme}
        <a class="maplink" href="https://{theme}.{BASE_URL}{map_link_tail}"><img src="{MEDIA_URL}img/map_{theme}.png" alt="{$_('site_title.' + theme)}" title="{$_('site_title.' + theme)}" /></a>
      {/each}
    </div>
  </div>
{#if show_maplink_menu}<InterLinkMapList {themes} />{/if}
<div class="subheadline">
{#if false}<slot></slot>{/if}
<span><slot name="subleft"></slot></span>
<span class="subright"><slot name="subright"></slot></span>
</div>
</div>
