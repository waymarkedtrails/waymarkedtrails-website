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
    .dropdown {
        display: flex;
        flex-direction: column;
        padding: 0 4px;
    }

    button {
        font-size: 18px;
        padding: 8px 12px;
        background-color: #f2f2f2;
        boder-color: #ddd;
    }

    .dropdown-menu {
        display: flex;
        flex-direction: column;
        border: 1px solid black;
        margin-top: -2px;
    }

    .dropdown-menu :global(button) {
        background-color: white;
        border: none;
        padding: 8px 12px;
    }

    .dropdown-menu :global(button:hover) {
        background-color: #ddd;
    }
</style>

<div class="dropdown">
  <button on:click={() => (expanded = !expanded)} type="button" id="BaseMapButton" bind:this={menu_button}>
 {title}
  </button>
  {#if expanded}
  <div class="dropdown-menu" aria-labelledby="BaseMapButton">
    <slot></slot>
  </div>
  {/if}
</div>

