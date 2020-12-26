const WMTConfig = {
    TITLE: 'Hiking',
    MEDIA_URL: '/',
    API_URL: 'http://loar:8080/v1/api',

    TILE_URL: 'https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png',
    HILLSHADING_URL: 'https://hillshading.waymarkedtrails.org/srtm/{z}/{x}/{-y}.png',
    BASEMAPS : [
        { id : "osm-mapnik",
          name : "OSM Standard Map",
          url : "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution : 'Base map: <a href="https://openstreetmap.org">OpenStreetMap</a>'
        },
        { id : "opentopo",
          name : "OpenTopoMap",
          url : "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",
          attribution : 'Base map: <a href="https://opentopomap.org/">OpenTopoMap</a>(<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-by-SA</a>)'
        }],
    ROUTE_GROUPS : [
        { id: 'INT', label: 'continental'},
        { id: 'NAT', label: 'national'},
        { id: 'REG', label: 'regional'},
        { id: '', label: 'other'},
        { id: 'NDS', label: 'node network connections' }
    ]
};

export { WMTConfig as default };
