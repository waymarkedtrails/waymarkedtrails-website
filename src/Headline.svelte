<script>
  const themes = [['hiking', 'Hiking'],
                  ['cycling', 'Cycling'],
                  ['mtb', 'MTB'],
                  ['skating', 'Inline Skating'],
                  ['riding', 'Horse Riding'],
                  ['slopes', 'Winter Sport Slopes']
                 ]
</script>

<style>
  :global(:root) {
     --headline-total-height: 70px;
  }

  #headline {
     position: absolute;
     display: flex;
     top: 0;
     height: var(--headline-total-height);
     width: 100%;
     background-color: var(--theme-background-color);
     background-image: url('/img/banner_hiking.jpg');
     background-height: var(--headline-total-height);
     background-width: var(--headline-total-height);
     background-repeat: no-repeat;
     background-position: right top;
  }

  h1 {
     font-size: 30px;
     font-weight: 700;
     margin: 5px;
     color: #101010;
  }

  #map_maplinks {
    margin-left: auto;
    padding-right: 4px;
    padding-top: 12px;
  }

  #subheadline {
    position: absolute;
    display: flex;
    top: calc(var(--headline-total-height) - 1em);
    font-size: 0.8em;
    padding: 0;
    background-color: var(--theme-sub-color);
    width: 100%;
  }

</style>

<div id="headline"><h1>Waymarked Trails: Hiking</h1>
  <div id="map_maplinks">
    {#each themes as theme }
      <a class="maplink" href="https://{theme[0]}.waymarkedtrails.org"><img src="/img/map_{theme[0]}.png" alt="{theme[1]}" title="{theme[1]}" /></a>
    {/each}
  </div>
</div>
<div id="subheadline">Foo</div>

