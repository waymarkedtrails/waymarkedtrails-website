<script>
  import 'bootstrap/dist/css/bootstrap.css';
  import ButtonSidePanel from './ui/ButtonSidePanel.svelte';
  import SearchForm from './ui/SearchForm.svelte';
  import ButtonGeolocate from './ui/ButtonGeolocate.svelte';
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
    <div class="btn-group" role="group" aria-label="Basic example">
        <ButtonSidePanel page="settings">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-gear-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 0 0-5.86 2.929 2.929 0 0 0 0 5.858z"/>
            </svg>
        </ButtonSidePanel>
        <ButtonGeolocate />
        <button type="button" class="btn btn-secondary">Right</button>
    </div>
    <div class="btn-group" role="group">
        <ButtonSidePanel page="routelist">Routes</ButtonSidePanel>
    </div>
</div>
