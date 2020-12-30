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
