import Map from 'ol/Map.js';
import {View} from "ol";
import {OSM} from "ol/source";
import TileLayer from "ol/layer/Tile";
import {useEffect} from "react";
import {toLonLat, transform} from "ol/proj";

function MapView() {

    const WGS84 = 'EPSG:4326';
    const MERCATOR = 'EPSG:3857';

    const BASE_MAP_LAYER = new TileLayer({
        source: new OSM(),
    });

    useEffect(() => {

        const map = new Map({
            target: "map-element",
            layers: [BASE_MAP_LAYER],
            view: new View({
                center: transform([25.5, 58.8], WGS84, MERCATOR),
                zoom: 8,
            }),
            controls: [],
        });

        map.on('pointermove', event => {
            console.log(toLonLat(event.coordinate));
        });

        return () => {
            map.setTarget();
        };
    });

    return (
        <div id="map-element" className="absolute top-0 left-0 h-screen w-screen z-20"/>
    );
}

export default MapView