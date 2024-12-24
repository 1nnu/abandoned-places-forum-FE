import {Feature, View} from "ol";
import {Point} from "ol/geom";
import TileLayer from "ol/layer/Tile";
import {fromLonLat, transform} from "ol/proj";
import {OSM} from "ol/source";
import {MapLocation} from "../utils.ts";
import {Select} from "ol/interaction";
import {generateColoredLocationStyle, SELECTED_LOCATION_STYLE_RECTANGLE} from "./mapStyles.ts";

export const WGS84 = "EPSG:4326";
export const MERCATOR = "EPSG:3857";

export const INITIAL_MAP_VIEW_CENTRE_LON_LAT = [25.5, 58.8]
export const INITIAL_MAP_VIEW_CENTRE_MERCATOR = transform(INITIAL_MAP_VIEW_CENTRE_LON_LAT, WGS84, MERCATOR);

export const BASE_MAP_LAYER = new TileLayer({
  source: new OSM(),
});

export const DEFAULT_INITIAL_VIEW = new View({
  center: INITIAL_MAP_VIEW_CENTRE_MERCATOR,
  zoom: 8,
})

export const DEFAULT_SELECT_INTERACTION: Select = new Select({
  style: null,
});

export function generateLocationFeature(mapLocation: MapLocation): Feature<Point> {
  const feature = new Feature({
    geometry: new Point(fromLonLat([mapLocation.lon, mapLocation.lat])),
    location: mapLocation,
    isNewLocationInProgress: false,
  });

  feature.setStyle(generateColoredLocationStyle(mapLocation.mainCategory.colorHex));
  return feature;
}


export function generateSelectedFeature(mapLocation: MapLocation): Feature<Point> {
  const feature = new Feature({
    geometry: new Point(fromLonLat([mapLocation.lon, mapLocation.lat])),
    location: mapLocation,
    isNewLocationInProgress: false,
  });

  const coloredMapPinStyle = generateColoredLocationStyle(mapLocation.mainCategory.colorHex);
  const styles = [SELECTED_LOCATION_STYLE_RECTANGLE, coloredMapPinStyle];
  feature.setStyle(styles);

  return feature;
}


export function generateLocationInProgressFeature(newLocationCoords: number[]) {
  return new Feature({
    geometry: new Point(fromLonLat([newLocationCoords[1], newLocationCoords[0]])),
    isNewLocationInProgress: true,
  });
}
