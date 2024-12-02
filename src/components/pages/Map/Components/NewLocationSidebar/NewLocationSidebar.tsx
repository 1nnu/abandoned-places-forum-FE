import {useEffect, useState} from "react";

interface NewLocationSidebarProps {
    newLocationCoords: number[];
    toggleIsSelectingNewLocationCoords: () => boolean;
}

function NewLocationSidebar({newLocationCoords, toggleIsSelectingNewLocationCoords} : NewLocationSidebarProps) {

    const [locationCoords, setLocationCoords] = useState<number[] | null>(null);
    const [isSelecting, setIsSelecting] = useState<boolean>(false);

    function toggleSelection() {
        toggleIsSelectingNewLocationCoords();
        setIsSelecting(prevState => !prevState);
    }

    useEffect(() => {
        if (newLocationCoords && isSelecting) {
            setLocationCoords(newLocationCoords);
            setIsSelecting(false);
            toggleIsSelectingNewLocationCoords();
        }
    }, [newLocationCoords]);

    return (
        <div className="p-4 pt-20 h-full">
            <h2 className="text-lg font-bold text-white">Location Details</h2>
            <div>Coords: {JSON.stringify(locationCoords)}</div>
            <button onClick={toggleSelection}>Määra kaardil</button>
        </div>
    );
}

export default NewLocationSidebar;
