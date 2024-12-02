import {MapLocation} from "../MapView/map-utils.ts";

interface NewLocationSidebarProps {
    selectedLocation: MapLocation | null;
    applyObliqueAeroPhotoCoords: (newObliqueAeroPhotoCoords: number[] | null) => void;
}

export default function NewLocationSidebar() {

    return (
        <div className="p-4 h-full">
            <h2 className="text-lg font-bold text-white">Location Details</h2>

        </div>
    );
}
