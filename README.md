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
using [rollup](https://rollupjs.org) and [yarn2](https://yarnpkg.com/)
for package management.

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

The development version will look at `http://localhost:8080` for the API.

You can also force the site to run against the official API by setting a
couple of environment variables:

    WMT_API_URL='https://hiking.waymarkedtrails.org/api/v1' WMT_MEDIA_URL=https://static.waymarkedtrails.org/ yarn dev


Configuration
=============

You can set a number of environment variables to change the URLs that the
website uses:

* **WMT_BASE_URL** - Base URL of the website.
* **WMT_MEDIA_URL** - URL where to find media like images.
* **WMT_SYMBOL_URL** - Base URL where to find the shield SVGs.
* **WMT_TILE_BASE_URL** - Base URL where to find tiles. The site type will be added.
* **WMT_TILE_URL** - Full tile URL. Preferred over WMT_TILE_BASE_URL when set.

License
=======

The source code is available under GPLv3. See COPYING for more information.
