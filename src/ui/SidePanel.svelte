<script>
    import { _ } from 'svelte-i18n';
    import { show_page } from '../app_state.js';

    import PanelButton from './PanelButton.svelte';
    import SVGBack from '../svg/Back.svelte';
    import SVGClose from '../svg/Close.svelte';

    export let osm_type;
    export let osm_id;
    export let title = '';
    export let fail_message = '';

    function back() {}
</script>

<style>
  .sidepanel {
    position: absolute;
    top: 5px;
    height: 100%;
    right: 0;
    border-style: solid;
    border-width: 1px;
    width: 24em;
    max-width: 48%;
    background-color: white;
    box-shadow: -5px 0 5px rgba(0,0,0,0.15);
    z-index: 2;
    display: flex;
    flex-direction: column;
  }


  h3 {
    display: flex;
    background-color: #ccc;
    justify-content: space-between;
    margin: 0;
    padding: 3px;
  }

  h3 span {
    margin: auto;
    font-size: 20px;
    font-weight: bold
  }

  .sidepanel-content {
    overflow: auto;
    width: 100%;
    flex-grow: 1;
    padding: 5px 0;
  }

  .sidepanel-page {
    overflow: hidden;
    font-size: small;
  }

  .sidepanel-footer {
    margin-top: 2px;
  }
</style>


<div class="sidepanel">
    <h3>
        <PanelButton on:click={back}><SVGBack /></PanelButton>
        <span>
        {#if fail_message}
            {$_('error.panel_title')}
        {:else if osm_type}
            <a target="_new" href="https://openstreetmap.org/{osm_type === 'wayset' ? 'way' : osm_type}/{osm_id}">{title}</a>
        {:else}
            {title}
        {/if}
        </span>
        <PanelButton on:click={() => show_page()}><SVGClose /></PanelButton>
    </h3>
    <div class="sidepanel-content">
        {#if fail_message}
            {fail_message}
        {:else}
            <div class="sidepanel-page"><slot></slot></div>
        {/if}
    </div>
    <div class="sidepanel-footer"><slot name="footer"></slot></div>
</div>
