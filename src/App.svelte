<script>
    import '../css/global.css';

    import { onMount } from 'svelte';
    import jQuery from 'jquery';
    import WMTConfig from 'theme';
    import Map from './Map.svelte';
    import Headline from './Headline.svelte';

    let db_update = '';
    let copyright;

    onMount(() => {
        jQuery.getJSON(WMTConfig.API_URL + '/status', function (data) {
            if (data.server_status == 'OK') {
                const update = new Date(Date.parse(data.last_update));
                db_update = update.toLocaleString(navigator.languages);
            } else {
                db_update = "API unavailable";
            }
        });
    });
</script>

<svelte:head>
  <title>DEV: Waymarked Trails - Hiking</title>
</svelte:head>

<Headline>
  <span slot="subleft">Last Update: {db_update}</span>
  <span slot="subright">{copyright}</span>
</Headline>
<Map bind:copyright={copyright} />
