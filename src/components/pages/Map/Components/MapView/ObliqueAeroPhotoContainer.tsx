import {useEffect, useState} from 'react';

interface ObliqueAeroPhotoContainerProps {
    selectedCoords: number[] | null;
}

function ObliqueAeroPhotoContainer({ selectedCoords }: ObliqueAeroPhotoContainerProps) {

    const [iframeUrl, setIframeUrl] = useState<string>("");

    useEffect(() => {
        if (selectedCoords != null) {
            setIframeUrl(`https://fotoladu.maaamet.ee/etak.php?B=${selectedCoords[0]}&L=${selectedCoords[1]}&fotoladu`);
        } else {
            setIframeUrl("");
        }
    }, [selectedCoords]);

    return (
        <div>
            {iframeUrl != "" && (
                <div
                    id="kaldfotoETAK"
                    style={{
                        position: 'absolute',
                        width: '70vw',
                        height: '70vh',
                        borderRadius: '10px',
                        backgroundColor: '#fff',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: '10px solid #fff',
                        padding: '5px',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <iframe
                        src={iframeUrl}
                        className="w-full h-full border-2 border-white rounded-tl rounded-bl"
                    ></iframe>
                    <button
                        className="absolute -top-6 -right-6 w-8 h-8 bg-red-500 text-white font-bold rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-transform transform hover:scale-110 z-50"
                        onClick={() => setIframeUrl('')}
                    >
                        X
                    </button>
                </div>
            )};
        </div>
    );
}

export default ObliqueAeroPhotoContainer;
