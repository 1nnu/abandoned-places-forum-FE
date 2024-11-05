import Map from 'ol/Map.js';
import {Feature, View} from "ol";
import {useEffect, useRef, useState} from "react";
import {transform} from "ol/proj";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {Select} from "ol/interaction";
import locationsExample, {Location} from "./locations-example.ts";
import {BASE_MAP_LAYER, generateLocationFeature, MERCATOR, WGS84} from "./map-utils.ts";
import {LOCATION_LAYER_DEFAULT_STYLE, SELECTED_LOCATION_STYLE_RECTANGLE} from "./map-styles.ts";

function MapView() {

    const mapRef = useRef(null);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    useEffect(() => {

        if (!mapRef.current) {
            const locationsVectorSource: VectorSource<Feature> = new VectorSource();
            const locationsVectorLayer: VectorLayer<VectorSource> = new VectorLayer({
                source: locationsVectorSource,
                style: LOCATION_LAYER_DEFAULT_STYLE,
            });


            locationsExample.forEach(loc => {
                const feature = generateLocationFeature(loc)
                locationsVectorSource.addFeature(feature);
            });


            const map = new Map({
                target: "map-element",
                layers: [BASE_MAP_LAYER, locationsVectorLayer],
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
                    setSelectedLocation(event.selected[0].get('location'));
                } else if (event.deselected.length !== 0) {
                    setSelectedLocation(null);
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
            <div id="map-element" style={{ zIndex: -1 }} className="absolute top-0 left-0 h-screen w-screen"/>
            <div className="absolute">
                Selected Location as props: {selectedLocation?.name || "None"}
            </div>
        </div>
    );
}

export default MapView