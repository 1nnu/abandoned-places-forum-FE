import {useEffect, useState} from "react";
import MapView from "./Components/MapView/MapView.tsx";
import LocationDetailsSidebar from "./Components/LocationDetailsSidebar/LocationDetailsSidebar.tsx";
import FilteringSidebar from "./Components/FilteringSidebar/FilteringSidebar.tsx";
import {MapLocation} from "./Components/MapView/map-utils.ts";
import emitter from "../../../emitter/eventEmitter.ts";
import ObliqueAeroPhotoContainer from "./Components/MapView/ObliqueAeroPhotoContainer.tsx";

type SidebarContent = "details" | "filtering" | null;

function MapPage() {
    const API_URL = import.meta.env.VITE_API_URL;

    const [sidebarContent, setSidebarContent] = useState<SidebarContent>(null);
    const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
    const [locationsDisplayedOnMap, setLocationsDisplayedOnMap] = useState<MapLocation[]>([]);
    const [obliqueAeroPhotoCoords, setObliqueAeroPhotoCoords] = useState<number[] | null>(null);

    const onApplyFilters = (filteredLocations: MapLocation[]) => {
        setLocationsDisplayedOnMap(filteredLocations);
    };
    const onApplyObliqueAeroPhotoCoords = (newObliqueAeroPhotoCoords: number[] | null) => {
        setObliqueAeroPhotoCoords(newObliqueAeroPhotoCoords);
    };

    const isSidebarOpen = sidebarContent !== null;
    const openDetailsSidebar = (mapLocation: MapLocation | null) => {
        setSelectedLocation(mapLocation);
        setSidebarContent(mapLocation ? "details" : null);
    };
    const toggleFilteringMenu = () => {
        if (sidebarContent === "filtering") {
            setSidebarContent(null);
        } else {
            setSidebarContent("filtering");
            setSelectedLocation(null);
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
        <div>
            <MapView
                locationsDisplayedOnMap={locationsDisplayedOnMap}
                onLocationSelection={openDetailsSidebar}
                applyObliqueAeroPhotoCoords={onApplyObliqueAeroPhotoCoords}
            />
            <ObliqueAeroPhotoContainer
                selectedCoords={obliqueAeroPhotoCoords}
                isSidebarOpen={isSidebarOpen}
            />
            <div
                className="fixed top-0 right-0 h-full bg-black bg-opacity-70 transition-all duration-500 ease-in-out flex justify-center items-center"
                style={{
                    transform: isSidebarOpen ? "translateX(0)" : "translateX(100%)",
                    width: "500px",
                }}
            >
                {sidebarContent === "details" && (
                    <LocationDetailsSidebar
                        selectedLocation={selectedLocation}
                        applyObliqueAeroPhotoCoords={onApplyObliqueAeroPhotoCoords}
                    />
                )}
                {sidebarContent === "filtering" && (
                    <FilteringSidebar onApplyFilters={onApplyFilters}/>
                )}
            </div>
            <button
                className="fixed top-28 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow z-100 transition-all duration-500 ease-in-out"
                style={{
                    transform: isSidebarOpen ? "translateX(-500px)" : "translateX(0)",
                }}
                onClick={toggleFilteringMenu}
            >
                Filter
            </button>
        </div>
    );
}

export default MapPage;
