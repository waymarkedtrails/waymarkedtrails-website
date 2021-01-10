const WMTConfig = {
    TITLE: 'hiking',
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
    ],
    HELP : [
        { l: 0, section: "about", paragraphs: ["hiking", "osm"]},
        { l: 0, section: "rendering", paragraphs: ["hikingroutes", "classification", "hikinglabels", "hierarchy", "guideposts"]},
        { l: 1, section: "hierarchies", paragraphs: ["text"]},
        { l: 1, section: "osmc", paragraphs: ["text"]},
        { l: 1, section: "hikinglocal", paragraphs: ["text", "czech", "germany", "hungary", "slovakia", "swiss", "italy", "uk"]},
        { l: 1, section: "elevationprofiles", paragraphs: ["general"]},
        { l: 0, section: "technical", paragraphs: ["general", "translation"]},
        { l: 0, section: "legal", paragraphs: ["copyright", "usage", "disclaimer"]},
        { l: 0, section: "acknowledgements", paragraphs: ["text"]},
        { l: 0, section: "contact", paragraphs: ["text"]}
    ]
};

export { WMTConfig as default };
