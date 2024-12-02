import {useEffect, useState} from "react";
import MapView from "./Components/MapView/MapView.tsx";
import LocationDetailsSidebar from "./Components/LocationDetailsSidebar/LocationDetailsSidebar.tsx";
import FilteringSidebar from "./Components/FilteringSidebar/FilteringSidebar.tsx";
import {MapLocation} from "./Components/MapView/map-utils.ts";
import emitter from "../../../emitter/eventEmitter.ts";
import ObliqueAeroPhotoContainer from "./Components/MapView/ObliqueAeroPhotoContainer.tsx";
import NewLocationSidebar from "./Components/NewLocationSidebar/NewLocationSidebar.tsx";

type SidebarContent = "details" | "filtering" | "newLocation" | null;

function MapPage() {
    const API_URL = import.meta.env.VITE_API_URL;

    const [isCursorMapPinMode, setIsCursorMapPinMode] = useState<boolean>(false);
    const [newLocationCoords, setNewLocationCoords] = useState<number[] | null>(null);
    const handleNewLocationCoords = (mapClickCoords: number[]) => {
        setNewLocationCoords(mapClickCoords);
    };


    const [obliqueAeroPhotoCoords, setObliqueAeroPhotoCoords] = useState<number[] | null>(null);
    const handleObliqueAeroPhotoCoords = (newObliqueAeroPhotoCoords: number[] | null) => {
        setObliqueAeroPhotoCoords(newObliqueAeroPhotoCoords);
    };


    const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
    const [locationsDisplayedOnMap, setLocationsDisplayedOnMap] = useState<MapLocation[]>([]);
    const handleLocationSelectionEvent = (mapLocation: MapLocation | null) => {
        setSelectedLocation(mapLocation);
        manageSidebarContent(mapLocation ? "details" : null);
    };
    const handleLocationFiltering = (filteredLocations: MapLocation[]) => {
        setLocationsDisplayedOnMap(filteredLocations);
    };


    const [sidebarContent, setSidebarContent] = useState<SidebarContent>(null);
    const isSidebarOpen = sidebarContent !== null;
    const manageSidebarContent = (newContent: SidebarContent) => {
        if (sidebarContent === newContent) {
            setSidebarContent(selectedLocation ? "details" : null);
            setIsCursorMapPinMode(false);
        } else {
            setSidebarContent(newContent);
            if (newContent !== "newLocation") {
                setIsCursorMapPinMode(false);
            }
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
                onLocationSelectionEvent={handleLocationSelectionEvent}
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
                {sidebarContent === "details" && (
                    <LocationDetailsSidebar
                        selectedLocation={selectedLocation}
                        applyObliqueAeroPhotoCoords={handleObliqueAeroPhotoCoords}
                    />
                )}
                {sidebarContent === "filtering" && (
                    <FilteringSidebar
                        applyFilters={handleLocationFiltering}
                    />
                )}
                {sidebarContent === "newLocation" && (
                    <NewLocationSidebar
                        newLocationCoordsProps={newLocationCoords}
                        setParentMapPinCursorState={setIsCursorMapPinMode}
                    />
                )}
            </div>
            <button
                className="fixed top-28 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow z-100 transition-all duration-500 ease-in-out"
                style={{transform: isSidebarOpen ? "translateX(-500px)" : "translateX(0)"}}
                onClick={ () => manageSidebarContent("newLocation") }
            >
                +
            </button>
            <button
                className="fixed top-44 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow z-100 transition-all duration-500 ease-in-out"
                style={{transform: isSidebarOpen ? "translateX(-500px)" : "translateX(0)"}}
                onClick={ () => manageSidebarContent("filtering") }
            >
                Filter
            </button>
        </div>
    );
}

export default MapPage;
