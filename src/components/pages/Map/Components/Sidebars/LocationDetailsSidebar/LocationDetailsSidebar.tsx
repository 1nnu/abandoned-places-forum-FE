import Bookmark from "./Bookmark.tsx";
import LandBoardButton from "./LandBoardButton.tsx";
import {MapLocation} from "../../utils.ts";
import LocationService from "../../../../../../service/LocationService.ts";
import {useEffect, useState} from "react";
import EditSelectedLocation from "./Editing/EditSelectedLocation.tsx";

interface LocationDetailsSidebarProps {
    globalSelectedLocation: MapLocation;
    stopDisplayingLocation: (deletedLocationId: string) => void;
    displayEditedLocation: (
        createdLocation: MapLocation,
        selectOnMap: boolean
    ) => void;
    setObliqueAeroPhotoCoords: (newObliqueAeroPhotoCoords: number[] | null) => void;
}

function LocationDetailsSidebar({
                                    globalSelectedLocation,
                                    stopDisplayingLocation,
    displayEditedLocation,
                                    setObliqueAeroPhotoCoords
                                }: LocationDetailsSidebarProps) {

    const [isEditingActive, setIsEditingActive] = useState<boolean>(false);
    const cancelEditing = () => {
        setIsEditingActive(false);
    };

    function showLocationObliqueAeroPhoto() {
        if (globalSelectedLocation) {
            setObliqueAeroPhotoCoords([globalSelectedLocation.lat, globalSelectedLocation.lon]);
        }
    }

    function deleteSelectedLocation() {
        LocationService.deleteLocation(globalSelectedLocation.id)
            .then((isDeleted) => {
                if (isDeleted) {
                    stopDisplayingLocation(globalSelectedLocation.id);
                }
            });
    }

    useEffect(() => {
        setIsEditingActive(false);
    }, [globalSelectedLocation]);

    //TODO Divide into subcomponents in the future
    return (
        <div className="flex flex-col w-full h-full overflow-y-auto">
            {isEditingActive
                ? <EditSelectedLocation
                    globalSelectedLocation={globalSelectedLocation}
                    stopDisplayingLocation={stopDisplayingLocation}
                    displayEditedLocation={displayEditedLocation}
                    stopEditing={cancelEditing}
                />
                : (
                    <div className="flex flex-col w-full h-full overflow-y-auto">
                        <div
                            className="relative w-full
                 bg-[url('https://s.abcnews.com/images/Lifestyle/HT_abandoned_places_prison2_jef_140620_17x12_1600.jpg?w=1600')]
                  bg-cover bg-no-repeat text-white border-b-2 border-black min-h-72"
                        >
                            <div className="p-8 pl-6">
                                <div className="flex flex-row gap-3">
                                    <div
                                        className="inline-flex items-center space-x-3 bg-opacity-85 bg-black text-white rounded-md py-1.5 pl-2 pr-3"
                                    >
                                        {globalSelectedLocation.isPublic ? (
                                            <img
                                                className="w-6 pb-0.5"
                                                src="https://img.icons8.com/?size=100&id=152&format=png&color=FFFFFF"
                                                alt="none"
                                            />
                                        ) : (
                                            <img
                                                className="w-6 pb-0.5"
                                                src="https://img.icons8.com/?size=100&id=2862&format=png&color=FFFFFF"
                                                alt="none"
                                            />
                                        )}
                                        {globalSelectedLocation.isPublic ? (
                                            <div>Avalik</div>
                                        ) : (
                                            <div>Privaatne</div>
                                        )}
                                    </div>
                                    <div className="">
                                        {globalSelectedLocation.isPublic ? (
                                            <div></div>
                                        ) : (
                                            <div className="bg-black bg-opacity-85 text-white border-2 border-transparent rounded-md
                                 p-1.5 px-2 items-center space-x-3 font-bold hover:border-white">Avalikusta</div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col pt-3 pl-2">
                                    <Bookmark locationId={globalSelectedLocation.id}/>
                                    {/*bookmark placeholder*/}
                                    <div
                                        className="w-5 h-5 bg-black mt-2 flex items-center justify-center text-white text-xs">
                                        ph
                                    </div>
                                </div>
                                <div className="absolute bottom-2 left-6">
                                    <button
                                        className="bg-black bg-opacity-85 text-white py-1 px-3 rounded-md hover:bg-opacity-75">
                                        Vaata postitusi (13)
                                    </button>
                                </div>
                                <div className="absolute bottom-2 right-6">
                                    <button
                                        className="bg-black bg-opacity-85 text-white py-1 px-3 rounded-md hover:bg-opacity-75">
                                        Lisa postitus +
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col p-8 pt-6 h-full text-white w-full space-y-5">
                            <div className="flex flex-col justify-start mr-auto space-y-5 w-full">
                                <div className="flex justify-start items-end space-x-4 text-2xl">
                                    <p title={globalSelectedLocation.name}
                                       className="flex flex-wrap font-bold text-2xl">
                                        {globalSelectedLocation.name}
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-end gap-2">
                                    <div title="Põhikategooria"
                                         style={{backgroundColor: `#${globalSelectedLocation.mainCategory.colorHex}`}}
                                         className="flex items-center whitespace-nowrap px-3 pb-0.5 text-md rounded-full w-min space-x-2 h-[1.9rem] mr-2">
                                        {globalSelectedLocation.mainCategory.name}
                                    </div>
                                    {globalSelectedLocation.subCategories.map((subcategory, index) => (
                                        <div
                                            title="Alamkategooria"
                                            key={index}
                                            style={{backgroundColor: `#${subcategory.colorHex}`,}}
                                            className=" px-2.5 pb-0.5 rounded-full flex items-center h-6 text-sm"
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
                                    <div className="flex flex-row pt-6">
                                        <p className="w-[110px] text-right mr-3 whitespace-nowrap pt-1">Muu info:</p>
                                        <p style={{
                                            border: globalSelectedLocation.additionalInformation.length > 35 ? "1px solid gray" : "transparent"
                                        }}
                                           className="rounded-sm flex-grow text-justify leading-tight p-2 pt-1">
                                            {globalSelectedLocation.additionalInformation ? globalSelectedLocation.additionalInformation : "-"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mb-4 pt-3">
                                    <button
                                        className="bg-green-700 text-white py-2 px-3 rounded-sm shadow-md hover:bg-green-600 transition-all flex items-center space-x-2 h-7"
                                        onClick={showLocationObliqueAeroPhoto}
                                    >
                                        Kaldaerofoto
                                    </button>
                                    <LandBoardButton location={globalSelectedLocation}/>
                                    <div className="pl-3">
                                        {!globalSelectedLocation.isPublic && (
                                            <button
                                                className="bg-blue-700 pr-2 py-1 px-2 h-6 rounded-sm shadow-md hover:bg-blue-600 transition-all flex items-center space-x-2"
                                                onClick={() => {
                                                    setIsEditingActive(true)
                                                }}
                                            >
                                                <div>Muuda</div>
                                                <img
                                                    src="https://img.icons8.com/?size=100&id=86376&format=png&color=FFFFFF"
                                                    className="w-4 h-4"
                                                    alt="Edit"
                                                />
                                            </button>
                                        )}
                                    </div>
                                    <div>
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
                    </div>
                )}
        </div>
    );
}

export default LocationDetailsSidebar;
