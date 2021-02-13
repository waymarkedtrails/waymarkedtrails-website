<script>
    import { TITLE, MEDIA_URL } from './config.js';
    import { _ } from 'svelte-i18n';

    const themes = ['hiking', 'cycling', 'mtb', 'skating', 'riding', 'slopes'];
</script>

<style>
  #headline {
     position: absolute;
     display: flex;
     top: 0;
     height: var(--headline-total-height);
     width: 100%;
     background-color: var(--theme-background-color);
     background-image: var(--theme-banner-image);
     background-height: var(--headline-total-height);
     background-width: var(--headline-total-height);
     background-repeat: no-repeat;
     background-position: right top;
  }

  h1 {
     font-size: 30px;
     font-weight: 700;
     margin: 5px;
     color: var(--theme-font-color);
  }

  .map_maplinks {
    padding-right: 4px;
    padding-top: 12px;
  }

  .right-align {
    margin-left: auto;
  }

  #subheadline {
    position: absolute;
    display: flex;
    top: calc(var(--headline-total-height) - 1.4em);
    height: 1.4em;
    font-size: 0.8em;
    padding: 0;
    background-color: var(--theme-sub-color);
    width: 100%;
    color: var(--theme-sub-font-color);
    font-weight: 700;
  }

</style>

<div id="headline"><h1>Waymarked Trails: {$_('site_title.' + TITLE)}</h1>
  <div class="map_maplinks right-align">
    {#each themes as theme }
      <a class="maplink" href="https://{theme}.waymarkedtrails.org"><img src="{MEDIA_URL}img/map_{theme}.png" alt="{$_('site_title.' + theme)}" title="{$_('site_title.' + theme)}" /></a>
    {/each}
  </div>
</div>
<div id="subheadline">
{#if false}<slot></slot>{/if}
<span><slot name="subleft"></slot></span>
<span class="right-align"><slot name="subright"></slot></span>
</div>

