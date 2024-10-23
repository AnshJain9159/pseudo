"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import DSARoadmap from '@/components/RoadmapFlow';
import type { Node } from 'reactflow';

interface CustomNodeData {
  label: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  prerequisites: string[];
}

const RoadmapPage = () => {
  const router = useRouter();

  const handleNodeClick = (event: React.MouseEvent, node: Node<CustomNodeData>) => {
    // Prevent navigation if clicking the info button
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }
    router.push(`/topics/${node.id}`);
  };

  return (
    <div className="w-full h-screen">
     
      <DSARoadmap onNodeClick={handleNodeClick} />
    </div>
  );
};

export default RoadmapPage;