import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {
    NEW_LOCATION_IN_PROGRESS_STYLE,
    LOCATION_IN_PROGRESS_STYLE_CIRCLE,
} from "./mapStyles.ts";
import TileLayer from "ol/layer/Tile";
import {ImageWMS, OSM, XYZ} from "ol/source";
import {TileGrid} from "ol/tilegrid";
import {L_EST} from "./mapUtils.ts";
import {Image} from "ol/layer";

export enum LandBoardLayerTypes {
    ORTOPHOTO = "foto",
    RELIEF = "vreljeef",
    BASIC = "kaart",
    HYBRID = "hybriid"
}

export const BASE_OSM_LAYER: TileLayer<OSM> = new TileLayer({
    source: new OSM(),
});


export const createVectorLayer = (source: VectorSource) =>
    new VectorLayer({
        source,
    });


export const createNewInProgressLocationLayer = (source: VectorSource) =>
    new VectorLayer({
        source,
        style: [LOCATION_IN_PROGRESS_STYLE_CIRCLE, NEW_LOCATION_IN_PROGRESS_STYLE]
    });


export const createLandBoardTileMapSource = (mapType: LandBoardLayerTypes) => {
    return new XYZ({
        projection: L_EST,
        tileGrid: new TileGrid({
            extent: [40500, 5993000, 1064500, 7017000],
            minZoom: 3,
            resolutions: [
                4000, 2000, 1000, 500, 250, 125, 62.5, 31.25, 15.625, 7.8125,
                3.90625, 1.953125, 0.9765625, 0.48828125
            ]
        }),
        url: `https://tiles.maaamet.ee/tm/tms/1.0.0/${mapType}/{z}/{x}/{-y}.jpg&ASUTUS=TALTECH&KESKKOND=TEST`,
    })
};


export const createImageLayer = () => {
    new Image({
        source: new ImageWMS({
            url: 'https://kaart.maaamet.ee/wms/alus?',
            params: {
                LAYERS: 'MA-ALUS',
                VERSION: '1.1.1',
                FORMAT: 'image/png',
                TRANSPARENT: true,
                SRS: L_EST,
            },
        }),
    })
};
