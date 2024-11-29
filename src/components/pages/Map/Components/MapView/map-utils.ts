import { Feature } from "ol";
import { Point } from "ol/geom";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import { OSM } from "ol/source";

export const WGS84 = "EPSG:4326";
export const MERCATOR = "EPSG:3857";

export const BASE_MAP_LAYER = new TileLayer({
  source: new OSM(),
});

export function generateLocationFeature(location: MapLocation) {
  return new Feature({
    geometry: new Point(fromLonLat([location.lon, location.lat])),
    location: location,
  });
}

export interface LocationCategory {
  id: number;
  name: string;
  colorHex: string;
}

export interface MapLocation {
  id: string;
  uuid: string;
  name: string;
  lon: number;
  lat: number;
  mainCategory: LocationCategory;
  locationCategory: Array<LocationCategory>;
  condition: string;
  status: string;
  additionalInformation: string;
  minRequiredPointsToView: number;
  isPublic: boolean;
  isPendingPublicationApproval: boolean;
}
