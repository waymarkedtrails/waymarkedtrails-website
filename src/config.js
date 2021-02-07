const config = JSON.parse(document.getElementById("WMTConfig").text);

export const API_URL = config.API_URL;
export const HELP = config.HELP;
export const MEDIA_URL = config.MEDIA_URL;
export const ROUTE_GROUPS = config.ROUTE_GROUPS;
export const TILE_URL = config.TILE_URL;
export const TITLE = config.TITLE;

export const BASEMAPS = [
    { id: "osm-mapnik",
      name: "OSM Standard Map",
      url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "<a href=\"https://openstreetmap.org\">OpenStreetMap</a>"
    },
    { id: "opentopo",
      name: "OpenTopoMap",
      url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: "<a href=\"https://opentopomap.org/\">OpenTopoMap</a>(<a href=\"https://creativecommons.org/licenses/by-sa/3.0/\">CC-by-SA</a>)"
    }];
export const HILLSHADING_URL = "https://hillshading.waymarkedtrails.org/srtm/{z}/{x}/{-y}.png";
