import { useState } from "react";
import MapView from "./Components/MapView/MapView.tsx";
import { MapLocation } from "./Components/MapView/map-utils.ts";
import LocationDetailsSidebar from "./Components/LocationDetailsSidebar/LocationDetailsSidebar.tsx";
import FilteringSidebar from "./Components/FilteringSidebar/FilteringSidebar.tsx";

type SidebarContent = "details" | "filtering" | null;

function MapPage() {
    const [sidebarContent, setSidebarContent] = useState<SidebarContent>(null);
    const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

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

    const isSidebarOpen = sidebarContent !== null;

    return (
        <div>
            <MapView onLocationSelection={openDetailsSidebar} />
            <div
                className="fixed top-0 right-0 h-full bg-black bg-opacity-70 transition-all duration-500 ease-in-out"
                style={{
                    transform: isSidebarOpen ? "translateX(0)" : "translateX(100%)",
                    width: "400px",
                }}
            >
                {sidebarContent === "details" && (
                    <LocationDetailsSidebar selectedLocation={selectedLocation} />
                )}
                {sidebarContent === "filtering" && <FilteringSidebar />}
            </div>
            <button
                className="fixed top-28 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow z-100 transition-all duration-500 ease-in-out"
                style={{
                    transform: isSidebarOpen ? "translateX(-400px)" : "translateX(0)",
                }}
                onClick={toggleFilteringMenu}
            >
                Filter
            </button>
        </div>
    );
}

export default MapPage;
