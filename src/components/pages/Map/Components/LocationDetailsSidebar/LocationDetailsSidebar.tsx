import { MapLocation } from "../MapView/map-utils.ts";

export default function LocationDetailsSidebar({  selectedLocation }: {
    selectedLocation: MapLocation | null;
}) {
    return (
        <div className="p-4 h-full">
            <h2 className="text-lg font-bold text-white">Location Details</h2>
            {selectedLocation ? (
                <div className="text-white">
                    <p>{selectedLocation.name}</p>
                    <p>{selectedLocation.lat}</p>
                    <p>{selectedLocation.lon}</p>
                </div>
            ) : (
                <p>No location selected</p>
            )}
        </div>
    );
}
