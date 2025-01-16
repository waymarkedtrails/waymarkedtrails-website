import {Stroke, Style, Circle, Fill} from 'ol/style';

export const highlight_stroke = new Style({
                                  stroke: new Stroke({
                                            color: [211, 255, 5, 0.6],
                                            width: 10,
                                        }),
                                zindex: 1
                            });

export const highlight_circle =
    new Style({
        image: new Circle({
            radius: 13,
            stroke: new Stroke({color: [211, 255, 5, 1], width: 4}),
            fill: new Fill({color: [211, 255, 5, 0.4]})
        }),
        zindex: 1
    });


export const analyze_line = [
{ style: {
    'circle-radius': 8,
    'circle-fill-color': '#ff2533',
    'circle-stroke-color': [211, 255, 5, 0.4],
    'circle-stroke-width': 3,
  }
},
{ filter: ['==', ['get', 'virtual'], 0],
  style: {
    'stroke-width': 3,
    'stroke-color': '#000',
  }
},
{ filter: ['==', ['get', 'virtual'], 1],
  style: {
    'stroke-width': 1.5,
    'stroke-color': '#000',
    'stroke-line-dash': [10, 5]
  }
}
];

export const elevation_point = new Style({
            image: new Circle({
                radius: 5,
                fill: new Fill({color: '#0000ff'}),
                stroke: new Stroke({color: '#000', width: 1})
            }),
            zindex: 2
       });
