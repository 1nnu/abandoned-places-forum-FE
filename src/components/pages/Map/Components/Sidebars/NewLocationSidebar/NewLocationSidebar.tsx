import {useEffect, useRef, useState} from "react";
import Select, {MultiValue} from 'react-select';
import emitter from "../../../../../../emitter/eventEmitter.ts";
import {
    LocationAttributeFormOptions,
    LocationAttributes,
    LocationCreateDto,
    MapLocation,
    NewLocationFormData,
    LocationAttributesState,
} from "../../utils.ts";
import {createLocation, fetchLocationAttributes} from "../../../../../../service/LocationService.ts";

interface NewLocationSidebarProps {
    newLocationCoordsProps: number[] | null;
    setMapPinCursorModeInParent: (isMapPinCursorActive: boolean) => void;
    displayCreatedLocation: (createdLocation: MapLocation) => void;
}

const DEFAULT_NAME = "Asukoht_1";

const DEFAULT_CATEGORY_ID = 0;
const DEFAULT_CONDITION_ID = 0;
const DEFAULT_STATUS_ID = 0;

const DEFAULT_FORM_DATA: NewLocationFormData = {
    name: DEFAULT_NAME,
    mainCategoryId: null,
    subCategoryIds: [],
    conditionId: null,
    statusId: null,
    additionalInformation: ""
};


