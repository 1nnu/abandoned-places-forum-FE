import {MutableRefObject, useState} from "react";
import {createLandBoardTileMapSource, LandBoardLayerTypes} from "../mapLayers";
import TileLayer from "ol/layer/Tile";

interface LandBoardLayerSelectorProps {
    landBoardBaseLayer: MutableRefObject<TileLayer>;
    landBoardOverlayLayer: MutableRefObject<TileLayer>;
}

function LandBoardLayerSelector({ landBoardBaseLayer, landBoardOverlayLayer }: LandBoardLayerSelectorProps) {

    const [activeLayer, setActiveLayer] = useState<LandBoardLayerTypes | null>(null);

    function handleLayerChange(layerType: LandBoardLayerTypes | null) {
        landBoardBaseLayer.current.clearRenderer();
        landBoardBaseLayer.current.setSource(null);
        landBoardOverlayLayer.current.clearRenderer();
        landBoardOverlayLayer.current.setSource(null);
        setActiveLayer(null);

        if (layerType !== activeLayer && layerType === LandBoardLayerTypes.HYBRID) {
            landBoardBaseLayer.current.setSource(createLandBoardTileMapSource(LandBoardLayerTypes.ORTOPHOTO));
            landBoardOverlayLayer.current.setSource(createLandBoardTileMapSource(LandBoardLayerTypes.HYBRID, "png"));
            setActiveLayer(LandBoardLayerTypes.HYBRID);
        } else if (layerType !== activeLayer && layerType !== null) {
            landBoardBaseLayer.current.setSource(createLandBoardTileMapSource(layerType));
            setActiveLayer(layerType);
        }
    }

    return (
        <div className="absolute bottom-4 left-4 p-4 bg-black bg-opacity-75 rounded-lg flex flex-col space-y-2">
            <button
                className={`px-4 py-2 rounded-lg text-white ${activeLayer === null ? "bg-blue-500" : "bg-gray-800"}`}
                onClick={() => handleLayerChange(null)}
            >
                {"BASE MAP ONLY"}
            </button>
            {Object.keys(LandBoardLayerTypes).map((key) => {
                const layerType = LandBoardLayerTypes[key as keyof typeof LandBoardLayerTypes];
                return (
                    <button
                        key={layerType}
                        className={`px-4 py-2 rounded-lg text-white ${
                            activeLayer === layerType ? "bg-blue-500" : "bg-gray-800"
                        }`}
                        onClick={() => handleLayerChange(layerType)}
                    >
                        {key}
                    </button>
                );
            })}
        </div>
    );
}

export default LandBoardLayerSelector;
