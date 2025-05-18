<script>
    import '../css/global.css';

    import { get } from 'svelte/store';
    import { isLoading, _, locale } from 'svelte-i18n';
    import { API_URL, MEDIA_URL } from './config.js';
    import { aliases } from './i18n.js';
    import help_languages from './i18n/help.js';
    import Headline from './Headline.svelte';

    let content = $state();
    let test_symbol = $state();

    const colors = ['black', 'blue', 'brown', 'gray', 'green', 'orange',
                    'purple', 'red', 'white', 'yellow'];
    const foregrounds = ['arch', 'arrow', 'backslash', 'bar',
                         'bowl', 'circle', 'corner', 'corner_left', 'crest',
                         'cross', 'diamond_line', 'diamond', 'diamond_left',
                         'diamond_right', 'dot', 'drop', 'drop_line', 'fork',
                         'house', 'L', 'left', 'left_arrow', 'left_pointer',
                         'lower', 'right', 'pointer', 'rectangle_line',
                         'rectangle', 'red_diamond', 'right_arrow',
                         'right_pointer', 'slash', 'stripe',
                         'triangle_line', 'triangle', 'triangle_turned',
                         'turned_T', 'upper', 'upper_bowl', 'x',
                         'hexagon', 'shell', 'shell_modern', 'hiker', 'wheel'];
    const backgrounds = ['circle', 'frame', 'round', 'stripe', 'bar',
                         'diamond', 'diamond_line'];

    $effect(() =>  {
        if (!$isLoading) {
            document.title = 'Waymarked Trails - ' + $_('site_title.osmc_symbol');
        }
    });

    function bgColor(color) {
        if (color == 'white')
            return 'gray';
        return 'white';
    }

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



    locale.subscribe(async lang => {
        if (lang) {
            let loaded = await contentFunc(lang)();
            if ('osmc' in loaded && 'text' in loaded['osmc']) {
                content = loaded;
            } else {
                content = await help_languages['en']();
            }
        }
    });

</script>

<style>
    .screen {
        position: absolute;
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%
    }

    .main {
        position: relative;
        flex-grow: 1;
        background-color: #edece8;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    .main h2, .main p, .main table {
        width: 90%;
        max-width: 600pt;
    }

    td {
        text-align: center;
    }

    button {
        color: var(--theme-sub-link-color);
        background-color: var(--theme-sub-color);
        border: 0pt;
    }

    .preview {
        background: rgba(1,1,1,0.1);
        border: 1pt solid #999;
        margin-top: 10px;
        margin-bottom: 60px;
        width: 80%;
        max-width: 600pt;

    }

    .preview h3 {
        border: 1pt solid rgba(1,0.9,0.9,0.3);
        padding: 3px;
        margin: 0;
        background: rgba(1,1,1,0.1);

    }

    .preview-content {
        display: flex;
        flex-flow: column;
    }

    .preview-content img {
        align-self: center
    }

    input {
        width: 80%
    }

    .intro :global(pre) {
        margin: 10px 25px;
        padding: 3px;
        background: rgba(255,255,255,0.7);
    }

    .preview * {
        margin: 5px;
    }

    .footer {
        height: 50px;
        width: 100%;
        background-color: var(--theme-background-color);
    }
</style>

<svelte:head>
  <link rel="shortcut icon" href="/img/map_hiking.ico" />
</svelte:head>
{#if $isLoading}
    Loading...
{:else}
<div class="screen">
<Headline>
    {#snippet subleft()}
        <button onclick={() => window.history.back()}>{$_('osmc_symbol.back')}</button>
    {/snippet}
</Headline>

<div class="main">

<h2>{$_('osmc_symbol.intro_header')}</h2>

{#if content}
  <p class="intro">{@html content['osmc'].text}
  {@html content['osmc'].reference_footer}</p>
{/if}

<div class="preview">
  <h3>{$_('osmc_symbol.preview_heading')}</h3>
  <div class="preview-content">
  <p>{$_('osmc_symbol.preview')}</p>
  <label><tt>osmc:symbol = </tt><input type="text" width=150 bind:value={test_symbol} /></label>
  {#if test_symbol}
    <img src="{API_URL}/symbols/from_tags/NAT?osmc:symbol={encodeURIComponent(test_symbol)}" alt="result shield" width="80" height="80" />
  {:else}
    <img src="{MEDIA_URL}img/white.svg" alt="no symbol yet" width="80" height="80" />
  {/if}
  </div>
</div>


<h2>{$_('osmc_symbol.symbol_reference_heading')}</h2>

<h3>{$_('osmc_symbol.foreground_heading')}</h3>
<p>{$_('osmc_symbol.foreground')}</p>

<table>
<thead><tr>
  {#each colors as color}<th>{color}_*</th>{/each}<th><i>none</i></th><th></th>
</tr></thead>
<tbody>
{#each foregrounds as fg}
<tr>
  {#each colors as color}
  <td><img alt="{color}_{fg}" src="{API_URL}/symbols/from_tags/NAT?osmc:symbol=:{bgColor(color)}:{color}_{fg}" /></td>
  {/each}
  <td><img alt="{fg}" src="{API_URL}/symbols/from_tags/NAT?osmc:symbol=:white:{fg}" /></td>
  <td>*{fg}</td>
</tr>
{/each}
</tbody>
</table>

<h3>{$_('osmc_symbol.background_heading')}</h3>
<p>{$_('osmc_symbol.background')}</p>

<table>
<thead><tr>
  {#each colors as color}<th>{color}*</th>{/each}<th></th>
</tr></thead>
<tbody>
<tr>
  {#each colors as color}
  <td><img alt="{color}" src="{API_URL}/symbols/from_tags/NAT?osmc:symbol=:{color}" /></td>
  {/each}
  <td><i>none</i></td>
</tr>

{#each backgrounds as bg}
<tr>
  {#each colors as color}
  <td><img alt="{color}_{bg}" src="{API_URL}/symbols/from_tags/NAT?osmc:symbol=:{color}_{bg}" /></td>
  {/each}
  <td>*_{bg}</td>
</tr>
{/each}
</tbody>
</table>

</div>

<div class="footer"></div>
</div>
{/if}
