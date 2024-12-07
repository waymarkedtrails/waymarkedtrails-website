<script>
    import { _ } from 'svelte-i18n';
    import Collapsible from './Collapsible.svelte';

    let { tags } = $props();
    let keys = $derived.by(() => {
        let kl = [];
        for (var k in tags) {
            kl.push(k);
        }
        kl.sort((a, b) => a.localeCompare(b));

        return kl;
    });
</script>

<style>
    table {
        width: 100%;
        padding: 0 5px
    }

    th {
        text-align: left;
    }

    .even {
        background-color: #f3f3f3;
    }
</style>


<Collapsible title={$_('details.tags.title')}>
    <table>
        <thead><tr><th>{$_('details.tags.key')}</th><th>{$_('details.tags.value')}</th></tr></thead>
        <tbody>
        {#each keys as key, idx}
            <tr class={idx % 2 === 0 ? "even" : "odd"}><td>{key}</td><td>{tags[key]}</td></tr>
        {/each}
        </tbody>
    </table>
</Collapsible>

