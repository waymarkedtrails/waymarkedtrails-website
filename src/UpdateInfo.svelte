<script>
    import { _ } from 'svelte-i18n';
    import { onMount, onDestroy } from 'svelte';
    import { json_loader } from './util/load_json.js';

    let db_update = '';

    const loader = json_loader(function(data) {
        if (data.server_status == 'OK') {
            const update = new Date(Date.parse(data.last_update));
            db_update = update.toLocaleString(navigator.languages);
        } else {
            db_update = "API unavailable";
        }
    }, function(error) { db_update = error; });

    onMount(function() { loader.load('/status'); });
    onDestroy(function() { loader.abort(); });
</script>

{$_('headline.last_update')}: {db_update}
