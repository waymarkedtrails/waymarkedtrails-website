<script>
    import { _ } from 'svelte-i18n';
    import { onDestroy } from 'svelte';
    import { map_state } from './map_state.svelte.js';
    import { download_line_any, download_line_oneway } from './map/styles.js';
    import GPX from 'ol/format/GPX.js';
    import KML from 'ol/format/KML.js';
    import GeoJSON from 'ol/format/GeoJSON.js';
    import MultiLineString from 'ol/geom/MultiLineString.js';
    import LineString from 'ol/geom/LineString.js';
    import Feature from 'ol/Feature.js';
    import VectorLayer from 'ol/layer/Vector';
    import VectorSource from 'ol/source/Vector';

    let { route } = $props();
    let route_appendices = $derived(Object.keys(route.appendix_lengths()));

    let format = $state('GPX');
    let direction = $state(1);
    let appendices = $state([]);

    let layer = new VectorLayer({
        source: new VectorSource(),
        style: download_line_oneway,
        zIndex: 30});

    map_state.map.addLayer(layer);

    let features = $derived.by(() => {
        const outfeat = [];
        let current_lines = [];
        let current_role = null;
        let current_dir = null;
        let prevpoint = null;
        for (let feat of route.get_features()) {
            const role = feat.get('role');
            const dir = feat.get('dir');
            if ((direction == 0 || dir == 0 || direction == dir)
                && (!role || appendices.indexOf(role) >= 0)) {
                if (current_lines.length > 0 &&
                    (feat.get('role') !== current_role
                     || (direction == 0 && current_dir != dir)
                     || prevpoint !== feat.getGeometry().getFirstCoordinate())) {
                    const properties = {geometry: new MultiLineString(current_lines)};
                    if (current_role) {
                        properties['role'] = current_role;
                    }
                    if (direction == 0) {
                        properties['direction'] = current_dir;
                    }
                    outfeat.push(new Feature(properties));
                    current_lines = [];
                }

                current_role = role;
                current_dir = dir;
                prevpoint = feat.getGeometry().getLastCoordinate();
                if (direction == -1) {
                    current_lines.push(new LineString(feat.getGeometry().getCoordinates().toReversed()))
                } else {
                    current_lines.push(feat.getGeometry());
                }
            }
        }
        if (current_lines.length > 0 ) {
            if (direction === -1) {
                current_lines.reverse();
            }
            const properties = {geometry: new MultiLineString(current_lines)};
            if (current_role) {
                properties['role'] = current_role;
            }
            if (direction == 0) {
                properties['direction'] = current_dir;
            }
            outfeat.push(new Feature(properties));
        }

        if (direction === -1) {
            outfeat.reverse();
        }

        return outfeat;
    });

    $effect(() => {
        layer.setStyle(direction == 0 ? download_line_any : download_line_oneway);
        layer.setSource(new VectorSource({features: features}));
    });

    onDestroy(() => {
        layer.setSource(null);
    });

    function addElement(parentEle, name, content) {
        const ele = document.createElementNS(parentEle.namespaceURI, name);
        ele.textContent = content;
        parentEle.append(ele);
        return ele;
    }

    function prependElement(parentEle, name, content) {
        const ele = document.createElementNS(parentEle.namespaceURI, name);
        ele.textContent = content;
        parentEle.prepend(ele);
        return ele;
    }

    function addSubElement(parentEle, name, subname, content) {
        const ele = document.createElementNS(parentEle.namespaceURI, name);
        const sub = document.createElementNS(ele.namespaceURI, subname);
        sub.textContent = content;
        ele.append(sub);
        parentEle.append(ele);
        return ele;
    }

    function slugify(name) {
        return name.toLowerCase()
                   .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                   .replace(/[^a-z0-9\s-]/g, ' ')
                   .trim()
                   .replace(/[\s-]+/g, '-');
    }

    function download_url() {
        let url = null;
        let filesuffix;
        if (format === 'GPX') {
          const gpx = new GPX().writeFeaturesNode(features, {
              decimals: 7,
              featureProjection: 'EPSG:3857',
              dataProjection: 'EPSG:4326'
          });
          gpx.setAttribute('creator', 'waymarkedtrails.org');

          const meta = document.createElementNS(gpx.namespaceURI, 'metadata');
          addElement(meta, 'name', route.title);
          addSubElement(meta, 'copyright', 'license', 'https://www.openstreetmap.org/copyright')
              .setAttribute('author', 'OpenStreetMap and Contributors');
          addSubElement(meta, 'link', 'text', 'WaymarkedTrails')
              .setAttribute('href', window.location.href.replace(/&map.*/, ''));
          addElement(meta, 'time', new Date().toISOString());
          gpx.prepend(meta);

          url = URL.createObjectURL(new Blob(
            ['<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n\n',
             new XMLSerializer().serializeToString(gpx)
            ],
            {type: 'application/gpx+xml' }));
          filesuffix = 'gpx';
        }
        if (format === 'KML') {
          const kml = new KML().writeFeaturesNode(features, {
              decimals: 7,
              featureProjection: 'EPSG:3857',
              dataProjection: 'EPSG:4326'
          });
          const doc = kml.children[0];
          prependElement(doc, 'name', route.name);
          const author = document.createElementNS('http://www.w3.org/2005/Atom', 'author');
          prependElement(author, 'name',
                     'waymarkedtrails.org; OpenStreetMap and Contributors http://www.openstreetmap.org/copyright');
          kml.prepend(author);
          const link = document.createElementNS('http://www.w3.org/2005/Atom', 'link');
          link.setAttribute('href', window.location.href.replace(/&map.*/, ''));
          kml.prepend(link);

          url = URL.createObjectURL(new Blob(
            ['<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n\n',
             new XMLSerializer().serializeToString(kml)
            ],
            {type: 'application/vnd.google-earth.kml+xml' }));
          filesuffix = 'kml';
        }
        if (format == 'GeoJson') {
          let geojson = new GeoJSON().writeFeaturesObject(features, {
              decimals: 7,
              featureProjection: 'EPSG:3857',
              dataProjection: 'EPSG:4326'
          });

          geojson['features'][0]['properties'] = {
            name: route.title,
            source: window.location.href.replace(/&map.*/, ''),
            timestamp: new Date().toISOString(),
            license: 'https://www.openstreetmap.org/copyright'
          }

          url = URL.createObjectURL(new Blob(
            [JSON.stringify(geojson)],
            {type: 'application/geo+json' }));
          filesuffix = 'json';

        }
        if (url) {
            let filename = slugify(route.title);
            let a = document.createElement("a");
            a.href = url;
            a.download = `${filename}.${filesuffix}`;
            a.click();
        }
    }

