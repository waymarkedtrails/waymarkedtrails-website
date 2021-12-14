<script>
    import { _, date, time } from 'svelte-i18n';
    import { onMount, onDestroy } from 'svelte';
    import { json_loader } from './util/load_json.js';

    let db_update = '';
    let error_msg = '';

    const loader = json_loader(function(data) {
        if (data.server_status == 'OK') {
            db_update = new Date(Date.parse(data.last_update));
        } else {
            error_msg = "API unavailable";
        }
    }, function(error) { error_msg = error; });

    onMount(function() { loader.load('/status'); });
    onDestroy(function() { loader.abort(); });
</script>

{$_('headline.last_update')}: {#if error_msg}{error_msg}{:else}{$date(db_update)} {$time(db_update)}{/if}
