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
{ filter: ['<', ['get', 'numlines'], 1.5],
  style: {
    'circle-radius': 8,
    'circle-fill-color': '#ff2533',
    'circle-stroke-color': [211, 255, 5, 0.4],
    'circle-stroke-width': 3,
  }
},
{ filter: ['>=', ['get', 'numlines'], 1.5],
  style: {
    'circle-radius': 8,
    'circle-fill-color': '#3be925',
    'circle-stroke-color': [8, 33, 8, 0.2],
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
