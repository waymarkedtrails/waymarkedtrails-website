<script>
    import { onMount } from 'svelte';
    import WMTConfig from '../theme.js';

    let content;

    onMount(async () => {
        content = await import('./i18n/help.en.yaml');
    });
</script>

<style>
  .helppanel {
    position: absolute;
    top: calc(var(--headline-total-height) + 5px);
    bottom: 50px;
    right: 10%;
    min-height: 34px;
    border-style: solid;
    border-width: 1px;
    width: 80%;
    background-color: white;
    box-shadow: -5px 0 5px rgba(0,0,0,0.15)
  }
</style>

<div class="helppanel">
{#if content}
 {#each WMTConfig.HELP as part}
    <h1>{content[part.section].title}</h1>
    {#each part.paragraphs as para}<p>{@html content[part.section][para]}</p>{/each}
 {/each}
{/if}
</div>
