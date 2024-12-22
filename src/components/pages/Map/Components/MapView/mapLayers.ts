import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {
    LOCATION_LAYER_DEFAULT_STYLE,
    NEW_LOCATION_IN_PROGRESS_STYLE,
    SELECTED_LOCATION_STYLE_RECTANGLE,
} from "./mapStyles.ts";


export const createPublicLocationsLayer = (source: VectorSource) =>
    new VectorLayer({
        source,
        style: LOCATION_LAYER_DEFAULT_STYLE,
    });

export const createPrivateLocationsLayer = (source: VectorSource) =>
    new VectorLayer({
        source,
        style: LOCATION_LAYER_DEFAULT_STYLE,
    });

export const createNewInProgressLocationLayer = (source: VectorSource) =>
    new VectorLayer({
        source,
        style: NEW_LOCATION_IN_PROGRESS_STYLE,
    });

export const createSelectedLocationsLayer = (source: VectorSource) =>
    new VectorLayer({
        source,
        style: [SELECTED_LOCATION_STYLE_RECTANGLE, LOCATION_LAYER_DEFAULT_STYLE]
    });
