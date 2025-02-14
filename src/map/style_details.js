import {Stroke, Style, Circle, Fill, Text} from 'ol/style';

function get_dashing(role, res, color, width) {
    if (role === '') {
        return {color: color, width: width};
    }
    if (role === 'alternative') {
        color[3] -= 0.1
        return {lineDash: [4, 10],
                lineCap: 'square',
                color: color,
                width: width*0.6};
        }

    return {lineDash: [1, 17], color: color, width: width - 0.8};
}

export function make_shadow_style() {
    return function(feat, res) {
        const props = feat.getProperties();
        var width = 9;
        var op = 0.6;
        if (res < 500) {
            width += (500.0 - res)/100.0;
            op -= (500.0 - res)/2000.0;
        }

        return new Style({
            geometry: function(feat) {
              let geom = feat.getGeometry().clone(); geom.translate(1.5*res,-1.5*res); return geom; },
            stroke: new Stroke({color: [21, 25, 0, op], width: width})
        });
    }
};

export function make_style(hilight) {
    return function(feat, res) {
        const props = feat.getProperties();
        var width = 6;
        var op = 1.0;
        if (res < 500) {
            width += (500.0 - res)/100.0;
            op -= (500.0 - res)/2500.0;
        }

        var color;
        if (hilight && props.relations.indexOf(hilight) >= 0) {
            color = [255, 211, 5, 1.0];
        } else {
            color = [211, 255, 5, op]
        }

        const styles = [new Style({
            stroke: new Stroke(get_dashing(props.role, res, color, width))
        })];

        if (props.dir && res < 10) {
            styles.push(new Style({
                text: new Text({
                        text: props.dir > 0 ? '❯' : '❮',
                        placement: 'line',
                        repeat: 20,
                        keepUpright: false,
                        stroke: new Stroke({color: [122, 139, 41], width: 3}),
                        fill: new Fill({color: [122, 139, 41]})

                })
            }));
        }

        return styles;
    }
};
