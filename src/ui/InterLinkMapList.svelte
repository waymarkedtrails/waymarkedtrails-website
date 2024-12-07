<script>
  import { TITLE, MEDIA_URL, BASE_URL } from '../config.js';
  import { _ } from 'svelte-i18n';

  const theme_color = {
    cycling: "#778bf2",
    hiking: "#81AA4B",
    mtb: "#353d6b",
    riding: "#d9c885",
    skating: "#c25366",
    slopes: "#a2a2a2"
  };

  let { themes, map_link_tail = '' } = $props();
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
    display: flex;
    align-items: center;
    font-weight: 700
 }

 li a:link {
    color: #eee;
 }

 li a:visited {
    color: #eee;
 }
</style>

<ul>
{#each themes as theme}
<li style="background-color:{theme_color[theme]}">
  <a href="https://{theme}.{BASE_URL}{map_link_tail}"><img src="{MEDIA_URL}img/map_{theme}.png" alt="{$_('site_title.' + theme)}" title="{$_('site_title.' + theme)}" />{$_('site_title.' + theme)}</a></li>
{/each}
</ul>

