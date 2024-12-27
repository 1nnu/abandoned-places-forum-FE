import { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../../../ui/alert-dialog";
import { Button } from "../../../../ui/button";
import MapAddLocation from "./MapAddLocation";
import ObliqueAeroPhotoContainer from "../../../Map/Components/ObliqueAeroPhoto/ObliqueAeroPhotoContainer";

interface AddLocationDialogProps {
  setSelectedLocation: (location: number[]) => void;
}

export default function AddLocationDialog({
  setSelectedLocation,
}: AddLocationDialogProps) {
  const [newLocationCoords, setNewLocationCoords] = useState<number[]>([]);
  const [obliqueAeroPhotoCoords, setObliqueAeroPhotoCoords] = useState<
    number[] | null
  >(null);

  const handleObliqueAeroPhotoCoords = (
    newObliqueAeroPhotoCoords: number[] | null
  ) => {
    setObliqueAeroPhotoCoords(newObliqueAeroPhotoCoords);
  };

  const handleMapClickCoords = (mapClickCoords: number[]) => {
    setNewLocationCoords(mapClickCoords);
    console.log("Clicked location:", mapClickCoords);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-white border border-blue-600 text-blue-700 hover:bg-blue-50">
          Add location
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="h-w-screen-xl h-full w-full max-w-screen-xl flex flex-col">
        <MapAddLocation
          applyNewLocationCoords={handleMapClickCoords}
          applyObliqueAeroPhotoCoords={handleObliqueAeroPhotoCoords}
        />
        <ObliqueAeroPhotoContainer
          selectedCoords={obliqueAeroPhotoCoords}
          isSidebarOpen={false}
        />
        <AlertDialogFooter className="h-fit w-full flex flex-row justify-between sm:justify-between items-center">
          <p>
            Selected location: {newLocationCoords[0]}; {newLocationCoords[1]}
          </p>
          <div className="flex gap-x-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setSelectedLocation(newLocationCoords)}
              >
                Submit
              </Button>
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
