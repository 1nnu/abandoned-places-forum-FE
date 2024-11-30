import {MapLocation} from "../MapView/map-utils.ts";
import Bookmark from "./Bookmark.tsx";
import LandBoardButton from "./LandBoardButton.tsx";

interface LocationDetailsSidebarProps {
  selectedLocation: MapLocation | null;
  applyObliqueAeroPhotoCoords: (newObliqueAeroPhotoCoords: number[] | null) => void;
}

export default function LocationDetailsSidebar({selectedLocation, applyObliqueAeroPhotoCoords}: LocationDetailsSidebarProps) {

  const updateObliqueAeroPhotoCoords = () => {
    if (selectedLocation) {
      applyObliqueAeroPhotoCoords([selectedLocation.lat, selectedLocation.lon]);
    }
  };

  return (
    <div className="p-4 h-full">
      <h2 className="text-lg font-bold text-white">Location Details</h2>
      {selectedLocation != null ? (
        <div className="flex flex-col items-start pt-6 space-y-4">
          <div className="text-white">
            <p>{selectedLocation.name}</p>
            <p>{selectedLocation.lat}</p>
            <p>{selectedLocation.lon}</p>
          </div>
          <Bookmark locationId={selectedLocation.id} />
          <LandBoardButton location={selectedLocation} />
          <button
              className="bg-green-700 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition-all"
              onClick={updateObliqueAeroPhotoCoords}
          >
            Kaldaerofoto samas aknas
          </button>
        </div>
      ) : (
        <p>No location selected</p>
      )}
    </div>
  );
}
