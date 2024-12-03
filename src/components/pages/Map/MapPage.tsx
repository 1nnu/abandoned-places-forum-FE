import {useEffect, useState} from "react";
import MapView from "./Components/MapView/MapView.tsx";
import LocationDetailsSidebar from "./Components/LocationDetailsSidebar/LocationDetailsSidebar.tsx";
import FilteringSidebar from "./Components/FilteringSidebar/FilteringSidebar.tsx";
import {MapLocation} from "./Components/MapView/map-utils.ts";
import emitter from "../../../emitter/eventEmitter.ts";
import ObliqueAeroPhotoContainer from "./Components/MapView/ObliqueAeroPhotoContainer.tsx";
import NewLocationSidebar from "./Components/NewLocationSidebar/NewLocationSidebar.tsx";

enum SidebarContent { DETAILS, FILTERING, NEW_LOCATION }

function MapPage() {

    const API_URL = import.meta.env.VITE_API_URL;

    const [isCursorMapPinMode, setIsCursorMapPinMode] = useState<boolean>(false);
    const [newLocationCoords, setNewLocationCoords] = useState<number[]>([]);
    const handleNewLocationCoords = (mapClickCoords: number[]) => {
        setNewLocationCoords(mapClickCoords);
    };


    const [obliqueAeroPhotoCoords, setObliqueAeroPhotoCoords] = useState<number[] | null>(null);
    const handleObliqueAeroPhotoCoords = (newObliqueAeroPhotoCoords: number[] | null) => {
        setObliqueAeroPhotoCoords(newObliqueAeroPhotoCoords);
    };


    const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
    const [locationsDisplayedOnMap, setLocationsDisplayedOnMap] = useState<MapLocation[]>([]);
    const handleLocationFiltering = (filteredLocations: MapLocation[]) => {
        setLocationsDisplayedOnMap(filteredLocations);
    };


    const [sidebarContent, setSidebarContent] = useState<SidebarContent>(SidebarContent.DETAILS);
    const isSidebarOpen =
        (sidebarContent === SidebarContent.DETAILS && selectedLocation !== null) || sidebarContent !== SidebarContent.DETAILS;
    const manageSidebar = (newContent: SidebarContent) => {
        setIsCursorMapPinMode(false);
        if (sidebarContent === newContent) {
            setSidebarContent(SidebarContent.DETAILS); // default value - sidebar is open if there is a selected location
        } else {
            setSidebarContent(newContent);
        }
    };

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                emitter.emit("startLoading");
                const userToken = localStorage.getItem("userToken");

                const response = await fetch(`${API_URL}/api/locations`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();

                setLocationsDisplayedOnMap(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                emitter.emit("stopLoading");
            }
        };

        fetchLocations();
    }, []);

    return (
        <div className={isCursorMapPinMode ? 'cursor-map-pin' : ''}>
            <MapView
                locationsDisplayedOnMap={locationsDisplayedOnMap}
                setSelectedLocationInParent={setSelectedLocation}
                applyNewLocationCoords={handleNewLocationCoords}
                applyObliqueAeroPhotoCoords={handleObliqueAeroPhotoCoords}
            />
            <ObliqueAeroPhotoContainer
                selectedCoords={obliqueAeroPhotoCoords}
                isSidebarOpen={isSidebarOpen}
            />
            <div
                className="fixed top-0 right-0 h-full bg-black bg-opacity-70 transition-all duration-500 ease-in-out flex justify-center items-center"
                style={{transform: isSidebarOpen ? "translateX(0)" : "translateX(100%)", width: "500px"}}
            >
                {sidebarContent === SidebarContent.DETAILS && (
                    <LocationDetailsSidebar
                        selectedLocation={selectedLocation}
                        applyObliqueAeroPhotoCoords={handleObliqueAeroPhotoCoords}
                    />
                )}
                {sidebarContent === SidebarContent.FILTERING && (
                    <FilteringSidebar
                        applyFilters={handleLocationFiltering}
                    />
                )}
                {sidebarContent === SidebarContent.NEW_LOCATION && (
                    <NewLocationSidebar
                        newLocationCoordsProps={newLocationCoords}
                        setMapPinCursorModeInParent={setIsCursorMapPinMode}
                    />
                )}
            </div>
            <button
                className="fixed top-32 right-0 border-4 border-black w-20 h-16 flex items-center justify-center rounded-l-lg transition-transform duration-500 ease-in-out"
                style={{
                    backgroundColor: sidebarContent === SidebarContent.NEW_LOCATION ? "rgba(256, 256, 256, 0.7)" : "rgba(0, 0, 0, 0.7)",
                    transform: isSidebarOpen ? "translateX(-500px)" : "translateX(0)",
                    color:  sidebarContent === SidebarContent.NEW_LOCATION ? "black" : "white",
                }}
                onClick={() => manageSidebar(SidebarContent.NEW_LOCATION)}
            >
                <span className="text-2xl mb-1">+</span>
                <img
                    src={`https://img.icons8.com/?size=100&id=85353&format=png&color=${
                        sidebarContent === SidebarContent.NEW_LOCATION ? "000000" : "FFFFFF"
                    }`}
                    className="w-8 h-8 transition-none"
                    alt="img"
                />
            </button>
            <button
                className="fixed top-56 right-0 border-4 border-black text-white w-20 h-16 flex items-center justify-center rounded-l-lg transition-transform duration-500 ease-in-out"
                style={{
                    backgroundColor: sidebarContent === SidebarContent.FILTERING ? "rgba(256, 256, 256, 0.7)" : "rgba(0, 0, 0, 0.7)",
                    transform: isSidebarOpen ? "translateX(-500px)" : "translateX(0)"
                }}
                onClick={() => manageSidebar(SidebarContent.FILTERING)}
            >
                <img
                    src={`https://img.icons8.com/?size=100&id=10752&format=png&color=${
                        sidebarContent === SidebarContent.FILTERING ? "000000" : "FFFFFF"
                    }`}
                    className="w-7 h-7 transition-none"
                    alt="img"
                />
            </button>
        </div>
    );
}

export default MapPage;
