import Map from 'ol/Map.js';
import {defaults as defaultInteractions, Select} from 'ol/interaction';
import {Feature, MapBrowserEvent} from "ol";
import {MutableRefObject, useEffect, useRef} from "react";
import {toLonLat} from "ol/proj";
import VectorSource from "ol/source/Vector";
import {
    BASE_MAP_LAYER,
    DEFAULT_INITIAL_VIEW, DEFAULT_SELECT_INTERACTION,
    generateLocationFeature,
    generateLocationInProgressFeature
} from "./mapUtils.ts";
import {MapLocation} from "../utils.ts";
import {
    createNewInProgressLocationLayer,
    createPrivateLocationsLayer,
    createPublicLocationsLayer,
    createSelectedLocationsLayer
} from "./mapLayers.ts";
import VectorLayer from "ol/layer/Vector";
import {SelectEvent} from "ol/interaction/Select";


interface MapViewProps {
    locationsDisplayedOnMap: MapLocation[];
    newLocationInProgressCoords: number[];
    setSelectedLocationInParent: (mapLocation: MapLocation | null) => void;
    handleNewLocationCoords: (mapClickCoords: number[]) => void;
    handleObliqueAeroPhotoCoords: (newObliqueAeroPhotoCoords: number[] | null) => void;
}

function MapView({
                     locationsDisplayedOnMap,
                     newLocationInProgressCoords,
                     setSelectedLocationInParent,
                     handleNewLocationCoords,
                     handleObliqueAeroPhotoCoords
                 }: MapViewProps) {

    const mapRef: MutableRefObject<Map | null> = useRef<Map | null>(null);

    const publicLocationsVectorSource: MutableRefObject<VectorSource> = useRef(new VectorSource());
    const privateLocationsVectorSource: MutableRefObject<VectorSource> = useRef(new VectorSource());
    const newLocationInProgressVectorSource: MutableRefObject<VectorSource> = useRef(new VectorSource());
    const selectedLocationsVectorSource: MutableRefObject<VectorSource> = useRef(new VectorSource());

    const publicLocationsLayer: MutableRefObject<VectorLayer> = useRef(
        createPublicLocationsLayer(publicLocationsVectorSource.current)
    );
    const privateLocationsLayer: MutableRefObject<VectorLayer> = useRef(
        createPrivateLocationsLayer(privateLocationsVectorSource.current)
    );
    const newLocationInProgressLayer: MutableRefObject<VectorLayer> = useRef(
        createNewInProgressLocationLayer(newLocationInProgressVectorSource.current)
    );
    const selectedLocationsVectorLayer: MutableRefObject<VectorLayer> = useRef(
        createSelectedLocationsLayer(selectedLocationsVectorSource.current)
    );

    const selectInteraction: Select = DEFAULT_SELECT_INTERACTION;


    function handleMapSelectEvent(event: SelectEvent) {
        const selectedFeatures: Feature[] = event.selected;

        selectedLocationsVectorSource.current.clear();
        setSelectedLocationInParent(null);

        if (selectedFeatures.length && !selectedFeatures[0]?.get("isNewLocationInProgress")) {
            selectedLocationsVectorSource.current.addFeature(selectedFeatures[0]);
            setSelectedLocationInParent(selectedFeatures[0].get("location"));
        }
    }
    selectInteraction.on("select", handleMapSelectEvent);


    function initMap(): Map {
        const map = new Map({
            target: "map-element",
            layers: [
                BASE_MAP_LAYER,
                selectedLocationsVectorLayer.current,
                privateLocationsLayer.current,
                publicLocationsLayer.current,
                newLocationInProgressLayer.current
            ],
            view: DEFAULT_INITIAL_VIEW,
            controls: [],
            interactions: defaultInteractions({
                doubleClickZoom: false,
            }),
        });

        map.on('dblclick', (event: MapBrowserEvent<PointerEvent>) => {
            handleObliqueAeroPhotoCoords(toLonLat(event.coordinate).reverse());
        });
        map.on('click', (event: MapBrowserEvent<PointerEvent>) => {
            handleNewLocationCoords(toLonLat(event.coordinate).reverse());
        });

        map.addInteraction(selectInteraction);

        return map;
    }


    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = initMap();

            return () => {
                mapRef.current?.setTarget();
                mapRef.current = null;
            };
        }
    }, []);


    useEffect(() => {
        publicLocationsVectorSource.current.clear();
        privateLocationsVectorSource.current.clear();

        locationsDisplayedOnMap.forEach((location: MapLocation) => {
            const feature = generateLocationFeature(location);
            if (location.isPublic) {
                publicLocationsVectorSource.current.addFeature(feature);
            } else {
                privateLocationsVectorSource.current.addFeature(feature);
            }
        });
    }, [locationsDisplayedOnMap]);


    useEffect(() => {
        newLocationInProgressVectorSource.current.clear();

        if (newLocationInProgressCoords.length !== 0) {
            newLocationInProgressVectorSource.current.addFeature(generateLocationInProgressFeature(newLocationInProgressCoords));
        }
    }, [newLocationInProgressCoords]);


    return (
        <div>
            <div id="map-element" className="absolute top-0 left-0 h-screen w-screen"/>
        </div>
    );
}

export default MapView;
