import { useEffect, useState } from "react";

interface ObliqueAeroPhotoContainerProps {
  selectedCoords: number[] | null;
  isSidebarOpen: boolean;
}

function ObliqueAeroPhotoContainer({
  selectedCoords,
  isSidebarOpen,
}: ObliqueAeroPhotoContainerProps) {
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCoords != null) {
      setIframeUrl(
        `https://fotoladu.maaamet.ee/etak.php?B=${selectedCoords[0]}&L=${selectedCoords[1]}&fotoladu`
      );
    } else {
      setIframeUrl(null);
    }
  }, [selectedCoords]);

  return (
    <div>
      {iframeUrl != null && (
        <div
          className="absolute p-0.5 bg-white rounded-lg z-50"
          style={{
            width: isSidebarOpen ? "50vw" : "70vw",
            height: "75vh",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "10px solid #fff",
            top: "50%",
            left: isSidebarOpen ? "calc(50% - 300px)" : "50%",
            transform: "translate(-50%, -50%)",
            transition: "width 0.5s ease, left 0.5s ease",
          }}
        >
          <iframe
            src={iframeUrl}
            className="w-full h-full border-2 border-white rounded-tl rounded-bl"
          ></iframe>
          <button
            className="
                        absolute -top-6 -right-6 w-8 h-8 bg-red-500 rounded-full shadow-lg
                         flex items-center justify-center text-white font-bold cursor-pointer
                          transition-transform transform hover:scale-110 z-50"
            onClick={() => setIframeUrl(null)}
          >
            X
          </button>
        </div>
      )}
    </div>
  );
}

export default ObliqueAeroPhotoContainer;
