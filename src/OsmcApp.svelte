<script>
    import '../css/global.css';

    import { get } from 'svelte/store';
    import { isLoading, _, locale } from 'svelte-i18n';
    import { API_URL, MEDIA_URL } from './config.js';
    import { aliases } from './i18n.js';
    import help_languages from './i18n/help.js';
    import Headline from './Headline.svelte';

    let content;
    let test_symbol;

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
    const backgrounds = ['circle', 'frame', 'round'];

    $: {
        if (!$isLoading) {
            document.title = 'Waymarked Trails - ' + $_('site_title.osmc_symbol');
        }
    }

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
        width: 95%;
        max-width: 800pt;
    }

    td {
        text-align: center;
    }

    a {
        color: var(--theme-sub-link-color);
    }

    .preview {
        display: flex;
        flex-flow: column;
        align-items: center;
        background: rgba(1,1,1,0.1);
        border: 1pt solid #999;
        padding: 20px;
        margin-top: 10px;
        margin-bottom: 100px;
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
<Headline><span slot="subleft"><a href="#" onclick="window.history.back()">{$_('osmc_symbol.back')}</a></span></Headline>

<div class="main">

{#if content}<p>{@html content['osmc'].text}</p>{/if}


<h2>{$_('osmc_symbol.foreground_heading')}</h2>
<p>{$_('osmc_symbol.foreground')}</p>

<table>
{#each colors as color}<th>{color}_*</th>{/each}<th><i>none</i></th><th></th>
{#each foregrounds as fg}
<tr>
  {#each colors as color}
  <td><img alt="{color}_{fg}" src="{API_URL}/symbols/from_tags/NAT?osmc:symbol=:{bgColor(color)}:{color}_{fg}" /></td>
  {/each}
  <td><img alt="{fg}" src="{API_URL}/symbols/from_tags/NAT?osmc:symbol=:white:{fg}" /></td>
  <td>*{fg}</td>
</tr>
{/each}
</table>

<h2>{$_('osmc_symbol.background_heading')}</h2>
<p>{$_('osmc_symbol.background')}</p>

<table>
{#each colors as color}<th>{color}_*</th>{/each}<th></th>
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
  <td>*{bg}</td>
</tr>
{/each}
</table>

<h2>{$_('osmc_symbol.preview_heading')}</h2>
<p>{$_('osmc_symbol.preview')}</p>


<div class="preview">
<tt>osmc:symbol = </tt><input type="text" width=150 bind:value={test_symbol} />
{#if test_symbol}
    <img src="{API_URL}/symbols/from_tags/NAT?osmc:symbol={encodeURIComponent(test_symbol)}" width="50" height="50" />
{:else}
    <img src="{MEDIA_URL}img/white.svg" width="50" height="50" />
{/if}
</div>

</div>

<div class="footer"></div>
</div>
{/if}
