import Bookmark from "./Bookmark.tsx";
import LandBoardButton from "./LandBoardButton.tsx";
import {MapLocation} from "../../utils.ts";
import emitter from "../../../../../../emitter/eventEmitter.ts";

interface LocationDetailsSidebarProps {
  globalSelectedLocation: MapLocation | null;
  stopDisplayingDeletedLocation: (deletedLocationId: string) => void;
  setObliqueAeroPhotoCoords: (newObliqueAeroPhotoCoords: number[] | null) => void;
}

function LocationDetailsSidebar({globalSelectedLocation, stopDisplayingDeletedLocation, setObliqueAeroPhotoCoords}: LocationDetailsSidebarProps) {

  const API_URL = import.meta.env.VITE_API_URL;


  function showObliqueAeroPhoto() {
    if (globalSelectedLocation) {
      setObliqueAeroPhotoCoords([globalSelectedLocation.lat, globalSelectedLocation.lon]);
    }
  }


  const deleteSelectedLocation = async () => {
    if (globalSelectedLocation == null) {
      return;
    }
    try {
      emitter.emit("startLoading");
      const userToken = localStorage.getItem("userToken");

      const response = await fetch(`${API_URL}/api/locations?locationId=${globalSelectedLocation.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 204) {
        stopDisplayingDeletedLocation(globalSelectedLocation.id);
      }

    } catch (error) {
      emitter.emit("stopLoading");
      console.error("Error fetching conditions:", error);
    } finally {
      emitter.emit("stopLoading");
    }
  };

  return (
    <div className="p-8 h-full w-full">
      <h2 className="text-2xl font-bold text-white">Details</h2>
      {globalSelectedLocation != null ? (
          <div className="pt-20">
          <Bookmark locationId={globalSelectedLocation.id} />
          <div className="flex flex-col items-center space-y-4">
            <div className="text-white">
              <p>{globalSelectedLocation.name}</p>
              <p>{globalSelectedLocation.lat}</p>
              <p>{globalSelectedLocation.lon}</p>
            </div>
            <div className="flex row gap-4">
              <button
                  className="bg-green-700 text-white py-2 px-3 rounded-sm shadow-md hover:bg-green-600 transition-all
                   flex items-center space-x-2 h-7"
                  onClick={showObliqueAeroPhoto}
              >
                Kaldaerofoto
              </button>
              <LandBoardButton location={globalSelectedLocation}/>
            </div>
            {!globalSelectedLocation.isPublic ? (
                <button
                    className="bg-red-700 text-white py-1 px-2 rounded-sm shadow-md hover:bg-red-600 transition-all
                     flex items-center space-x-2 h-5"
                    onClick={deleteSelectedLocation}
                >
                  Delete
                </button>
            ) : <p className="text-white"> Public location </p>}
          </div>
        </div>
      ) : (
          <p>No location selected</p>
      )}
    </div>
  );
}

export default LocationDetailsSidebar;
