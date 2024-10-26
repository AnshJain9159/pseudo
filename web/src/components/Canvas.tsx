/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Excalidraw, exportToSvg } from "@excalidraw/excalidraw";
import { Download } from 'lucide-react';

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
        const svg = await exportToSvg({
          elements: elements,
          appState: appState,
          files: {},
        });
        const svgString = new XMLSerializer().serializeToString(svg);

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

        const blob = await response.blob();
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
<div className="flex-grow flex flex-col items-center bg-gradient-to-b from-black to-gray-900 min-h-screen w-full py-10 px-4">      <div className="w-full flex-grow h-[80vh] bg-black rounded-lg overflow-hidden shadow-lg">
        <Excalidraw
          onChange={handleChange}
          theme="dark"
        />
      </div>
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSvgExport}
          className="bg-green-500 text-white font-medium py-2 px-4 rounded-md shadow hover:bg-gray-700 transition duration-200 flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Export SVG
        </button>
        <button
          onClick={handlePngExport}
          className="bg-green-500 text-white font-medium py-2 px-4 rounded-md shadow hover:bg-gray-700 transition duration-200 flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Export PNG
        </button>
      </div>
    </div>
  );
};

export default ExcalidrawWrapper;
