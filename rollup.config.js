import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import yaml from '@rollup/plugin-yaml';
import livereload from 'rollup-plugin-livereload';
import css from 'rollup-plugin-css-porter';
import { terser } from 'rollup-plugin-terser';
import virtual from '@rollup/plugin-virtual';
import marked from 'marked';

const production = !process.env.ROLLUP_WATCH;

const base_url = process.env.WMT_BASE_URL || 'waymarkedtrails.org';
const media_url = process.env.WMT_MEDIA_URL ||
                   (production ? 'https://static.' + base_url : '');
const symbol_url = process.env.WMT_MEDIA_URL ||
                   (production ? 'https://static.' + base_url + '/symbols'
                               : 'http://localhost:8080/v1/api/symbols/id');
const api_url = process.env.WMT_MEDIA_URL ||
                   (production ? '' : 'http://localhost:8080/v1/api');
const tile_base_url = process.env.WMT_TILE_BASE || ('https://tile.' + base_url);
const tile_url = process.env.WMT_TILE_URL || '';

function export_str(content) {
    return `export default '` + content + `'`;
}

function serve() {
	let server;
	
	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('yarn', ['start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'es',
		dir: 'public/build/'
	},
	plugins: [
        virtual({
          'CFG_BASE_URL' : export_str(base_url),
          'CFG_MEDIA_URL' : export_str(media_url),
          'CFG_SYMBOL_URL' : export_str(symbol_url),
          'CFG_API_URL' : export_str(api_url),
          'CFG_TILE_BASE_URL' : export_str(tile_base_url),
          'CFG_TILE_URL' : export_str(tile_url)
        }),

		svelte({
            compilerOptions: {
                // enable run-time checks when not in production
                dev: !production,
            }
		}),
        css({ dest: 'public/build/bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
        json({namedExports: false, compact: production}),
        yaml({safe: false,
             transform(data, filePath) {
                 for (const section in data) {
                    for (const key in data[section]) {
                        if (key !== 'title') {
                            data[section][key] = marked.parse(data[section][key]);
                         }
                    }
                 }
                 return data;
             }
        }),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	},
    onwarn: function(warning, superOnWarn) {
    /*
     * skip certain warnings
     * https://github.com/openlayers/openlayers/issues/10245
     */
    if (warning.code === 'THIS_IS_UNDEFINED') {
      return;
    }
    superOnWarn(warning);
  }
};
