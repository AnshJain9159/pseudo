'use client';
import React, { useState } from 'react';
import dynamic from "next/dynamic";
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

// Dynamically import Excalidraw with SSR disabled
const ExcalidrawWrapper = dynamic(
  async () => (await import("@/components/Canvas")).default,
  { ssr: false },
);

// Chat and notebook components
import NotebookPage from '@/components/Codepad';
import ChatPageAlt from '@/components/ChatBotAlt';

const Page: React.FC = () => {
  // State for width of the resizable components
  const [notebookWidth, setNotebookWidth] = useState(300);
  const [excalidrawWidth, setExcalidrawWidth] = useState(400);
  const [chatWidth, setChatWidth] = useState(300);

  return (
    <div className='flex flex-row h-full w-full justify-around bg-slate-600 flex-grow'>
      {/* Resizable Notebook */}
      <ResizableBox
        width={notebookWidth}
        height={Infinity} // Allow height to grow automatically
        minConstraints={[0, Infinity]} // Min width of 200px
        maxConstraints={[1000, Infinity]} // Max width of 600px
        axis="x"
        onResize={(e, { size }) => setNotebookWidth(size.width)}
        className="resize-box"
        handle={<span className="resize-handle" />} // Custom resize handle (optional)
      >
        <NotebookPage />
      </ResizableBox>

      {/* Resizable Excalidraw */}
      <ResizableBox
        width={excalidrawWidth}
        height={Infinity}
        minConstraints={[0, Infinity]}
        maxConstraints={[1000, Infinity]}
        axis="x"
        onResize={(e, { size }) => setExcalidrawWidth(size.width)}
        className="resize-box"
        handle={<span className="resize-handle" />} // Custom resize handle (optional)
      >
        <ExcalidrawWrapper />
      </ResizableBox>

      {/* ChatBox */}
      <div className="flex-grow">
        <ChatPageAlt />
      </div>
    </div>
  );
};

export default Page;
