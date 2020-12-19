<script>
  import { basemap_id, map_opacity_base, map_opacity_route, map_opacity_shade } from './app_state.js';
  import WMTConfig from 'theme';
  import SidePanel from './ui/SidePanel.svelte';
  import OpacitySlider from './ui/OpacitySlider.svelte';
  import DropdownList from './ui/DropdownList.svelte';
</script>

<SidePanel title="Settings">
    <h4>Base map</h4>

    <DropdownList title={WMTConfig.BASEMAPS[$basemap_id].name}>
        {#each WMTConfig.BASEMAPS as cfg, idx}
            <button class="dropdown-item" type="button" on:click="{() => basemap_id.set(idx)}">{cfg.name}</button>
        {/each}
    </DropdownList>

    <h4>Map transparency</h4>

    <div class="container">
      <OpacitySlider name="base" title="Base map" bind:value={$map_opacity_base} />
      <OpacitySlider name="route" title="Route layer" bind:value={$map_opacity_route} />
      <OpacitySlider name="shade" title="Hill shading" bind:value={$map_opacity_shade} />
    </div>

    <h4>Language</h4>

    <DropdownList title="TODO">
    </DropdownList>
</SidePanel>
