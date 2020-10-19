<script>
    import jQuery from 'jquery';
    import WMTConfig from 'theme';
    import { onMount } from 'svelte';

    let db_update = '';

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

Last Update: {db_update}
