<script>
    import { _ } from 'svelte-i18n';
    import { page_state } from '../page_state.svelte.js';

    import SVGBack from '../svg/Back.svelte';
    import SVGClose from '../svg/Close.svelte';
    import SVGArrowBottom from '../svg/ArrowBarBottom.svelte';
    import SVGArrowTop from '../svg/ArrowBarTop.svelte';

    let { title, content, footer } = $props();

    let hidden = $state(false);

    function toggle_hidden() { hidden = !hidden; }
</script>

<style>
    .sidepanel {
        position: absolute;
        top: 5px;
        height: 100%;
        right: 0;
        border: 1px solid var(--theme-sub-color);
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
        padding: 0;
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
        .sidepanel .smallonly {
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

    button {
        background-color: #ccc;
        color: black;
        font-size: 21px;
        padding: 10px 6px 5px 7px;
        border-left: 1px solid white;
        border-right: 1px solid #bbb;
        border-top: none;
        border-bottom: none;
    }

</style>


<div class="sidepanel" class:small={hidden}>
    <h3>
        <button title={$_('routelist.rollup')} class="smallonly" onclick={toggle_hidden}>
            {#if hidden}<SVGArrowBottom />{:else}<SVGArrowTop />{/if}
        </button>
        <span>{@render title?.()}</span>
        <button title={$_('routelist.close')} onclick={() => page_state.show_page()}><SVGClose /></button>
    </h3>
    <div class="sidepanel-content">
        <div class="sidepanel-page">{@render content?.()}</div>
    </div>
    <div class="sidepanel-footer">{@render footer?.()}</div>
</div>
