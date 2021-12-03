<script>
    import { _ } from 'svelte-i18n';
    import { show_page } from '../app_state.js';

    import PanelButton from './PanelButton.svelte';
    import SVGBack from '../svg/Back.svelte';
    import SVGClose from '../svg/Close.svelte';
    import SVGArrowBottom from '../svg/ArrowBarBottom.svelte';
    import SVGArrowTop from '../svg/ArrowBarTop.svelte';

    export let osm_type;
    export let osm_id;
    export let title = '';
    export let fail_message = '';

    let hidden = false;

    function back() {}

    function toggle_hidden() { hidden = !hidden; }
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
        align-items: center;
        margin: 0;
        padding: 0;
    }

    h3 span {
        padding: 4px;
        flex-grow: 1;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        border-left: 1px solid white;
        border-right: 1px solid #bbb;
    }

    .sidepanel-content {
        overflow: auto;
        width: 100%;
        flex-grow: 1;
        padding: 5px 0;
    }

    .sidepanel.small {
        height: 140px;
    }

    .sidepanel-page {
        overflow: hidden;
        font-size: small;
    }

    .sidepanel-footer {
        margin-top: 2px;
    }

    @media (min-width: 550px) {
        .sidepanel :global(.smallonly) {
            display: none;
        }
    }

    @media (max-width: 550px) {
        .sidepanel {
            width: 100%;
            max-width: 100%;
            height: 80%;
        }
    }

</style>


<div class="sidepanel" class:small={hidden}>
    <h3>
        <PanelButton classes="smallonly" on:click={() => toggle_hidden()}>
            {#if hidden}<SVGArrowBottom />{:else}<SVGArrowTop />{/if}
        </PanelButton>
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
