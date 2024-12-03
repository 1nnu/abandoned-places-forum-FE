import {useEffect, useState} from "react";
import {LocationCategory, MapLocation} from "../../MapView/map-utils.ts";
import {LocationCondition} from "../../MapView/map-utils.ts";
import {LocationStatus} from "../../MapView/map-utils.ts";

import emitter from "../../../../../../emitter/eventEmitter.ts";

interface LocationAttributes {
    categories: LocationCategory[];
    conditions: LocationCondition[];
    statuses: LocationStatus[];
}

interface NewLocationSidebarProps {
    newLocationCoordsProps: number[] | null;
    setMapPinCursorModeInParent: (isMapPinCursorActive: boolean) => void;
    displayNewLocation: (createdLocation: MapLocation) => void;
}

function NewLocationSidebar({newLocationCoordsProps, setMapPinCursorModeInParent, displayNewLocation} : NewLocationSidebarProps) {
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


    const [locationCategories, setLocationCategories] = useState<LocationCategory[]>([]);
    const [locationStatuses, setLocationStatuses] = useState<LocationStatus[]>([]);
    const [locationConditions, setLocationConditions] = useState<LocationCondition[]>([]);
    const [newLocationFormData, setNewLocationFormData] = useState({
        name: "",
        mainCategoryId: "",
        subCategoryIds: [],
        conditionId: "",
        statusId: "",
        additionalInformation: "",
        minRequiredPointsToView: "",
    });


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewLocationFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = Array.from(e.target.selectedOptions, (option) => parseInt(option.value, 10));
        setNewLocationFormData((prevData) => ({
            ...prevData,
            subCategoryIds: options,
        }));
    };


    // Fetch dropdown menu content
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

            setLocationCategories(data.categories);
            setLocationConditions(data.conditions);
            setLocationStatuses(data.statuses);
        } catch (error) {
            emitter.emit("stopLoading");
            console.error("Error fetching conditions:", error);
        } finally {
            emitter.emit("stopLoading");
        }
    };

    // Submit form data to create location
    const handleCreateLocation = async () => {
        if (!newLocationCoords) {
            alert("Please select coordinates on the map.");
            return;
        }

        const createLocationPayload = {
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
                body: JSON.stringify(createLocationPayload),
            });

            const data = await response.json();

            if (response.ok || data !== null) {
                displayNewLocation(data);
            } else {
                const error = await response.json();
                console.error("Error creating location:", error);
                alert("Failed to create location.");
            }
        } catch (error) {
            console.error("Error creating location:", error);
            alert("Failed to create location.");
            emitter.emit("stopLoading");
        } finally {
            emitter.emit("stopLoading");
        }
    };

    useEffect(() => {
        fetchLocationAttributes();
    }, []);


    return (
        <div className="p-4 pt-20 h-full">
            <h2 className="text-lg font-bold text-white">Create new private location</h2>
            <div className="text-white bg-gray-800 p-2 rounded-lg mb-4">
                Coords: {newLocationCoords ? JSON.stringify(newLocationCoords) : "No coordinates set"}
            </div>
            <button
                onClick={toggleCoordinateSelection}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300"
            >
                Määra kaardil
            </button>

            <form>
                <input
                    type="text"
                    name="name"
                    value={newLocationFormData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className="w-full mb-4 p-2 rounded"
                />
                {locationCategories && (
                    <>
                        <select
                            name="mainCategoryId"
                            value={newLocationFormData.mainCategoryId}
                            onChange={handleInputChange}
                            className="w-full mb-4 p-2 rounded"
                        >
                            <option value="">Select Main Category</option>
                            {locationCategories.map((category: LocationCategory) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <select
                            name="subCategoryIds"
                            multiple
                            onChange={handleSubCategoryChange}
                            className="w-full mb-4 p-2 rounded"
                        >
                            {locationCategories.map((subCategory: LocationCategory) => (
                                <option key={subCategory.id} value={subCategory.id}>
                                    {subCategory.name}
                                </option>
                            ))}
                        </select>
                        <select
                            name="conditionId"
                            value={newLocationFormData.conditionId}
                            onChange={handleInputChange}
                            className="w-full mb-4 p-2 rounded"
                        >
                            <option value="">Select Condition</option>
                            {locationConditions.map((condition: LocationCondition) => (
                                <option key={condition.id} value={condition.id}>
                                    {condition.name}
                                </option>
                            ))}
                        </select>
                        <select
                            name="statusId"
                            value={newLocationFormData.statusId}
                            onChange={handleInputChange}
                            className="w-full mb-4 p-2 rounded"
                        >
                            <option value="">Select Status</option>
                            {locationStatuses.map((status: LocationStatus) => (
                                <option key={status.id} value={status.id}>
                                    {status.name}
                                </option>
                            ))}
                        </select>
                    </>
                )}
                <textarea
                    name="additionalInformation"
                    value={newLocationFormData.additionalInformation}
                    onChange={handleInputChange}
                    placeholder="Additional Information"
                    className="w-full mb-4 p-2 rounded"
                />
                <input
                    type="number"
                    name="minRequiredPointsToView"
                    value={newLocationFormData.minRequiredPointsToView}
                    onChange={handleInputChange}
                    placeholder="Minimum Points to View"
                    className="w-full mb-4 p-2 rounded"
                />
            </form>
            <button
                onClick={handleCreateLocation}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300"
            >
                Apply
            </button>
        </div>
    );
}

export default NewLocationSidebar;
