import Bookmark from "./Bookmark.tsx";
import LandBoardButton from "./LandBoardButton.tsx";
import {MapLocation} from "../../utils.ts";

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
        <div className="pt-20">
          <Bookmark locationId={selectedLocation.id} />
          <div className="flex flex-col items-center space-y-4">
            <div className="text-white">
              <p>{selectedLocation.name}</p>
              <p>{selectedLocation.lat}</p>
              <p>{selectedLocation.lon}</p>
            </div>
            <div className="flex row gap-4">
              <button
                  className="bg-green-700 text-white py-2 px-3 rounded-sm shadow-md hover:bg-green-600 transition-all flex items-center space-x-2 h-7"
                  onClick={updateObliqueAeroPhotoCoords}
              >
                Kaldaerofoto
              </button>
              <LandBoardButton location={selectedLocation}/>
            </div>
          </div>
        </div>
      ) : (
          <p>No location selected</p>
      )}
    </div>
  );
}
