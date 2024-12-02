import {useEffect, useState} from "react";

interface NewLocationSidebarProps {
    newLocationCoordsProps: number[] | null;
    setParentMapPinCursorState: (isMapPinCursorActive: boolean) => void;
}

function NewLocationSidebar({newLocationCoordsProps, setParentMapPinCursorState} : NewLocationSidebarProps) {

    const [newLocationCoords, setNewLocationCoords] = useState<number[] | null>(null);
    const [isCoordinateSelectionActive, setIsCoordinateSelectionActive] = useState<boolean>(false);

    function toggleCoordinateSelection() {
        if (isCoordinateSelectionActive) {
            setParentMapPinCursorState(false);
            setIsCoordinateSelectionActive(false);
        } else {
            setParentMapPinCursorState(true);
            setIsCoordinateSelectionActive(true);
        }
    }

    useEffect(() => {
        if (isCoordinateSelectionActive && newLocationCoordsProps) {
            setIsCoordinateSelectionActive(false);
            setParentMapPinCursorState(false);
            setNewLocationCoords(newLocationCoordsProps);
        }
    }, [newLocationCoordsProps]);

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
        </div>
    );
}

export default NewLocationSidebar;
