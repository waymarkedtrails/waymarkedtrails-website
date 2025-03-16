<script>
import { _ } from 'svelte-i18n';

let { state = 'no' } = $props();

</script>

<style>
    span {
         padding-left: 0.5em
    }

    .linear-style-yes {
         color: #3C3
    }

    .linear-style-sorted {
         color: #992
    }

    .linear-style-no {
         color: #C33
    }
</style>

<span class="linear-style-{state}" title={$_('details.linear.' + state)}>
{#if state == 'no'}
✘
{:else if state == 'sorted'}
↭
{:else}
✔
{/if}
</span>
