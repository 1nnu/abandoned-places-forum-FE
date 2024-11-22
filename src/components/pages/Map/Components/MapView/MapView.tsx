import Map from 'ol/Map.js';
import {Feature, View} from "ol";
import {useEffect, useRef} from "react";
import {transform} from "ol/proj";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {Select} from "ol/interaction";
import {BASE_MAP_LAYER, generateLocationFeature, MapLocation, MERCATOR, WGS84} from "./map-utils.ts";
import {LOCATION_LAYER_DEFAULT_STYLE, SELECTED_LOCATION_STYLE_RECTANGLE} from "./map-styles.ts";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface MapViewProps {
    onLocationSelection: (mapLocation: MapLocation | null) => void;
}

export default function MapView({onLocationSelection}: MapViewProps) {

    const mapRef = useRef(null);

    useEffect(() => {

        if (!mapRef.current) {
            const publicLocationsVectorSource: VectorSource<Feature> = new VectorSource();
            const privateLocationsVectorSource: VectorSource<Feature> = new VectorSource();

            const publicLocationsLayer: VectorLayer<VectorSource> = new VectorLayer({
                source: publicLocationsVectorSource,
                style: LOCATION_LAYER_DEFAULT_STYLE,
            });
            const privateLocationsLayer: VectorLayer<VectorSource> = new VectorLayer({
                source: privateLocationsVectorSource,
                style: LOCATION_LAYER_DEFAULT_STYLE,
            });

            axios.get(API_URL + "/api/locations")
                .then(response => {
                    response.data.forEach((location: MapLocation) => {
                        const feature = generateLocationFeature(location);
                        if (location.isPublic) {
                            publicLocationsVectorSource.addFeature(feature)
                        } else {
                            privateLocationsVectorSource.addFeature(feature)
                        }
                    });
                })
                .catch(error => {
                    console.error('Error fetching locations:', error);
                });

            const map = new Map({
                target: "map-element",
                layers: [BASE_MAP_LAYER, privateLocationsLayer, publicLocationsLayer],
                view: new View({
                    center: transform([25.5, 58.8], WGS84, MERCATOR),
                    zoom: 8,
                }),
                controls: [],
            });

            const selectInteraction = new Select({
                style: [SELECTED_LOCATION_STYLE_RECTANGLE, LOCATION_LAYER_DEFAULT_STYLE],
            });
            map.addInteraction(selectInteraction);
            selectInteraction.on('select', event => {
                if (event.selected.length !== 0) {
                    onLocationSelection(event.selected[0].get('location'));
                } else if (event.deselected.length !== 0) {
                    onLocationSelection(null);
                }
            });

            return () => {
                map.setTarget();
                mapRef.current = null;
            };
        }
    }, []);

    return (
        <div>
            <div id="map-element" className="absolute top-0 left-0 h-screen w-screen"/>
        </div>
    );
}
