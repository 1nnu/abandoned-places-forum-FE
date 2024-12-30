import Bookmark from "./Bookmark.tsx";
import LandBoardButton from "./LandBoardButton.tsx";
import {MapLocation} from "../../utils.ts";
import LocationService from "../../../../../../service/LocationService.ts";

interface LocationDetailsSidebarProps {
    globalSelectedLocation: MapLocation;
    stopDisplayingDeletedLocation: (deletedLocationId: string) => void;
    setObliqueAeroPhotoCoords: (newObliqueAeroPhotoCoords: number[] | null) => void;
}

function LocationDetailsSidebar({
                                    globalSelectedLocation,
                                    stopDisplayingDeletedLocation,
                                    setObliqueAeroPhotoCoords
                                }: LocationDetailsSidebarProps) {

    function showLocationObliqueAeroPhoto() {
        if (globalSelectedLocation) {
            setObliqueAeroPhotoCoords([globalSelectedLocation.lat, globalSelectedLocation.lon]);
        }
    }

    function deleteSelectedLocation() {
        LocationService.deleteLocation(globalSelectedLocation.id)
            .then((isDeleted) => {
                if (isDeleted) {
                    stopDisplayingDeletedLocation(globalSelectedLocation.id);
                }
            });
    }

    return (
        <div className="flex flex-col p-8 h-full w-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-white">Details</h2>
            <div className="flex flex-col justify-start mr-auto space-y-5 w-full pt-20">
                <Bookmark locationId={globalSelectedLocation.id}/>
                <div className="flex flex-row justify-start items-end space-x-4 text-white text-2xl ">
                    <p>{globalSelectedLocation.name}</p>
                    {globalSelectedLocation.isPublic
                        ? <p className="text-sm">(Public)</p>
                        : <p className="text-sm">(Private)</p>
                    }
                </div>
                <div className="flex flex-wrap items-end gap-2 text-white">
                    <div title="Põhikategooria"
                        style={{backgroundColor: `#${globalSelectedLocation.mainCategory.colorHex}`}}
                         className="flex items-center whitespace-nowrap px-3 text-md rounded-full w-min space-x-2 h-[1.9rem] mr-2">
                        {globalSelectedLocation.mainCategory.name}
                    </div>
                    {globalSelectedLocation.subCategories.map((subcategory, index) => (
                        <div
                            title="Alamkategooria"
                            key={index}
                            style={{backgroundColor: `#${subcategory.colorHex}`,}}
                            className=" px-2.5 rounded-full flex items-center h-6 text-sm"
                        >
                            {subcategory.name}
                        </div>
                    ))}
                </div>
                <div className="flex row gap-4">
                    <button
                        className="bg-green-700 text-white py-2 px-3 rounded-sm shadow-md hover:bg-green-600
                         transition-all flex items-center space-x-2 h-7"
                        onClick={showLocationObliqueAeroPhoto}
                    >
                        Kaldaerofoto
                    </button>
                    <LandBoardButton location={globalSelectedLocation}/>
                </div>
                {globalSelectedLocation.isPublic
                    ? <p className="text-white"> Public location </p>
                    : (
                        <button
                            className="bg-red-700 text-white py-1 px-2 rounded-sm shadow-md hover:bg-red-600
                             transition-all flex items-center space-x-2 h-5"
                            onClick={deleteSelectedLocation}
                        >
                            Delete
                        </button>
                    )}
            </div>
        </div>
    );
}

export default LocationDetailsSidebar;
