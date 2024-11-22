import { useState } from "react";
import MapView from "./Components/MapView/MapView.tsx";
import { MapLocation } from "./Components/MapView/map-utils.ts";
import LocationDetailsSidebar from "./Components/LocationDetailsSidebar/LocationDetailsSidebar.tsx";

function MapPage() {
    const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

    const handleSelectedLocation = (mapLocation: MapLocation | null) => {
        setSelectedLocation(mapLocation);
    };

    return (
        <div>
            <MapView onLocationSelection={handleSelectedLocation}/>
            <LocationDetailsSidebar selectedLocation={ selectedLocation } />
        </div>
    );
}

export default MapPage;
