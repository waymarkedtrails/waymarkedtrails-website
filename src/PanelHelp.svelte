<script>
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { locale } from 'svelte-i18n';
    import { aliases } from './i18n.js';
    import help_languages from './i18n/help.js';
    import { HELP } from './config.js';
    import { page_state, show_page }  from './app_state.js';

    let content = $state();

    function contentFunc(locale) {
        if (help_languages.hasOwnProperty(locale)) {
            return help_languages[locale];
        }

        if (aliases.hasOwnProperty(locale) && help_languages.hasOwnProperty(aliases[locale])) {
            return help_languages[aliases[locale]];
        }

        const parts = locale.split('-');
        if (parts.length > 1) {
            return contentFunc(parts[0]);
        }

        return help_languages['en'];
    }

    onMount(async () => {
        const qot = await help_languages['en']();
        const current = contentFunc(get(locale));
        content = await current();
        let temp = {};

        for (let key in content) {
            temp[key] = {...qot[key], ...content[key]};
        }
        content = {...qot, ...temp};

        const handle_any_click = (event) => {
          if (!event.target.closest('.helppanel')) {
            show_page('');
          }
        };

        const handle_esc = (event) => {
          if (event.key === 'Escape') {
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
    .background {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        bottom: 48px;
        min-height: 34px;
        display: flex;
        justify-content: center;
        background-color: rgba(0,0,0,0.3);
    }

    .helppanel {
        top: 0px;
        bottom: 9px;
        border: 2px solid var(--theme-button-background);
        max-width: 80%;
        background-color: var(--theme-background-color);
        box-shadow: 8px 8px rgba(0,0,0,0.25);
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
        max-width: 35%;
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

    .content :global(pre) {
        background-color: white;
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

<div class="background">
<div class="helppanel">
{#if content}
    <nav class="nav flex-column">
        {#each HELP as part}
            <a class="nav-link level-{part.l}" href="#help-{part.section}">{@html content[part.section].title}</a>
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
</div>
