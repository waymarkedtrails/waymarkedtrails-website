const WMTConfig = {
    TITLE: 'site_title.hiking',
    MEDIA_URL: '/',
    API_URL: 'http://loar:8080/v1/api',

    TILE_URL: 'https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png',
    HILLSHADING_URL: 'https://hillshading.waymarkedtrails.org/srtm/{z}/{x}/{-y}.png',
    BASEMAPS : [
        { id : "osm-mapnik",
          name : "OSM Standard Map",
          url : "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution : '<a href="https://openstreetmap.org">OpenStreetMap</a>'
        },
        { id : "opentopo",
          name : "OpenTopoMap",
          url : "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",
          attribution : '<a href="https://opentopomap.org/">OpenTopoMap</a>(<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-by-SA</a>)'
        }],
    ROUTE_GROUPS : [
        { id: 'INT', label: 'network.continental'},
        { id: 'NAT', label: 'network.national'},
        { id: 'REG', label: 'network.regional'},
        { id: '', label: 'network.other'},
        { id: 'NDS', label: 'network.node' }
    ]
};

export { WMTConfig as default };
