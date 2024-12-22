import {useEffect, useState} from "react";
import MapView from "./Components/MapView/MapView.tsx";
import LocationDetailsSidebar from "./Components/Sidebars/LocationDetailsSidebar/LocationDetailsSidebar.tsx";
import FilteringSidebar from "./Components/Sidebars/FilteringSidebar/FilteringSidebar.tsx";
import ObliqueAeroPhotoContainer from "./Components/ObliqueAeroPhoto/ObliqueAeroPhotoContainer.tsx";
import NewLocationSidebar from "./Components/Sidebars/NewLocationSidebar/NewLocationSidebar.tsx";
import NewLocationButton from "./Components/Sidebars/Buttons/NewLocationButton.tsx";
import FilteringButton from "./Components/Sidebars/Buttons/FilteringButton.tsx";
import {MapLocation, SidebarContent} from "./Components/utils.ts";
import {fetchAllAvailableLocations} from "../../../service/LocationService.ts";


function MapPage() {

    const [globalSelectedLocation, setGlobalSelectedLocation] = useState<MapLocation | null>(null);


    const [obliqueAeroPhotoCoords, setObliqueAeroPhotoCoords] = useState<number[] | null>(null);


    const [globalMapClickCoords, setGlobalMapClickCoords] = useState<number[] | null>(null);
    const [globalCoordinateSelectionMode, setGlobalCoordinateSelectionMode] = useState<boolean>(false);


    const [locationsDisplayedOnMap, setLocationsDisplayedOnMap] = useState<MapLocation[]>([]);
    function handleLocationFiltering(filteredLocations: MapLocation[]) {
        setLocationsDisplayedOnMap(filteredLocations);
    }
    function displayNewLocation(createdLocation: MapLocation, selectOnMap: boolean) {
        if (selectOnMap) {
            setGlobalSelectedLocation(createdLocation);
            setSidebarContent(SidebarContent.DETAILS);
        }
        setLocationsDisplayedOnMap(prevLocations => [...prevLocations, createdLocation]);
    }
    function stopDisplayingDeletedLocation(deletedLocationId: string) {
        setGlobalSelectedLocation(null);
        setLocationsDisplayedOnMap(prevLocations =>
            prevLocations.filter(location => location.id !== deletedLocationId)
        );
    }


    const [sidebarContent, setSidebarContent] = useState<SidebarContent>(SidebarContent.DETAILS);
    const isSidebarOpen =
        (sidebarContent === SidebarContent.DETAILS && globalSelectedLocation !== null) || sidebarContent !== SidebarContent.DETAILS;
    function manageSidebar(newContent: SidebarContent) {
        setGlobalCoordinateSelectionMode(false);
        if (sidebarContent === newContent) {
            setSidebarContent(SidebarContent.DETAILS);
        } else {
            setSidebarContent(newContent);
        }
    }


    useEffect(() => {
        fetchAllAvailableLocations().then((locations: MapLocation[] | null) => {
            if (locations) {
                setLocationsDisplayedOnMap(locations);
            }
        });
    }, []);


    return (
        <div className={globalCoordinateSelectionMode ? 'cursor-map-pin' : ''}>
            <MapView
                globalMapClickCoords={globalMapClickCoords}
                setGlobalMapClickCoords={setGlobalMapClickCoords}
                globalCoordinateSelectionMode={globalCoordinateSelectionMode}
                locationsDisplayedOnMap={locationsDisplayedOnMap}
                globalSelectedLocation={globalSelectedLocation}
                setGlobalSelectedLocation={setGlobalSelectedLocation}
                setObliqueAeroPhotoCoords={setObliqueAeroPhotoCoords}
                sideBarContent={sidebarContent}
            />
            <ObliqueAeroPhotoContainer
                obliqueAeroPhotoCoords={obliqueAeroPhotoCoords}
                isSidebarOpen={isSidebarOpen}
            />
            <div
                className="fixed top-0 right-0 h-full bg-black bg-opacity-75 z-40
                 flex justify-center items-center transition-all duration-500 ease-in-out"
                style={{transform: isSidebarOpen ? "translateX(0)" : "translateX(100%)", width: "500px"}}
            >
                {sidebarContent === SidebarContent.DETAILS && (
                    <LocationDetailsSidebar
                        globalSelectedLocation={globalSelectedLocation}
                        stopDisplayingDeletedLocation={stopDisplayingDeletedLocation}
                        setObliqueAeroPhotoCoords={setObliqueAeroPhotoCoords}
                    />
                )}
                {sidebarContent === SidebarContent.FILTER && (
                    <FilteringSidebar
                        applyFilters={handleLocationFiltering}
                    />
                )}
                {sidebarContent === SidebarContent.ADD_NEW_LOCATION && (
                    <NewLocationSidebar
                        globalCoordinateSelectionMode={globalCoordinateSelectionMode}
                        setGlobalCoordinateSelectionMode={setGlobalCoordinateSelectionMode}
                        globalMapClickCoords={globalMapClickCoords}
                        displayCreatedLocation={displayNewLocation}
                    />
                )}
            </div>
            <button onClick={() => manageSidebar(SidebarContent.ADD_NEW_LOCATION)}>
                <NewLocationButton sidebarContent={sidebarContent} isSidebarOpen={isSidebarOpen}/>
            </button>
            <button onClick={() => manageSidebar(SidebarContent.FILTER)}>
                <FilteringButton sidebarContent={sidebarContent} isSidebarOpen={isSidebarOpen}/>
            </button>
        </div>
    );
}

export default MapPage;
