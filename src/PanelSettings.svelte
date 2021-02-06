<script>
    import { onMount } from 'svelte';
    import { _ } from 'svelte-i18n';
    import { languages, set_stored_locale, get_stored_locale } from './i18n.js';
    import { basemap_id, map_opacity_base, map_opacity_route, map_opacity_shade } from './app_state.js';
    import WMTConfig from '../theme.js';
    import SidePanel from './ui/SidePanel.svelte';
    import OpacitySlider from './ui/OpacitySlider.svelte';
    import DropdownList from './ui/DropdownList.svelte';

    let current_language = null;
    let current_lang_title = null;

    function set_language(ev) {
        set_stored_locale(ev.target.getAttribute('data-lang'));
        current_lang_title = ev.target.getAttribute('data-title');
    }

    onMount(() => {
        current_language = get_stored_locale();

        if (current_language !== null) {
            languages.forEach((item, idx) => {
                if (item[0] == current_language) {
                    current_lang_title = item[1];
                }
            });
        }
    });
</script>

<SidePanel title={$_('settings.title')}>
    <h4>{$_('settings.language')}</h4>

    <DropdownList title={current_lang_title || $_('Use browser setting')}>
        <button class="dropdown-item" type="button" on:click={set_language}>{$_('Use browser setting')}</button>
        {#each languages as lang}
            <button class="dropdown-item" type="button" data-lang={lang[0]} data-title={lang[1]} on:click={set_language}>{lang[1]}</button>
        {/each}
    </DropdownList>

    <h4>{$_('settings.base_map')}</h4>

    <DropdownList title={WMTConfig.BASEMAPS[$basemap_id].name}>
        {#each WMTConfig.BASEMAPS as cfg, idx}
            <button class="dropdown-item" type="button" on:click="{() => basemap_id.set(idx)}">{cfg.name}</button>
        {/each}
    </DropdownList>

    <h4>{$_('settings.transparency')}</h4>

    <div class="container">
      <OpacitySlider name="base" title={$_('settings.base_map')} bind:value={$map_opacity_base} />
      <OpacitySlider name="route" title={$_('settings.route_layer')} bind:value={$map_opacity_route} />
      <OpacitySlider name="shade" title={$_('settings.hillshading_layer')} bind:value={$map_opacity_shade} />
    </div>
</SidePanel>
