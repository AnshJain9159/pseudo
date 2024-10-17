"use client";
import { Excalidraw, exportToSvg } from "@excalidraw/excalidraw";
import { useState } from "react";

const ExcalidrawWrapper: React.FC = () => {

  const [elements, setElements] = useState<any[]>([]);
  const [appState, setAppState] = useState<any>(null);

  const handleChange = (newElements: any[], newAppState: any) => {
    setElements(newElements);
    setAppState(newAppState);
  };

  const handleExport = async () => {
    if (elements.length > 0 && appState) {
      const svg = await exportToSvg({
        elements: elements,
        appState: appState,
        files: {}, // Empty 'files' object as required
      });

      // Convert the SVG element to a string
      const svgString = new XMLSerializer().serializeToString(svg);

      // Create a download link for the SVG file
      const link = document.createElement("a");
      link.href = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
      link.download = "excalidraw-image.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <div style={{ height: "500px", width: "500px" }} className="min-h-screen flex justify-center items-center mx-auto py-10">
        <Excalidraw onChange={handleChange}/>
      </div>
      <button 
  onClick={handleExport} 
  className="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-blue-600 transition duration-200"
>
  Export as SVG
</button>
    </div>
  );
};

export default ExcalidrawWrapper;