</script>

<style>
    div {
        display: flex;
        width: 100%;
    }

    button {
        flex-grow: 1;
        background-color: #cecece;
        color: black;
        font-size: 16px;
        padding: 6px 0px;
        border-color: #bbb;
        text-align: center;
        border-top: 1px solid #eee;
        border-left: 1px solid #eee;
        border-bottom: 1px solid #bbb;
        border-right: 1px solid #bbb;
    }

    fieldset {
        border-width: 2px
    }
</style>

<fieldset>
  <legend>{$_('details.download.format.title')}</legend>
  {#each ['GPX', 'KML', 'GeoJson'] as fmt}
  <label>
      <input type="radio" name="format" value={fmt} bind:group={format} />
      {$_('details.download.format.' + fmt)}
  </label>
  {/each}
</fieldset>

<fieldset style:display="flex" style:flex-direction="column">
  <legend>{$_('details.download.direction.title')}</legend>
  <label>
    <input type="radio" name="direction" value={1} bind:group={direction} />
    {#if route.tags.from && route.tags.to }
    {route.tags.from} 🠖 {route.tags.to}
    {:else}
    {$_('details.download.direction.forward')}
    {/if}
  </label>
  {#if route.tags.oneway != 'yes'}
  <label>
    <input type="radio" name="direction" value={-1} bind:group={direction} />
    {#if route.tags.from && route.tags.to }
    {route.tags.to} 🠖 {route.tags.from}
    {:else}
    {$_('details.download.direction.backward')}
    {/if}
  </label>
  <label>
    <input type="radio" name="direction" value={0} bind:group={direction} />
    {$_('details.download.direction.both')}
  </label>
  {/if}
</fieldset>

{#if route_appendices.length }
<fieldset>
  <legend>{$_('details.download.other_ways')}</legend>
  {#each route_appendices as app}
    <label>
      <input type="checkbox" name="appendices" value={app} bind:group={appendices} />
      {app}
    </label>
  {/each}
</fieldset>
{/if}

<div>
  <button type="button"
          onclick={(ev) => {ev.preventDefault(); download_url()}}>
      {$_('details.download.start')}
  </button>
</div>
