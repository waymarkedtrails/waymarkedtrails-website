import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import yaml from '@rollup/plugin-yaml';
import livereload from 'rollup-plugin-livereload';
import css from 'rollup-plugin-css-porter';
import { terser } from '@chiogen/rollup-plugin-terser';
import virtual from '@rollup/plugin-virtual';
import marked from 'markdown-it';
import { spawn } from 'child_process';

const production = !process.env.ROLLUP_WATCH;

const base_url = process.env.WMT_BASE_URL || 'waymarkedtrails.org';
const media_url = process.env.WMT_MEDIA_URL ||
                   (production ? 'https://static.' + base_url + '/' : '');
const api_url = process.env.WMT_API_URL ||
                   (production ? 'https://{theme}.' + base_url + '/api/v1'
                               : 'http://localhost:8080/v1');
const symbol_url = process.env.WMT_SYMBOL_URL ||
                   (production ? 'https://static.' + base_url + '/symbols'
                               : api_url + '/symbols/id');
const tile_url = process.env.WMT_TILE_URL || ('https://tile.' + base_url + '/{theme}');
const theme_url = process.env.WMT_THEME_URL || ('https://{theme}.' + base_url);

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
			server = spawn('yarn', ['start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

const md = marked()
const orig = md.normalizeLink;
md.normalizeLink = function(url) {
  let out = orig(url);
  if (out.indexOf('/') < 0 && (out.endsWith('png') || out.endsWith('svg'))) {
    // must be an image
    out = 'img/' + out;
  }

  return out;
}

function md_parse_dict(data, inline) {
    for (const section in data) {
        if (typeof data[section] === 'object') {
            md_parse_dict(data[section], inline);
        } else if (inline || section === 'title') {
            data[section] = md.renderInline(data[section]);
        } else {
            data[section] = md.render(data[section]);
        }
    }
}

export default {
	input: ['src/main.js', 'src/osmc_symbols.js'],
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
          'CFG_TILE_URL' : export_str(tile_url),
          'CFG_THEME_URL' : export_str(theme_url)
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
                return md_parse_dict(data, filePath.indexOf('helppage') < 0);
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
