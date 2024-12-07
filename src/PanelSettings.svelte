<script>
    import { onMount } from 'svelte';
    import { _ } from 'svelte-i18n';
    import { BASEMAPS } from './config.js';
    import languages from './i18n/languages.js';
    import { set_stored_locale, get_stored_locale } from './i18n.js';
    import { basemap_id, map_opacity_base, map_opacity_route, map_opacity_shade } from './app_state.js';
    import SidePanel from './ui/SidePanel.svelte';
    import OpacitySlider from './ui/OpacitySlider.svelte';
    import DropdownList from './ui/DropdownList.svelte';

    let current_lang_title = $state();

    function set_language(ev) {
        set_stored_locale(ev.target.getAttribute('data-lang'));
        current_lang_title = ev.target.getAttribute('data-title');
    }

    onMount(() => {
        const current_language = get_stored_locale();

        if (current_language !== null) {
            languages.forEach((item, idx) => {
                if (item[0] == current_language) {
                    current_lang_title = item[1];
                }
            });
        }
    });
</script>

<style>
    .sliders {
        width: 100%;
    }
</style>

<SidePanel>
{#snippet title()}{$_('settings.title')}{/snippet}
{#snippet content()}
    <h2 class="panel-heading">{$_('settings.language')}</h2>

    <DropdownList title={current_lang_title || $_('settings.browser_language')}>
        <button class="dropdown-item" type="button" onclick={set_language}>{$_('settings.browser_language')}</button>
        {#each languages as lang}
            <button class="dropdown-item" type="button" data-lang={lang[0]} data-title={lang[1]} onclick={set_language}>{lang[1]}</button>
        {/each}
    </DropdownList>

    <h2 class="panel-heading">{$_('settings.base_map')}</h2>

    <DropdownList title={BASEMAPS[$basemap_id].name}>
        {#each BASEMAPS as cfg, idx}
            <button class="dropdown-item" type="button" onclick="{() => basemap_id.set(idx)}">{cfg.name}</button>
        {/each}
    </DropdownList>

    <h2 class="panel-heading">{$_('settings.transparency')}</h2>

    <table class="sliders">
      <OpacitySlider name="base" title={$_('settings.base_map')} bind:value={$map_opacity_base} />
      <OpacitySlider name="route" title={$_('settings.route_layer')} bind:value={$map_opacity_route} />
      <OpacitySlider name="shade" title={$_('settings.hillshading_layer')} bind:value={$map_opacity_shade} />
    </table>
{/snippet}
</SidePanel>
