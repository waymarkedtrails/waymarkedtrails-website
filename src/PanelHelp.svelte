<script>
    import { onMount } from 'svelte';
    import { HELP } from './config.js';
    import { page_state, show_page }  from './app_state.js';

    let content;
    let helpbox;

    onMount(async () => {
        content = await import('./i18n/help.en.yaml')

        const handle_any_click = (event) => {
          if (helpbox && !helpbox.contains(event.target)) {
            show_page('');
          }
        };

        const handle_esc = (event) => {
          if (helpbox && event.key === 'Escape') {
            show_page('');
          }
        };

        document.addEventListener('click', handle_any_click, false);
        document.addEventListener('keyup', handle_esc, false);

        return () => {
            document.removeEventListener('click', handle_any_click, false);
            document.removeEventListener('keyup', handle_esc, false);
    };

    });
</script>

<style>
    .helppanel {
        position: absolute;
        top: 30px;
        bottom: 50px;
        right: 10%;
        min-height: 34px;
        border: 2px solid #b4b4b4;
        width: 80%;
        background-color: #f3f3f3;
        box-shadow: -5px 0 5px rgba(0,0,0,0.15);
        overflow: auto;
        display: flex;
        padding: 5px 0px 5px 5px;
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

    nav a {
        display: block;
        white-space: nowrap;
        padding: 2px 11px;
    }
    nav a.level-1 {
        font-size: smaller;
        padding-left: 20px;
    }

    h1.level-0 { font-size: 2.0rem; }
    h1.level-1 { font-size: 1.8rem; }
    .content :global(h2) { font-size: 1.6rem; }
    .content :global(h3) { font-size: 1.3rem; }
</style>

<div class="helppanel" bind:this={helpbox}>
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
