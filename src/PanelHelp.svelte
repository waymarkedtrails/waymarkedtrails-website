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
        background-color: var(--theme-background-color);
        box-shadow: 8px 8px rgba(0,0,0,0.15);
        overflow: auto;
        display: flex;
        z-index: 3;
    }

    .content-frame {
        overflow: auto;
        width: auto;
    }

    .content {
        max-width: 800pt;
        overflow: hidden;
        padding: 8px 18px;
        background-color: rgba(254, 254, 254, 0.9);
        font-size: 18px
    }

    nav {
        background-color: rgba(254, 254, 254, 0.7);
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

    h1.level-0 {
        font-size: 1.6em;
        padding-top: 20px;
        border-top: gray 1px solid;
    }
    h1.level-1 { font-size: 1.4em; }
    .content :global(h2) { font-size: 1.25em; }
    .content :global(h3) { font-size: 1.1em; }

    @media (max-width: 900px ) {
        nav {
            display: none
        }

        .content {
            font-size: 15px
        }
    }
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
