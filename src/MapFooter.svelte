<script>
    import 'bootstrap/dist/css/bootstrap.css';
    import { show_page } from './app_state.js';
    import { enable_geolocation } from './map/LayerGeolocate.svelte';
    import SearchForm from './ui/SearchForm.svelte';
    import ButtonFooter from './ui/ButtonFooter.svelte';
    import GeoPin from './svg/GeoPin.svelte';
    import Gear from './svg/Gear.svelte';
</script>

<style>
  .btn-toolbar {
    position: absolute;
    bottom: 0;
    width: 100%;
    margin: 0;
    padding: 4px;
    background-color: var(--theme-background-color);
  }
</style>

<div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
    <SearchForm />
    <div class="btn-group" role="group">
        <ButtonFooter on:click={() => show_page('settings')}><Gear /></ButtonFooter>
        <ButtonFooter on:click={enable_geolocation}><GeoPin /></ButtonFooter>
        <ButtonFooter>Right</ButtonFooter>
    </div>
    <div class="btn-group" role="group">
        <ButtonFooter on:click={() => show_page('routelist')}>Routes</ButtonFooter>
    </div>
</div>
