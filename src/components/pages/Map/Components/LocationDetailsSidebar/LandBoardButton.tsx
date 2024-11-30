import { MapLocation } from "../MapView/map-utils";

interface LandBoardButtonProps {
  location: MapLocation;
}

function LandBoardButton({ location }: LandBoardButtonProps) {
  const handleClick = () => {
    const { lat, lon } = location;
    const url = `https://fotoladu.maaamet.ee/etak.php?B=${lat}&L=${lon}&fotoladu`;
    window.open(url, "_blank");
  };

  return (
      <div>
        <button
            className="bg-green-700 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition-all"
            onClick={handleClick}
        >
          Kaldaerofoto uues aknas
        </button>
      </div>

  );
}

export default LandBoardButton;
