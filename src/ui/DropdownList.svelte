<script>
    import { onMount } from 'svelte';

    export let title;

    let expanded = false;
    let menu_button = null;

    onMount(() => {
        const handle_any_click = (event) => {
          if (expanded && !menu_button.contains(event.target)) {
            expanded = false;
          }
        };

        const handle_esc = (event) => {
          if (expanded && event.key === 'Escape') {
            expanded = false;
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
    .dropdown-menu {
        min-width: 100%
    }
</style>

<div class="dropdown">
  <button on:click={() => (expanded = !expanded)} class="btn btn-outline-dark btn-block" type="button" id="BaseMapButton" bind:this={menu_button}>
 {title}
  </button>
  {#if expanded}
  <div class="dropdown-menu show" aria-labelledby="BaseMapButton">
    <slot></slot>
  </div>
  {/if}
</div>

