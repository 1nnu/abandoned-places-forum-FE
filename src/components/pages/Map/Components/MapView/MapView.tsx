import Map from 'ol/Map.js';
import { Feature, View } from "ol";
import {useEffect, useRef, useState} from "react";
import { transform } from "ol/proj";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Select } from "ol/interaction";
import { BASE_MAP_LAYER, generateLocationFeature, MapLocation, MERCATOR, WGS84 } from "./map-utils.ts";
import { LOCATION_LAYER_DEFAULT_STYLE, SELECTED_LOCATION_STYLE_RECTANGLE } from "./map-styles.ts";

interface MapViewProps {
    displayedLocations: MapLocation[];
    onLocationSelection: (mapLocation: MapLocation | null) => void;
}

export default function MapView({ displayedLocations, onLocationSelection }: MapViewProps) {
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
                layers: [BASE_MAP_LAYER, privateLocationsLayer.current, publicLocationsLayer.current],
                view: new View({
                    center: transform([25.5, 58.8], WGS84, MERCATOR),
                    zoom: 8,
                }),
                controls: [],
            });

            const selectInteraction = new Select({
                style: [SELECTED_LOCATION_STYLE_RECTANGLE, LOCATION_LAYER_DEFAULT_STYLE],
            });
            selectInteraction.on("select", (event) => {
                if (event.selected.length !== 0) {
                    onLocationSelection(event.selected[0].get("location"));
                } else if (event.deselected.length !== 0) {
                    onLocationSelection(null);
                }
            });
            map.addInteraction(selectInteraction);

            mapRef.current = map;

            return () => {
                map.setTarget();
                mapRef.current = null;
            };
        }
    }, []);


    useEffect(() => {
        publicLocationsVectorSource.current.clear();
        privateLocationsVectorSource.current.clear();

        displayedLocations.forEach((location: MapLocation) => {
            const feature = generateLocationFeature(location);
            if (location.isPublic) {
                publicLocationsVectorSource.current.addFeature(feature);
            } else {
                privateLocationsVectorSource.current.addFeature(feature);
            }
        });
    }, [displayedLocations]);

    return (
        <div>
            <div id="map-element" className="absolute top-0 left-0 h-screen w-screen"/>
            <div
                id="kaldfotoETAK"
                style={{
                    position: 'absolute',
                    width: '60vw', // Adjust width as needed
                    height: '60vh', // Adjust height as needed
                    borderRadius: '10px', // Rounded corners for the container
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Soft shadow for a nice floating effect
                    overflow: 'hidden',
                    border: '10px solid #fff', // White border around the iframe container
                    padding: '5px', // Padding for the container
                    top: '50%', // Center vertically
                    left: '50%', // Center horizontally
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <iframe
                    src="https://fotoladu.maaamet.ee/etak.php?B=59.556557865334916&L=26.647162879834188&fotoladu"
                    style={{
                        width: '100%',
                        height: '100%',
                        border: '2px solid #fff', // White border around the iframe itself
                    }}
                ></iframe>
                <span
                    style={{
                        position: 'absolute',
                        top: '5px',
                        right: '10px',
                        fontSize: '18px',
                        display: 'block',
                        cursor: 'pointer',
                        color: '#564b4b',
                        fontWeight: 'bold',
                    }}
                    /*onClick={hideIframe}*/
                >
                        X
                    </span>
            </div>
        </div>

    );
}
