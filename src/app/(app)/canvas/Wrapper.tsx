/* eslint-disable @typescript-eslint/no-explicit-any */
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

  const handleSvgExport = async () => {
    if (elements.length > 0 && appState) {
      const svg = await exportToSvg({
        elements: elements,
        appState: appState,
        files: {},
      });
      const svgString = new XMLSerializer().serializeToString(svg);
      
      // Download as SVG
      const link = document.createElement("a");
      link.href = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
      link.download = "excalidraw-image.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePngExport = async () => {
    if (elements.length > 0 && appState) {
      try {
        // Get SVG data
        const svg = await exportToSvg({
          elements: elements,
          appState: appState,
          files: {},
        });
        const svgString = new XMLSerializer().serializeToString(svg);

        // Send SVG to conversion API
        const response = await fetch('/api/convert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ svg: svgString }),
        });

        if (!response.ok) {
          throw new Error('Failed to convert image');
        }

        // Get blob from response
        const blob = await response.blob();

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'excalidraw-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error exporting PNG:', error);
        alert('Failed to export PNG. Please try again.');
      }
    }
  };

  return (
    <div>
      <div 
        style={{ height: "500px", width: "500px" }} 
        className="min-h-screen flex justify-center items-center mx-auto py-10"
      >
        <Excalidraw onChange={handleChange}/>
      </div>
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleSvgExport}
          className="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-blue-600 transition duration-200"
        >
          Export as SVG
        </button>
        <button
          onClick={handlePngExport}
          className="mt-4 bg-green-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-green-600 transition duration-200"
        >
          Export as PNG
        </button>
      </div>
    </div>
  );
};

export default ExcalidrawWrapper;