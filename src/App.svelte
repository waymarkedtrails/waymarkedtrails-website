<script>
    import Map from './Map.svelte';
    import Headline from './Headline.svelte';
</script>

<style>
  :global(body) {
    margin : 0;
    padding : 0;
    background-color: #fff;
    font-family: Helvetica,Arial,sans-serif
}

  :global(:root) {
      --theme-background-color: #81AA4B;
      --theme-sub-color: #526d30;
  }
</style>

<svelte:head>
  <title>DEV: Waymarked Trails - Hiking</title>
</svelte:head>

<Headline/>
<Map/>
