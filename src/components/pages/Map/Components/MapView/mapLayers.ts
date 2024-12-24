import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {
    NEW_LOCATION_IN_PROGRESS_STYLE,
    LOCATION_IN_PROGRESS_STYLE_CIRCLE,
} from "./mapStyles.ts";


export const createPublicLocationsLayer = (source: VectorSource) =>
    new VectorLayer({
        source,
    });

export const createPrivateLocationsLayer = (source: VectorSource) =>
    new VectorLayer({
        source,
    });

export const createNewInProgressLocationLayer = (source: VectorSource) =>
    new VectorLayer({
        source,
        style: [LOCATION_IN_PROGRESS_STYLE_CIRCLE, NEW_LOCATION_IN_PROGRESS_STYLE]
    });

export const createSelectedLocationsLayer = (source: VectorSource) =>
    new VectorLayer({
        source,
    });
