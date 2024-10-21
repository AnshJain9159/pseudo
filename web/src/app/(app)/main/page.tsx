/* eslint-disable @typescript-eslint/no-unused-vars */
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
  // State for the width of each resizable section
  const [notebookWidth, setNotebookWidth] = useState<number>(window.innerWidth / 3);
  const [excalidrawWidth, setExcalidrawWidth] = useState<number>(window.innerWidth / 3);
  const [chatWidth, setChatWidth] = useState<number>(window.innerWidth / 3);

  // Function to dynamically calculate the remaining width for chat
  const adjustWidths = (size: { width: number }, type: 'notebook' | 'excalidraw') => {
    const remainingWidth = window.innerWidth - size.width;
    if (type === 'notebook') {
      setExcalidrawWidth(remainingWidth / 2);
      setChatWidth(remainingWidth / 2);
    } else if (type === 'excalidraw') {
      setNotebookWidth(remainingWidth / 2);
      setChatWidth(remainingWidth / 2);
    }
  };

  return (
    <div className='flex h-screen w-full bg-slate-600'>
      {/* Resizable Notebook */}
      <ResizableBox
        width={notebookWidth}
        height={Infinity} // Allow height to grow automatically
        minConstraints={[window.innerWidth / 6, Infinity]} // Min width of 1/6th of window width
        maxConstraints={[window.innerWidth / 1.5, Infinity]} // Max width of 1.5 times the window width
        axis="x"
        onResize={(e, { size }) => {
          setNotebookWidth(size.width);
          adjustWidths(size, 'notebook');
        }}
        className="resize-box border-r border-gray-700"
        resizeHandles={['e']} // Only allow horizontal resizing
      >
        <NotebookPage />
      </ResizableBox>

      {/* Resizable Excalidraw */}
      <ResizableBox
        width={excalidrawWidth}
        height={Infinity}
        minConstraints={[window.innerWidth / 6, Infinity]}
        maxConstraints={[window.innerWidth / 1.5, Infinity]}
        axis="x"
        onResize={(e, { size }) => {
          setExcalidrawWidth(size.width);
          adjustWidths(size, 'excalidraw');
        }}
        className="resize-box border-r border-gray-700"
        resizeHandles={['e']}
      >
        <ExcalidrawWrapper />
      </ResizableBox>

      {/* ChatBox (fills the remaining space) */}
      <div
        className="flex-grow bg-slate-500"
        style={{
          width: chatWidth,
          overflowY: 'auto',
        }}
      >
        <ChatPageAlt />
      </div>
    </div>
  );
};

export default Page;
