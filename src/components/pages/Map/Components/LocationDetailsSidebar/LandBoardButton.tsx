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

  return <button onClick={handleClick}>Maa-ameti kaldaerofoto</button>;
}

export default LandBoardButton;
