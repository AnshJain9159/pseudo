// File: app/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import dynamic from "next/dynamic";
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const ExcalidrawWrapper = dynamic(
  async () => (await import("@/components/Canvas")).default,
  { ssr: false }
);

import NotebookPage from '@/components/Codepad';
import ChatPageAlt from '@/components/ChatBotAlt';

const Page: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [chatWidth, setChatWidth] = useState<number>(0);
  const [notebookWidth, setNotebookWidth] = useState<number>(0);
  const [excalidrawWidth, setExcalidrawWidth] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    // Initialize widths after mounting
    const initialWidth = window.innerWidth / 3;
    setChatWidth(initialWidth);
    setNotebookWidth(initialWidth);
    setExcalidrawWidth(initialWidth);
  }, []);

  if (!mounted) return null;

  const adjustWidths = (size: { width: number }, type: 'chat' | 'notebook') => {
    const remainingWidth = window.innerWidth - size.width;
    if (type === 'chat') {
      const halfRemaining = remainingWidth / 2;
      setNotebookWidth(halfRemaining);
      setExcalidrawWidth(halfRemaining);
    } else if (type === 'notebook') {
      const halfRemaining = remainingWidth / 2;
      setChatWidth(halfRemaining);
      setExcalidrawWidth(halfRemaining);
    }
  };

  return (
    <div className='flex h-screen w-full bg-[#191919] overflow-y-hidden' > {/* Adjust padding-top to fit the navbar height */}
      {/* Chat Section (Left) */}
      <ResizableBox
        width={chatWidth}
        height={Infinity}
        minConstraints={[window.innerWidth / 6, Infinity]}
        maxConstraints={[window.innerWidth / 1.5, Infinity]}
        axis="x"
        onResize={(e, { size }) => {
          setChatWidth(size.width);
          adjustWidths(size, 'chat');
        }}
        className="resize-box border-r border-[#2F2F2F]"
        resizeHandles={['e']}
      >
        <ChatPageAlt />
      </ResizableBox>

      {/* Code Section (Middle) */}
      <ResizableBox
        width={notebookWidth}
        height={Infinity}
        minConstraints={[window.innerWidth / 6, Infinity]}
        maxConstraints={[window.innerWidth / 1.5, Infinity]}
        axis="x"
        onResize={(e, { size }) => {
          setNotebookWidth(size.width);
          adjustWidths(size, 'notebook');
        }}
        className="resize-box border-r border-[#2F2F2F]"
        resizeHandles={['e']}
      >
        <NotebookPage />
      </ResizableBox>

      {/* Excalidraw Section (Right) */}
      <div
        className="flex-grow bg-[#191919]"
        style={{
          width: excalidrawWidth,
          overflowY: 'auto',
        }}
      >
        <ExcalidrawWrapper />
      </div>
    </div>
  );
};

export default Page;
