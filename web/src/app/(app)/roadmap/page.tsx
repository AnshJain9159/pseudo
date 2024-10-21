"use client"
import React from 'react';
import { useRouter } from 'next/navigation'; // Import from next/navigation for App Router compatibility
import RoadmapFlow from '@/components/RoadmapFlow';
import  { Node} from 'reactflow';
interface CustomNodeData {
  label: string;
  description: string;
}
const Roadmap = () => {
  const router = useRouter(); // This is now from next/navigation

  // This handler is passed down to the RoadmapFlow component
  const handleNodeClick = (event: React.MouseEvent, node: Node<CustomNodeData>) => {
    router.push(`/topics/${node.id}`);
  };

  return (
    <div>
      <RoadmapFlow onNodeClick={handleNodeClick} />
    </div>
  );
};

export default Roadmap;
