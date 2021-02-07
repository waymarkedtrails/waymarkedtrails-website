<script>
    import { onMount } from 'svelte';
    import { HELP } from './config.js';
    import { page_state }  from './app_state.js';

    let content;

    onMount(async () => {
        content = await import('./i18n/help.en.yaml');
    });
</script>

<style>
    .helppanel {
        position: absolute;
        top: 30px;
        bottom: 50px;
        right: 10%;
        min-height: 34px;
        border-style: solid;
        border-width: 1px;
        border-color: lightgray;
        width: 80%;
        background-color: #f3f3f3;
        box-shadow: -5px 0 5px rgba(0,0,0,0.15);
        overflow: auto;
        display: flex;
    }

    .content-frame {
        overflow: auto;
        width: auto;
    }

    .content {
        max-width: 800pt;
        overflow: hidden;
        padding: 8px 18px;
        background-color: white
    }

    h1.level-0 { font-size: 2.5rem; }
    h1.level-1 { font-size: 2.1rem; }
    .content :global(h2) { font-size: 1.7rem; }
    .content :global(h3) { font-size: 1.4rem; }

    nav a { padding: 2px 11px; }
    nav a.level-1 {
        font-size: smaller;
        padding-left: 20px;
    }
</style>

<div class="helppanel">
{#if content}
    <nav class="nav flex-column">
        {#each HELP as part}
            <a class="nav-link level-{part.l}" href="#help-{part.section}">{content[part.section].title}</a>
        {/each}
    </nav>
    <div class="content-frame"><div class="content">
        {#each HELP as part}
        <h1 class="level-{part.l}" id="help-{part.section}">{content[part.section].title}</h1>
        {#each part.paragraphs as para}<p>{@html content[part.section][para]}</p>{/each}
        {/each}
    </div></div>
{/if}
</div>
