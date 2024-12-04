import {useEffect, useState} from "react";
import {LocationCategory, LocationCondition, LocationStatus, MapLocation} from "../../MapView/map-utils.ts";
import Select from 'react-select';
import emitter from "../../../../../../emitter/eventEmitter.ts";

interface LocationAttributes {
    categories: LocationCategory[];
    conditions: LocationCondition[];
    statuses: LocationStatus[];
}

interface NewLocationSidebarProps {
    newLocationCoordsProps: number[] | null;
    setMapPinCursorModeInParent: (isMapPinCursorActive: boolean) => void;
    displayCreatedLocation: (createdLocation: MapLocation) => void;
}

interface LocationCreateDto {
    name: string;
    lon: number;
    lat: number;
    mainCategoryId: number | null;
    subCategoryIds: number[];
    conditionId: number | null;
    statusId: number | null;
    additionalInformation: string;
}

interface NewLocationFormData {
    name: string;
    mainCategoryId: number | null;
    subCategoryIds: number[];
    conditionId: number | null;
    statusId: number | null;
    additionalInformation: string;
}

interface LocationAttributeFormOptions {
    label: string,
    value : number,
}


function NewLocationSidebar({newLocationCoordsProps, setMapPinCursorModeInParent, displayCreatedLocation} : NewLocationSidebarProps) {
    const API_URL = import.meta.env.VITE_API_URL;


    const [newLocationCoords, setNewLocationCoords] = useState<number[] | null>(null);
    const [isCoordinateSelectionActive, setIsCoordinateSelectionActive] = useState<boolean>(false);
    function toggleCoordinateSelection() {
        if (isCoordinateSelectionActive) {
            setMapPinCursorModeInParent(false);
            setIsCoordinateSelectionActive(false);
        } else {
            setMapPinCursorModeInParent(true);
            setIsCoordinateSelectionActive(true);
        }
    }
    useEffect(() => {
        if (isCoordinateSelectionActive && newLocationCoordsProps) {
            setIsCoordinateSelectionActive(false);
            setMapPinCursorModeInParent(false);
            setNewLocationCoords(newLocationCoordsProps);
        }
    }, [newLocationCoordsProps]);


    const [locationCategories, setLocationCategories] = useState<LocationAttributeFormOptions[]>([]);
    const [locationConditions, setLocationConditions] = useState<LocationAttributeFormOptions[]>([]);
    const [locationStatuses, setLocationStatuses] = useState<LocationAttributeFormOptions[]>([]);
    const fetchLocationAttributes = async () => {
        try {
            emitter.emit("startLoading");
            const userToken = localStorage.getItem("userToken");

            const response = await fetch(`${API_URL}/api/locations/attributes`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    "Content-Type": "application/json",
                },
            });

            const data: LocationAttributes = await response.json();

            setLocationCategories(data.categories.map((category): LocationAttributeFormOptions => ({
                value: category.id,
                label: category.name,
            })));
            setLocationConditions(data.conditions.map((condition): LocationAttributeFormOptions => ({
                value: condition.id,
                label: condition.name,
            })));
            setLocationStatuses(data.statuses.map((status): LocationAttributeFormOptions => ({
                value: status.id,
                label: status.name,
            })));

        } catch (error) {
            emitter.emit("stopLoading");
            console.error("Error fetching conditions:", error);
        } finally {
            emitter.emit("stopLoading");
        }
    };


    const [newLocationFormData , setNewLocationFormData] = useState<NewLocationFormData>({
        name: "",
        mainCategoryId: null,
        subCategoryIds: [],
        conditionId: null,
        statusId: null,
        additionalInformation: ""
    });


    const handleMainCategoryChange = (selectedOption) => {
        setNewLocationFormData((prevData) => ({
            ...prevData,
            mainCategoryId: selectedOption ? selectedOption.value : null,
        }));
        setNewLocationFormData((prevData) => ({
            ...prevData,
            subCategoryIds: prevData.subCategoryIds.filter(id => id !== (selectedOption?.value || null)),
        }));
    };
    const handleSubCategoryChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map((option) => option.value)
        setNewLocationFormData((prevData) => ({
            ...prevData,
            subCategoryIds: selectedIds,
        }));
    };
    const handleConditionChange = (selectedOption) => {
        setNewLocationFormData((prevData) => ({
            ...prevData,
            conditionId: selectedOption ? selectedOption.value : null,
        }));
    };
    const handleStatusChange = (selectedOption) => {
        setNewLocationFormData((prevData) => ({
            ...prevData,
            statusId: selectedOption ? selectedOption.value : null,
        }));
    };


    const createNewLocation = async () => {
        setIsCoordinateSelectionActive(false);
        setMapPinCursorModeInParent(false);

        if (!newLocationCoords || newLocationFormData.name.length < 4
            || newLocationFormData.mainCategoryId == null
            || newLocationFormData.conditionId == null
            || newLocationFormData.statusId == null) {
            alert("Fill all required fields.");
            return;
        }

        const newLocationPayload: LocationCreateDto = {
            ...newLocationFormData,
            lat: newLocationCoords[0],
            lon: newLocationCoords[1],
        };

        try {
            emitter.emit("startLoading");
            const userToken = localStorage.getItem("userToken");

            const response = await fetch(`${API_URL}/api/locations`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newLocationPayload),
            });

            const data: MapLocation = await response.json();

            if (response.ok) {
                displayCreatedLocation(data);
            } else {
                alert(data);
                console.error("Error creating location:", data.toString());
            }
        } catch (error) {
            console.error("Error creating location:", error);
            alert("Failed to create location."); // TODO replace with toast
        } finally {
            emitter.emit("stopLoading");
        }
    };

    useEffect(() => {
        fetchLocationAttributes();
    }, []);


    return (
        <div className="flex flex-col p-12 pt-12 h-full w-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-white">Lisa privaatsele kaardile</h2>
            <div className="flex flex-col gap-3 text-white pt-8 rounded-lg mb-5">
                <div className="flex flex-col items-start gap-x-4 gap-y-2">
                    <span>Asukoht: *</span>
                    <span>
                        {newLocationCoords ? (
                            <>
                                <span className="mr-3">{newLocationCoords[0].toFixed(6)}</span>
                                <span>{newLocationCoords[1].toFixed(6)}</span>
                            </>
                        ) : (
                            "-"
                        )}
                    </span>
                </div>
                <button
                    onClick={toggleCoordinateSelection}
                    className={`flex flex-row items-center text-white border-2 bg-black justify-center px-2 py-1 max-w-40 rounded transition-all duration-200 ${
                        isCoordinateSelectionActive
                            ? "border-white"
                            : "border-black"
                    }`}
                >
                    <span>Määra kaardil</span>
                    <img
                        src="https://img.icons8.com/?size=100&id=85353&format=png&color=FFFFFF"
                        className="w-5 h-5 ml-1 transition-none"
                        alt="New Location Icon"
                    />
                </button>
            </div>
            <form className="text-white pt-4">
                Nimi: *
                <input
                    type="text"
                    name="name"
                    value={newLocationFormData.name}
                    onChange={(e) =>
                        setNewLocationFormData((prevData): NewLocationFormData => ({
                            ...prevData, name: e.target.value,
                        }))
                    }
                    placeholder="Asukoht_1"
                    className="w-full mb-3 p-2 rounded text-black"
                />
                {locationCategories && (
                    <>
                        Põhikategooria: *
                        <Select
                            options={locationCategories}
                            value={locationCategories.find(option => option.value === newLocationFormData.mainCategoryId) || null}
                            onChange={handleMainCategoryChange}
                            className="text-black mb-3"
                            placeholder="-"
                            isClearable
                        />
                        Alamkategooriad (max 5):
                        <Select
                            options={locationCategories.filter(option => option.value !== newLocationFormData.mainCategoryId)}
                            value={locationCategories.filter(option =>
                                newLocationFormData.subCategoryIds.includes(option.value)
                            )}
                            isMulti
                            className="text-black mb-3"
                            onChange={handleSubCategoryChange}
                            placeholder=""
                        />
                        Seisukord: *
                        <Select
                            options={locationConditions}
                            value={locationConditions.find(option => option.value === newLocationFormData.conditionId) || null}
                            onChange={handleConditionChange}
                            className="text-black mb-3"
                            placeholder="-"
                            isClearable
                        />
                        Ligipääsetavus: *
                        <Select
                            options={locationStatuses}
                            value={locationStatuses.find(option => option.value === newLocationFormData.statusId) || null}
                            onChange={handleStatusChange}
                            className="text-black mb-3"
                            placeholder="-"
                            isClearable
                        />
                    </>
                )}
                Lisainfo:
                <textarea
                    name="additionalInformation"
                    value={newLocationFormData.additionalInformation}
                    onChange={(e) =>
                        setNewLocationFormData((prevData): NewLocationFormData => ({
                            ...prevData, additionalInformation: e.target.value,
                        }))
                    }
                    className="w-full text-black mb-10 rounded h-12"
                />
            </form>
            <div className="flex justify-center">
                <button
                    onClick={createNewLocation}
                    className="w-full bg-black text-white px-4 py-1 rounded border-2 border-black hover:border-white"
                >
                    Lisa
                </button>
            </div>
        </div>
    );
}

export default NewLocationSidebar;
