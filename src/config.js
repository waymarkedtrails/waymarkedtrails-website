import base_url from 'CFG_BASE_URL';
import media_url from 'CFG_MEDIA_URL';
import symbol_url from 'CFG_SYMBOL_URL';
import api_url from 'CFG_API_URL';
import tile_base_url from 'CFG_TILE_BASE_URL';
import tile_url from 'CFG_TILE_URL';

const config = JSON.parse(document.getElementById("WMTConfig").text);

const style = config.TITLE === 'osmc_symbol' ? 'hiking' : config.TITLE;

export const BASE_URL = base_url;
export const API_URL = api_url || ('https://' + style + '.' + base_url + '/api/v1');
export const HELP = config.HELP;
export const MEDIA_URL = media_url;
export const SYMBOL_URL = symbol_url + '/' + style;
export const ROUTE_GROUPS = config.ROUTE_GROUPS;
export const TILE_URL = (tile_url ||
                        ((tile_base_url || 'https://tile.waymarkedtrails.org') + '/' + style))
                        + '/{z}/{x}/{y}.png';
export const TITLE = config.TITLE;

export const BASEMAPS = [
    { id: "osm-mapnik",
      name: "OSM Standard Map",
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "<a href=\"https://openstreetmap.org\">OpenStreetMap</a>"
    },
    { id: "opentopo",
      name: "OpenTopoMap",
      url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: "<a href=\"https://opentopomap.org/\">OpenTopoMap</a>(<a href=\"https://creativecommons.org/licenses/by-sa/3.0/\">CC-by-SA</a>)"
    }];
export const HILLSHADING_URL = "https://hillshading.waymarkedtrails.org/srtm/{z}/{x}/{-y}.png";
