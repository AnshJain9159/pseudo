/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Excalidraw } from "@excalidraw/excalidraw";

const ExcalidrawWrapper: React.FC = () => {
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
