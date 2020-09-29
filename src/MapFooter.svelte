<script>
  import 'bootstrap/dist/css/bootstrap.css';
  import ButtonSettings from './ButtonSettings.svelte';
  import ButtonGeolocate from './ButtonGeolocate.svelte';
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
<div class="input-group">
    <div class="input-group-prepend">
      <div class="input-group-text" id="btnGroupAddon2">@</div>
    </div>
    <input type="text" class="form-control" placeholder="Search" aria-label="Input group example" aria-describedby="btnGroupAddon2">
</div>
<div class="btn-group" role="group" aria-label="Basic example">
  <ButtonSettings />
  <ButtonGeolocate />
  <button type="button" class="btn btn-secondary">Right</button>
</div>
<div class="btn-group" role="group" aria-label="Basic example">
  <button type="button" class="btn btn-secondary">Routes</button>
</div>
</div>
