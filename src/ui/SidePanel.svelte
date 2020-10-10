<script>
    import PanelButton from './PanelButton.svelte';
    import { show_page } from '../app_state.js';

    export let title = '';
    export let fail_message = '';

    function back() {}
</script>

<style>
  .sidepanel {
    position: absolute;
    top: calc(var(--headline-total-height) + 5px);
    bottom: 50px;
    right: 0;
    min-height: 34px;
    border-style: solid;
    border-width: 1px;
    width: 24em;
    max-width: 40%;
    background-color: white;
    box-shadow: -5px 0 5px rgba(0,0,0,0.15)
  }


  h3 {
    display: flex;
    width: 100%;
    background-color: #ccc;
    justify-content: space-between;
  }

  h3 span {
    margin: auto;
    font-size: 20px;
    font-weight: bold
  }

  .sidepanel-content {
    overflow: auto;
    position: absolute;
    top: 36px;
    bottom: 0;
    width: 100%
  }

  .sidepanel-page {
    padding: 0 5px;
    overflow: hidden;
    font-size: small;
  }

  .sidepanel-page :global(h4) {
    background-color: var(--theme-background-color);
    font-size: small;
    font-weight: bold;
    padding: 2px;
    margin: 10px -5px;
  }

</style>


<div class="sidepanel">
    <h3>
        <PanelButton on:click={back}>
            <svg width="25px" height="25px" viewBox="0 0 16 16" class="bi bi-arrow-counterclockwise" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
            </svg>
        </PanelButton>
        <span>{title}</span>
        <PanelButton on:click={() => show_page()}>
            <svg width="25px" height="25px" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
        </PanelButton>
    </h3>
    <div class="sidepanel-content">
        {#if fail_message}
            {fail_message}
        {:else}
            <div class="sidepanel-page"><slot></slot></div>
        {/if}
    </div>
</div>
