Waymarked Trails - Website
==========================

[Waymarked Trails](https://waymarkedtrails.org) is a website that shows
recreational routes from [OpenStreetMap](https://openstreetmap.org) and
lets you inspect the routes and selected details.

This repository contains the website frontend. To run the site you also
need the [backend](https://github.com/waymarkedtrails/waymarkedtrails-backend/)
and the [API](https://github.com/waymarkedtrails/waymarkedtrails-api/).

Installation
============

The code is written in Javascript using [Svelte](https://svelte.dev/)
using [rollup 3](https://rollupjs.org) and [yarn2](https://yarnpkg.com/)
for package management. Note that Rollup3 requires Node 14.18+ to run.

If you only yarn1 ('classic yarn') available, you can bootstrap yourself
into using the latest yarn2 with:

    yarn set version berry
    yarn set version stable

To build the site run:

    yarn install
    yarn build

The website is then available in the `public/` directory.

Development
============

If you want to run the site for development run:

    yarn dev

The development version will look at `http://localhost:8080` for the API. You can also use environment variables
to tell the site where it lives and where it can find the API and the tiles. For instance you can force it to run
against the official API:

    WMT_API_URL='https://hiking.waymarkedtrails.org/api/v1' WMT_MEDIA_URL=https://static.waymarkedtrails.org/ yarn dev


Configuration
=============

You can set a number of environment variables to change the URLs that the
website uses. In the following, `{theme}` is substituted at run time with
`hiking`, `mtb`, or other equivalent values.

* **WMT_BASE_URL** - Base DNS of the website (default: `waymarkedtrails.org`)
* **WMT_API_URL** - URL prefix to contact the data APIs. (production default: `{theme}.<BASE_URL>/api/v1`; development default: `http://localhost:8080/v1`)
* **WMT_MEDIA_URL** - URL prefix to find media like images (production default: `static.<BASE_URL>/`; development default: empty)
* **WMT_SYMBOL_URL** - URL prefix to find the shield SVGs. (production default: `static.<BASE_URL>/symbol`; development default: `<API_URL>/symbols/id`)
* **WMT_TILE_URL** - URL prefix to find tiles (default: `tiles.<BASE_URL>/{theme}`)
* **WMT_THEME_URL** - URL where other themes (mtb, slopes, etc) are found (default: `{theme}.<BASE_URL>`)

License
=======

The source code is available under GPLv3. See COPYING for more information.
