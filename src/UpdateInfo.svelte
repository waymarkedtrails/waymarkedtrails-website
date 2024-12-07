<script>
    import { _, date, time } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import { json_load } from './util/load_json.js';

    let loader = $state();

    onMount(() => {
        let controller = new AbortController();
        const signal = controller.signal;
        loader = json_load('/status', {}, signal)
            .then((data) => {
                if (data.server_status != 'OK') {
                    throw new Error('error.api_unavailable');
                }
                return new Date(Date.parse(data.last_update));
            });

        return () => { if (controller) controller.abort(); };
    });
</script>

{$_('headline.last_update')}:
{#if loader}
{#await loader then db_update}
    {$date(db_update)} {$time(db_update)}
{:catch error}
    {$_(error.message)}
{/await}
{/if}
