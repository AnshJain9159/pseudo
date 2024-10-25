/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import DSARoadmap from '@/components/RoadmapFlow';
 import type { Node } from 'reactflow';
import {  ArrowLeft } from 'lucide-react';
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
  //   router.push(⁠ /topics/${node.id} ⁠);
  // };

  return (
    <div className="w-full h-screen px-16  bg-gray-900">
      <Link href="/" className="absolute top-4 left-4">
        <Button
          variant="ghost"
          className="p-2 rounded-full bg-gray-700 bg-opacity-50 hover:bg-opacity-75 transition-all duration-300"
        >
          <ArrowLeft className="h-6 w-6 text-gray-300" />
        </Button>
      </Link>
           {/* <DSARoadmap onNodeClick={handleNodeClick} /> */}
           <DSARoadmap/>
    </div>
  );
};

export default RoadmapPage;