<script>
    import { _ } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import { json_loader } from './util/load_json.js';
    import HourGlass from './svg/HourGlass.svelte';
    export let osm_id;

    let destinations;
    let fail_message = '';

    const loader = json_loader(function(json) {
        if (json.error) {
            fail_message = json.error;
            return;
        }

        if (!json.data) {
            fail_message = $_('destination_sign.no_data');
            return;
        }

        for (let feat of json.data) {
            if (feat.duration) {
                feat.duration = duration_in_min(feat.duration);
            }
            feat.formatted_distance = format_distance(feat);
            if (feat.id) {
                feat.arrow_link = '<a target="_new" href="https://www.openstreetmap.org/relation/' + feat.id + '">&#10137;</a>';
            } else  {
                feat.arrow_link = '&#10137;';
            }
            feat.destinations = feat.deststring.split('<br>');
        }

        json.data.sort((a, b) => (a.dir - b.dir)
                                 || (a.id - b.id)
                                 || (a.duration - b.duration)
                                 || (a.distance - b.distance)
                                 || a.deststring.localeCompare(b.deststring));

        let prev_dir = -1;
        let prev_id = -1;
        let dir_num = -1;
        for (let feat of json.data) {
            feat.first_in_rel = (prev_dir != feat.dir) || (prev_id != feat.id);
            if (feat.first_in_rel) {
                ++dir_num;
            }
            feat.dir_num = dir_num;
            prev_dir = feat.dir;
            prev_id = feat.id;
        }

        destinations = json.data;

    }, function(error) { fail_message = $_('error.load_error'); },
       'https://osm.mueschelsoft.de/destinationsign');

    onMount(() => {
        destinations = false;
        fail_message = '';

        loader.load('/code/generate.pl?',
                    {nodeid : osm_id,
                     namedroutes : '',
                     fromarrow : '',
                     format : 'json',
                     distunit : 'm',
                     fast : 1});

        return () => { loader.abort(); };
    });

    function duration_in_min(dur) {
        let parts = dur.split(':', 2);
        if (parts.length == 2) {
            return (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0);
        }

        return parseInt(dur) || 0;
    }

    function format_distance(d) {
        let dur = '';
        if (d.duration) {
            if (d.duration < 60) {
                dur = d.duration + "&#8239;min";
            } else {
                dur = Math.floor(d.duration/60) + "&hairsp;h";
                let m = d.duration % 60;
                if (m > 0) {
                    dur += '&#8239;' + m;
                }
            }
        }
        if (d.distance) {
            if (dur) {
                dur += ' / ';
            }
            if (d.distance < 1000) {
                dur += d.distance + 'm';
            } else {
                dur += d.distance / 1000 + 'km';
            }
        }

        return dur;
    }
</script>

<style>
    table {
        width: 100%;
    }

    td {
        padding: 0 .5em;
        font-size: 90%;
    }

    .first-in-rel td {
        padding-top: .8ex;
    }

    .arrow {
        width: 1em;
        font-size: large
    }
</style>

{#if fail_message}
{fail_message}
{:else if destinations}
<table>
    {#each destinations as dest}
    <tr class:first-in-rel={dest.first_in_rel} class:odd-row={dest.dir_num % 2 == 1}>
        <td><div class="arrow" style="transform: rotate({dest.dir}deg)">{@html dest.arrow_link}</div></td>
        <td>
        {#each dest.destinations as name}
         <span>{name}</span><br>
        {/each}
        </td>
        <td>{@html dest.formatted_distance}</td>
    </tr>
  {/each}
</table>
<div><a target="_new" href="https://osm.mueschelsoft.de/destinationsign/example/index.htm#node={osm_id}">{$_('destination_sign.more')}</a></div>
{:else}
    <HourGlass />
{/if}
