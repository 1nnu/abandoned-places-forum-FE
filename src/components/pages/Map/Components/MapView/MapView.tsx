import Map from 'ol/Map.js';
import {defaults as defaultInteractions, Select} from 'ol/interaction';
import {Feature, MapBrowserEvent, View} from "ol";
import {useEffect, useRef, useState} from "react";
import {toLonLat} from "ol/proj";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {BASE_MAP_LAYER, generateLocationFeature, INITIAL_MAP_VIEW_CENTRE_MERCATOR, MapLocation} from "./map-utils.ts";
import {LOCATION_LAYER_DEFAULT_STYLE, SELECTED_LOCATION_STYLE_RECTANGLE} from "./map-styles.ts";

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
                    center: INITIAL_MAP_VIEW_CENTRE_MERCATOR,
                    zoom: 8,
                }),
                controls: [],
                interactions: defaultInteractions({
                    doubleClickZoom: false,
                }),
            });

            map.on('dblclick', (event: MapBrowserEvent<PointerEvent>) => {
                setselectedCoords(toLonLat(event.coordinate).reverse());
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

    const [selectedCoords, setselectedCoords] = useState<number[] | null>(null);
    const [iframeUrl, setIframeUrl] = useState<string>("");

    useEffect(() => {
        if (selectedCoords != null) {
            setIframeUrl(`https://fotoladu.maaamet.ee/etak.php?B=${selectedCoords[0]}&L=${selectedCoords[1]}&fotoladu`);
        }
    }, [selectedCoords]);

    return (
        <div>
            <div id="map-element" className="absolute top-0 left-0 h-screen w-screen"/>
        {selectedCoords != null && (
            <div
                id="kaldfotoETAK"
                style={{
                    position: 'absolute',
                    width: '60vw',
                    height: '60vh',
                    borderRadius: '10px',
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: '10px solid #fff',
                    padding: '5px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <iframe
                    src={iframeUrl}
                    className="w-full h-full border-2 border-white rounded-tl rounded-bl"
                ></iframe>
                <button
                    className="
                     absolute -top-6 -right-6 w-8 h-8
                     bg-red-500 text-white font-bold rounded-full shadow-lg
                     flex items-center justify-center
                     cursor-pointer transition-transform transform hover:scale-110 z-50"
                    onClick={() => setselectedCoords(null)}
                >
                    X
                </button>
            </div>
        )}
        </div>

    );
}
