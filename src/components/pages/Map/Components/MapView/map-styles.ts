import {Fill, Icon, RegularShape, Stroke, Style} from "ol/style";
import CircleStyle from "ol/style/Circle";

export const LOCATION_LAYER_DEFAULT_STYLE = new Style({
    image: new Icon({
        src: "https://img.icons8.com/?size=32&id=85353&format=png&color=2196f3",
        scale: 1,
    }),
});

export const SELECTED_LOCATION_STYLE_RECTANGLE = new Style({
    image: new RegularShape({
        points: 4,
        radius: 27,
        angle: Math.PI / 4,
        fill: new Fill({
            color: 'rgba(250, 250, 250, 1)',
        }),
        stroke: new Stroke({
            color: 'black',
            width: 2,
            lineDash: [4, 4],
        }),
    })
});

export const SELECTED_LOCATION_STYLE_CIRCLE = new Style({
    image: new CircleStyle({
        radius: 12,
        fill: new Fill({
            color: 'rgba(250, 250, 250, 1)',
        }),
        stroke: new Stroke({
            color: 'black',
            width: 2,
            lineDash: [4, 4],
        }),
        displacement: [-0.25, -13],
    })
});