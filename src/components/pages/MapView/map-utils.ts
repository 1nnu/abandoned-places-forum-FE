import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {Location} from "./locations-example.ts";
import {Feature} from "ol";
import {Point} from "ol/geom";
import {fromLonLat} from "ol/proj";

export const WGS84 = 'EPSG:4326';
export const MERCATOR = 'EPSG:3857';

export const BASE_MAP_LAYER = new TileLayer({
    source: new OSM(),
});

export function generateLocationFeature(location: Location) {
    return new Feature({
        geometry: new Point(fromLonLat([location.lon, location.lat])),
        location: location,
    });
}
