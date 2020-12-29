<script>
    import { _ } from 'svelte-i18n';
    import Collapsible from './Collapsible.svelte';

    export let tags;
    $: keys = get_sorted_tag_keys(tags);

    function get_sorted_tag_keys(tags) {
        let keys = [];
        for (var k in tags) {
            keys.push(k);
        }
        keys.sort((a, b) => a.localeCompare(b));

        return keys;
    }
</script>

<style>
    td {
        padding: 0 5px;
    }
</style>


<Collapsible title={$_('details.tags_title')}>
    <table>
        {#each keys as key}
            <tr><td>{key}</td><td>{tags[key]}</td></tr>
        {/each}
    </table>
</Collapsible>

