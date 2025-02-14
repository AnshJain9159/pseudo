/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import DSARoadmap from '@/components/RoadmapFlow';
import type { Node } from 'reactflow';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CustomNodeData {
  label: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  prerequisites: string[];
}

const RoadmapPage = () => {
  const router = useRouter();

  // const handleNodeClick = (event: React.MouseEvent, node: Node<CustomNodeData>) => {
  //   // Prevent navigation if clicking the info button
  //   if ((event.target as HTMLElement).closest('button')) {
  //     return;
  //   }
  //   router.push(/topics/${node.id});
  // };

  return (
    <div className="w-full h-screen bg-black">
      <Link href="/" className="absolute top-4 left-4 z-10">
        <Button
          variant="ghost"
          className="p-2 rounded-lg border border-zinc-800 bg-black hover:bg-zinc-900 transition-all duration-200"
        >
          <ArrowLeft className="h-6 w-6 text-zinc-400" />
        </Button>
      </Link>
           {/* <DSARoadmap onNodeClick={handleNodeClick} /> */}
           <DSARoadmap/>
    </div>
  );
};

export default RoadmapPage;