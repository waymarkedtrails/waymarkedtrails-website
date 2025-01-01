import {Stroke, Style, Circle, Fill} from 'ol/style';

function get_dashing(role, res, color, width) {
    if (role === '') {
        return {color: color, width: width};
    }
    if (role === 'alternative') {
        color[3] -= 0.1
        return {lineDash: [13, 20],
                lineCap: 'square',
                color: color,
                width: width*0.75};
        }

    return {lineDash: [1, 17], color: color, width: width - 0.8};
}

export function make_shadow_style() {
    return function(feat, res) {
        const props = feat.getProperties();
        var width = 7;
        var op = 0.6;
        if (res < 500) {
            width += (500.0 - res)/100.0;
            op -= (500.0 - res)/2000.0;
        }

        return new Style({
            geometry: function(feat) {
              let geom = feat.getGeometry().clone(); geom.translate(res,-res); return geom; },
            stroke: new Stroke(get_dashing(props.role, res, [21, 25, 0, op], width))
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

        return new Style({
            stroke: new Stroke(get_dashing(props.role, res, color, width))
        });
    }
};
