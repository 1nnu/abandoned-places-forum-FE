import Map from "ol/Map.js";
import { defaults as defaultInteractions, Select } from "ol/interaction";
import { Feature, MapBrowserEvent, View } from "ol";
import { useEffect, useRef } from "react";
import { toLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {
  BASE_MAP_LAYER,
  INITIAL_MAP_VIEW_CENTRE_MERCATOR,
} from "../../../Map/Components/MapView/mapUtils.ts";
import {
  LOCATION_LAYER_DEFAULT_STYLE,
  SELECTED_LOCATION_STYLE_RECTANGLE,
} from "../../../Map/Components/MapView/mapStyles.ts";

interface MapViewProps {
  applyNewLocationCoords: (mapClickCoords: number[]) => void;
  applyObliqueAeroPhotoCoords: (
    newObliqueAeroPhotoCoords: number[] | null
  ) => void;
}

export default function MapAddLocation({
  applyNewLocationCoords,
  applyObliqueAeroPhotoCoords,
}: MapViewProps) {
  const mapRef = useRef<Map | null>(null);
  const publicLocationsVectorSource = useRef(new VectorSource<Feature>());
  const privateLocationsVectorSource = useRef(new VectorSource<Feature>());

  const publicLocationsLayer = useRef(
    new VectorLayer({
      source: publicLocationsVectorSource.current,
      style: LOCATION_LAYER_DEFAULT_STYLE,
    })
  );
  const privateLocationsLayer = useRef(
    new VectorLayer({
      source: privateLocationsVectorSource.current,
      style: LOCATION_LAYER_DEFAULT_STYLE,
    })
  );

  useEffect(() => {
    if (!mapRef.current) {
      const map = new Map({
        target: "map-element",
        layers: [
          BASE_MAP_LAYER,
          privateLocationsLayer.current,
          publicLocationsLayer.current,
        ],
        view: new View({
          center: INITIAL_MAP_VIEW_CENTRE_MERCATOR,
          zoom: 8,
        }),
        controls: [],
        interactions: defaultInteractions({
          doubleClickZoom: false,
        }),
      });

      map.on("dblclick", (event: MapBrowserEvent<PointerEvent>) => {
        applyObliqueAeroPhotoCoords(toLonLat(event.coordinate).reverse());
      });
      map.on("click", (event: MapBrowserEvent<PointerEvent>) => {
        applyNewLocationCoords(toLonLat(event.coordinate).reverse());
      });

      const selectInteraction = new Select({
        style: [
          SELECTED_LOCATION_STYLE_RECTANGLE,
          LOCATION_LAYER_DEFAULT_STYLE,
        ],
      });

      map.addInteraction(selectInteraction);

      mapRef.current = map;

      return () => {
        map.setTarget();
        mapRef.current = null;
      };
    }
  }, []);

  return (
    <div
      id="map-element"
      className="w-full h-full rounded-md overflow-hidden border border-slate-300"
    />
  );
}
