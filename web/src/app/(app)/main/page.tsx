/* eslint-disable @typescript-eslint/no-unused-vars */
// File: app/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Code2, PenTool, Bot, ArrowLeft } from 'lucide-react';
import type { ResizeCallback } from 're-resizable';
import { Resizable } from 're-resizable';
import Link from 'next/link';
import NotebookPage from '@/components/Codepad';
import ChatPage from '@/components/ChatBotAlt';

const ExcalidrawWrapper = dynamic(
  async () => (await import('@/components/Canvas')).default,
  { ssr: false }
);

interface ResizeData {
  width: number;
  height: number;
}

const Page: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [leftWidth, setLeftWidth] = useState('45%');
  const [topHeight, setTopHeight] = useState('50%');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLeftResize: ResizeCallback = (e, direction, ref, d: ResizeData) => {
    const parentWidth = ref.parentElement!.offsetWidth;
    const newWidth = ref.offsetWidth;
    setLeftWidth(`${(newWidth / parentWidth) * 100}%`);
  };

  const handleTopResize: ResizeCallback = (e, direction, ref, d: ResizeData) => {
    const parentHeight = ref.parentElement!.offsetHeight;
    const newHeight = ref.offsetHeight;
    setTopHeight(`${(newHeight / parentHeight) * 100}%`);
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col overflow-hidden">
      {/* Navigation Bar */}
      <div className="h-12 border-b border-zinc-800 flex items-center px-4">
        <Link href="/" className="text-zinc-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Left Column - Code Cells */}
        <Resizable
          size={{ width: leftWidth, height: '100%' }}
          onResizeStop={handleLeftResize}
          minWidth="20%"
          maxWidth="80%"
          enable={{ right: true }}
          handleStyles={{
            right: {
              width: '4px',
              right: '-2px',
              cursor: 'col-resize',
              background: '#27272a',
              zIndex: 10,
            },
          }}
          handleClasses={{
            right: 'hover:bg-blue-500 transition-colors',
          }}
          className="border-r border-zinc-800"
        >
          <div className="h-full bg-black overflow-auto">
            <div className="flex items-center space-x-2 px-4 py-3 border-b border-zinc-800">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-white">Problem & Code</span>
            </div>
            <NotebookPage />
          </div>
        </Resizable>

        {/* Right Column - Split View */}
        <div className="flex-1 bg-black flex flex-col min-h-0">
          {/* Top Half - Canvas with Resizable */}
          <Resizable
            size={{ width: '100%', height: topHeight }}
            onResizeStop={handleTopResize}
            minHeight="20%"
            maxHeight="80%"
            enable={{ bottom: true }}
            handleStyles={{
              bottom: {
                height: '4px',
                bottom: '-2px',
                cursor: 'row-resize',
                background: '#27272a',
                zIndex: 10,
              },
            }}
            handleClasses={{
              bottom: 'hover:bg-blue-500 transition-colors',
            }}
            className="border-b border-zinc-800"
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center space-x-2 px-4 py-3 border-b border-zinc-800">
                <PenTool className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Visual Canvas</span>
              </div>
              <div className="flex-1 min-h-0">
                <ExcalidrawWrapper />
              </div>
            </div>
          </Resizable>

          {/* Bottom Half - Chat */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex items-center space-x-2 px-4 py-3 border-b border-zinc-800">
              <Bot className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-white">AI Assistant</span>
            </div>
            <div className="flex-1 min-h-0">
              <ChatPage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
