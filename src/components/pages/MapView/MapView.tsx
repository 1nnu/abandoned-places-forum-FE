import Map from 'ol/Map.js';
import {Feature, View} from "ol";
import {OSM} from "ol/source";
import TileLayer from "ol/layer/Tile";
import {useEffect} from "react";
import {fromLonLat, transform} from "ol/proj";
import VectorSource from "ol/source/Vector";
import {Point} from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import {Icon, Style} from "ol/style";
import {Select} from "ol/interaction";

function MapView() {

    const WGS84 = 'EPSG:4326';
    const MERCATOR = 'EPSG:3857';

    const BASE_MAP_LAYER = new TileLayer({
        source: new OSM(),
    });

    const locations_example = [
        {name: "location1", coordinates: [25.5, 58.6]},
        {name: "location2", coordinates: [25.7, 58.8]},
        {name: "location3", coordinates: [25.9, 59.0]}
    ];

    function generateLocationFeature(location: object) {
        return new Feature({
            geometry: new Point(fromLonLat(location.coordinates)),
            location: location,
            // style:
        });
    }

    const defaultLocationVectorLayerStyle = new Style({
        image: new Icon({
            src: "http://static.arcgis.com/images/Symbols/NPS/npsPictograph_0231b.png",
            scale: 0.25,
        })
    });

    useEffect(() => {

        const locationsVectorSource: VectorSource<Feature> = new VectorSource();

        locations_example.forEach(loc => {
            locationsVectorSource.addFeature(generateLocationFeature(loc));
        });

        const locationVectorLayer: VectorLayer<VectorSource> = new VectorLayer({
            source: locationsVectorSource,
            style: defaultLocationVectorLayerStyle,
        });


        const map = new Map({
            target: "map-element",
            layers: [BASE_MAP_LAYER, locationVectorLayer],
            view: new View({
                center: transform([25.5, 58.8], WGS84, MERCATOR),
                zoom: 8,
            }),
            controls: [],
        });


        const selectInteraction = new Select();
        map.addInteraction(selectInteraction);

        selectInteraction.on('select', event => {
            if (event.selected.length !== 0) {
                // set selected location in global state
                console.log("selected: " + event.selected[0].get("location").name);
            } else if (event.deselected.length !== 0) {
                // set selected location to null in global state
            }
        });

        /*map.on('pointermove', event => {
            console.log(toLonLat(event.coordinate));
        });*/

        return () => {
            map.setTarget();
        };
    }, [BASE_MAP_LAYER, locations_example]);

    return (
        <div id="map-element" className="absolute top-0 left-0 h-screen w-screen z-20"/>
    );
}

export default MapView