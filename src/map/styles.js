import {Stroke, Style} from 'ol/style';

export let highlight_stroke = new Style({
                              stroke: new Stroke({
                                          color: [211, 255, 5, 0.6],
                                          width: 10,
                                      }),
                              zindex: 1
                          });