function NewLocationSidebar({
                                newLocationCoordsProps,
                                setMapPinCursorModeInParent,
                                displayCreatedLocation
                            }: NewLocationSidebarProps) {

    const [newLocationCoords, setNewLocationCoords] = useState<number[] | null>(null);
    const [isCoordinateSelectionActive, setIsCoordinateSelectionActive] = useState<boolean>(false);

    function toggleCoordinateSelection() {
        setIsCoordinateSelectionActive(!isCoordinateSelectionActive);
        setMapPinCursorModeInParent(!isCoordinateSelectionActive);
    }

    useEffect(() => {
        if (isCoordinateSelectionActive && newLocationCoordsProps) {
            setIsCoordinateSelectionActive(false);
            setMapPinCursorModeInParent(false);
            setNewLocationCoords(newLocationCoordsProps);
        }
    }, [newLocationCoordsProps]);


    const [locationAttributes, setLocationAttributes] = useState<LocationAttributesState>({
        categories: [] as LocationAttributeFormOptions[],
        conditions: [] as LocationAttributeFormOptions[],
        statuses: [] as LocationAttributeFormOptions[]
    });
    const mapLocationAttributes = (data: LocationAttributes) => ({
        categories: data.categories.map((category): LocationAttributeFormOptions => ({
            value: category.id,
            label: category.name
        })),
        conditions: data.conditions.map((condition): LocationAttributeFormOptions => ({
            value: condition.id,
            label: condition.name
        })),
        statuses: data.statuses.map((status): LocationAttributeFormOptions => ({
            value: status.id,
            label: status.name
        }))
    });
    useEffect(() => {
        function loadLocationAttributes() {
            emitter.emit("startLoading");
            fetchLocationAttributes().then((data: LocationAttributes) => {
                if (data) {
                    setLocationAttributes(mapLocationAttributes(data));
                }
            });
        }
        loadLocationAttributes();
    }, []);
    useEffect(() => {
        if (locationAttributes.categories.length > 0) {
            setDefaultFormData();
        }
    }, [locationAttributes]);


    const [newLocationFormData, setNewLocationFormData] = useState<NewLocationFormData>(DEFAULT_FORM_DATA);

    function setDefaultFormData() {
        handleMainCategoryChange(locationAttributes.categories[DEFAULT_CATEGORY_ID])
        handleConditionChange(locationAttributes.conditions[DEFAULT_CONDITION_ID])
        handleStatusChange(locationAttributes.statuses[DEFAULT_STATUS_ID])
    }

    function resetFormData() {
        setNewLocationCoords(null);
        setNewLocationFormData(DEFAULT_FORM_DATA);
    }


    const nameInputRef = useRef<HTMLInputElement>({} as HTMLInputElement);

    const autoSelectFormDefaultName = () => {
        if (nameInputRef.current && nameInputRef.current?.value === DEFAULT_NAME) {
            nameInputRef.current?.focus();
            nameInputRef.current?.setSelectionRange(0, nameInputRef.current.value.length);
        }
    };


    const handleMainCategoryChange = (selectedOption: LocationAttributeFormOptions | null) => {
        setNewLocationFormData((prevData) => ({
            ...prevData,
            mainCategoryId: selectedOption ? selectedOption.value : null,
        }));
        // remove duplicate subCategories
        setNewLocationFormData((prevData) => ({
            ...prevData,
            subCategoryIds: prevData.subCategoryIds.filter(id => id !== (selectedOption?.value || null)),
        }));
    };
    const handleSubCategoryChange = (selectedOptions: MultiValue<LocationAttributeFormOptions>) => {
        const selectedIds = selectedOptions.map((option) => option.value)
        setNewLocationFormData((prevData) => ({
            ...prevData,
            subCategoryIds: selectedIds,
        }));
    };
    const handleConditionChange = (selectedOption: LocationAttributeFormOptions | null) => {
        setNewLocationFormData((prevData) => ({
            ...prevData,
            conditionId: selectedOption ? selectedOption.value : null,
        }));
    };
    const handleStatusChange = (selectedOption: LocationAttributeFormOptions | null) => {
        setNewLocationFormData((prevData) => ({
            ...prevData,
            statusId: selectedOption ? selectedOption.value : null,
        }));
    };


    function isFormDataValid(): string | null {
        if (!newLocationCoords) return "Coordinates are required.";
        if (newLocationFormData.name.length < 4) return "Name must be at least 4 characters long.";
        if (newLocationFormData.mainCategoryId == null) return "Main category is required.";
        if (newLocationFormData.conditionId == null) return "Condition is required.";
        if (newLocationFormData.statusId == null) return "Status is required.";
        return null;
    }

    function createNewLocationPayload(): LocationCreateDto {
        return {
            ...newLocationFormData,
            lat: newLocationCoords[0],
            lon: newLocationCoords[1],
        };
    }


    const createNewLocation = async () => {
        setIsCoordinateSelectionActive(false);
        setMapPinCursorModeInParent(false);

        const validationError = isFormDataValid();
        if (validationError) {
            alert(validationError);
            return;
        }

        const newLocationPayload = createNewLocationPayload();
        createLocation(newLocationPayload).then((data: MapLocation | null) => {
            if (data) {
                displayCreatedLocation(data);
                resetFormData();
                setDefaultFormData();
            }
        });
    };


    return (
        // TODO improve scalability on "short" laptop screens
        // TODO split into smaller components
        <div className="flex flex-col p-12 h-full w-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-white">Lisa privaatsele kaardile</h2>
            <div className="flex flex-col gap-3 text-white pt-8 rounded-lg mb-2">
                <div className="flex flex-col gap-2">
                    <span>Koordinaadid: *</span>
                    <div className="flex items-center gap-x-8">
                        <span>
                            {newLocationCoords ? (
                                <>
                                    <span className="mr-3">{newLocationCoords[0].toFixed(6)}</span>
                                    <span>{newLocationCoords[1].toFixed(6)}</span>
                                </>
                            ) : (
                                "B: - L: -"
                            )}
                        </span>
                        <button
                            onClick={toggleCoordinateSelection}
                            className={`flex flex-row items-center text-white border-2 bg-black justify-center px-2 py-1
                             max-w-40 rounded transition-all duration-200
                             ${isCoordinateSelectionActive
                                ? "border-white cursor-map-pin"
                                : "border-black"}
                             `}
                        >
                            <span>Määra kaardil</span>
                            <img
                                src="https://img.icons8.com/?size=100&id=85353&format=png&color=FFFFFF"
                                className="w-5 h-5 ml-1 transition-none"
                                alt="New Location Icon"
                            />
                        </button>
                    </div>
                </div>
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
                    className="w-full mb-3 p-2 rounded text-black h-9"
                    ref={nameInputRef}
                    onClick={autoSelectFormDefaultName}
                />
                {locationAttributes.categories && (
                    <>
                        Põhikategooria: *
                        <Select
                            options={locationAttributes.categories}
                            value={locationAttributes.categories.find(option =>
                                option.value === newLocationFormData.mainCategoryId) || null}
                            onChange={handleMainCategoryChange}
                            className="text-black mb-3"
                            placeholder="-"
                            isClearable
                        />
                        Alamkategooriad (max 5):
                        <Select
                            options={locationAttributes.categories.filter(option =>
                                option.value !== newLocationFormData.mainCategoryId)}
                            value={locationAttributes.categories.filter(option =>
                                newLocationFormData.subCategoryIds.includes(option.value)
                            )}
                            isMulti
                            className="text-black mb-3"
                            onChange={handleSubCategoryChange}
                            placeholder=""
                        />
                        Seisukord: *
                        <Select
                            options={locationAttributes.conditions}
                            value={locationAttributes.conditions.find(option =>
                                option.value === newLocationFormData.conditionId) || null}
                            onChange={handleConditionChange}
                            className="text-black mb-3"
                            placeholder="-"
                            isClearable
                        />
                        Ligipääsetavus: *
                        <Select
                            options={locationAttributes.statuses}
                            value={locationAttributes.statuses.find(option =>
                                option.value === newLocationFormData.statusId) || null}
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
                    className="w-full text-black mb-10 rounded h-12 p-0.5 overflow-auto"
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
