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
    <div className="w-full h-full bg-white">
      <Excalidraw
        theme="dark"
        initialData={{
          appState: {
            viewBackgroundColor: "#ffffff",
            currentItemStrokeColor: "#000000",
            currentItemBackgroundColor: "#ffffff",
          },
        }}
      />
    </div>
  );
};

export default ExcalidrawWrapper;
