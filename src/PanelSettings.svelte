<script>
    import { locale, locales, _ } from 'svelte-i18n';
    import { basemap_id, map_opacity_base, map_opacity_route, map_opacity_shade } from './app_state.js';
    import WMTConfig from '../theme.js';
    import SidePanel from './ui/SidePanel.svelte';
    import OpacitySlider from './ui/OpacitySlider.svelte';
    import DropdownList from './ui/DropdownList.svelte';
</script>

<SidePanel title={$_('settings.title')}>
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

    <h4>{$_('settings.language')}</h4>

    <DropdownList title="TODO">
        {#each $locales as loc}
            <button class="dropdown-item" type="button" on:click="{() => locale.set(loc)}">{loc}</button>
        {/each}
    </DropdownList>
</SidePanel>
