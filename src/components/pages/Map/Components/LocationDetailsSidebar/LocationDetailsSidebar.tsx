import { MapLocation } from "../MapView/map-utils.ts";

export default function LocationDetailsSidebar({  selectedLocation }: {
    selectedLocation: MapLocation | null;
}) {
    return (
        <div
            className="fixed top-0 right-0 h-full bg-black bg-opacity-70 transition-all duration-500 ease-in-out"
            style={{
                transform: selectedLocation ? "translateX(0)" : "translateX(100%)",
                width: "400px",
            }}
        >
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
        </div>
    );
}
