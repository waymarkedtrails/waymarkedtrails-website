<script>
  import { TITLE, MEDIA_URL } from '../config.js';
  import { _ } from 'svelte-i18n';

  const theme_color = {
    cycling: "#778bf2",
    hiking: "#81AA4B",
    mtb: "#353d6b",
    riding: "#d9c885",
    skating: "#c25366",
    slopes: "#a2a2a2"
  };

  export let themes;
</script>

<style>
 ul {
    margin: 3px;
    padding: 0
 }

 li {
    list-style: none;
    border-top: 1px black solid
 }

 img {
    padding: 5px;
 }

 a {
    font-weight: 700
 }
</style>

<ul>
{#each themes as theme}
<li style="background-color:{theme_color[theme]}">
  <a class="maplink_btn" href="https://{theme}.waymarkedtrails.org"><img src="{MEDIA_URL}img/map_{theme}.png" alt="{$_('site_title.' + theme)}" title="{$_('site_title.' + theme)}" />{$_('site_title.' + theme)}</a></li>
{/each}
</ul>

