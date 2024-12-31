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
        <div className="flex flex-col p-8 h-full text-white w-full overflow-y-auto">
            <h2 className="text-2xl font-bold ">Details</h2>
            <div className="flex flex-col justify-start mr-auto space-y-5 w-full pt-20">
                <Bookmark locationId={globalSelectedLocation.id}/>
                <div className="flex flex-row justify-start items-end space-x-4 text-2xl pt-5">
                    {globalSelectedLocation.isPublic
                        ?
                        <img className="w-7 pb-1" src="https://img.icons8.com/?size=100&id=152&format=png&color=FFFFFF"
                             alt="none"/>
                        :
                        <img className="w-7 pb-1" src="https://img.icons8.com/?size=100&id=2862&format=png&color=FFFFFF"
                             alt="none"/>
                    }
                    <p title={globalSelectedLocation.name}
                       className="max-w-[80%] truncate font-bold text-2xl">{globalSelectedLocation.name}</p>
                    {globalSelectedLocation.isPublic
                        ? <p className="text-sm">(Public)</p>
                        : <p className="text-sm">(Private)</p>
                    }
                </div>
                <div className="flex flex-wrap items-end gap-2 pt-3">
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
                <div className="flex flex-col pt-2">
                    <div className="flex">
                        <p className="w-[110px] text-right  mr-4">Seisukord:</p>
                        <p>{globalSelectedLocation.condition}</p>
                    </div>
                    <div className="flex pt-1">
                        <p className="w-[110px] text-right mr-4">Ligipääsetavus:</p>
                        <p>{globalSelectedLocation.status}</p>
                    </div>
                    <div className="flex pt-6">
                        {/*ml-[2.6rem] hack to keep the description in place even with longer text - needs fix when adding i18n*/}
                        <p className="ml-[2.6rem] text-right mr-3 whitespace-nowrap pt-1">Muu info:</p>
                        <p style={{
                            border: globalSelectedLocation.additionalInformation.length > 35 ? "1px solid gray" : "transparent"
                        }}
                           className="rounded-sm flex-grow text-justify leading-tight p-1.5">
                            {globalSelectedLocation.additionalInformation ? globalSelectedLocation.additionalInformation : "-"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 pt-16 mb-4">
                    <button
                        className="bg-green-700 text-white py-2 px-3 rounded-sm shadow-md hover:bg-green-600 transition-all flex items-center space-x-2 h-7"
                        onClick={showLocationObliqueAeroPhoto}
                    >
                        Kaldaerofoto
                    </button>
                    <LandBoardButton location={globalSelectedLocation}/>
                    <div className="ml-auto">
                        {!globalSelectedLocation.isPublic && (
                            <button
                                className="bg-red-700 w-min py-1 px-2 h-6 rounded-sm shadow-md hover:bg-red-600 transition-all flex items-center space-x-2"
                                onClick={deleteSelectedLocation}
                            >
                                Kustuta
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LocationDetailsSidebar;
