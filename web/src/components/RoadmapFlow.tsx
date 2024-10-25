/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from 'react';
import ReactFlow, { Node, Edge, Controls, Background } from 'reactflow';
import '@xyflow/react/dist/style.css';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define node data structure
interface CustomNodeData {
  label: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  prerequisites: string[];
}

// Get color based on difficulty level
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-600';
    case 'Intermediate':
      return 'bg-yellow-600';
    case 'Advanced':
      return 'bg-red-600';
    default:
      return 'bg-blue-600';
  }
};

// Custom Node component to display node data
const CustomNode = ({ data }: { data: CustomNodeData }) => {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div className={`rounded-lg p-4 ${getDifficultyColor(data.difficulty)} text-white min-w-[200px]`}>
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg">{data.label}</h3>
        <button
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
          onClick={() => setShowInfo(!showInfo)}
        >
          <Info size={16} />
        </button>
      </div>
      {showInfo && (
        <div className="mt-2 text-sm bg-black/20 p-2 rounded">
          <p className="mb-1">{data.description}</p>
          <p className="mb-1">Difficulty: {data.difficulty}</p>
          <p className="mb-1">Est. Time: {data.estimatedHours}h</p>
          {data.prerequisites.length > 0 && <p>Prerequisites: {data.prerequisites.join(', ')}</p>}
        </div>
      )}
    </div>
  );
};

// Top-level roadmap nodes for Computer Science
const initialNodes: Node<CustomNodeData>[] = [
  {
    id: '1',
    position: { x: 250, y: 0 },
    data: {
      label: 'Data Structures & Algorithms',
      description: 'Learn DSA concepts, from arrays to dynamic programming.',
      difficulty: 'Beginner',
      estimatedHours: 100,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '2',
    position: { x: 100, y: 100 },
    data: {
      label: 'Operating Systems',
      description: 'Understand OS fundamentals, from processes to memory management.',
      difficulty: 'Intermediate',
      estimatedHours: 60,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '3',
    position: { x: 400, y: 100 },
    data: {
      label: 'Databases',
      description: 'Learn about relational and non-relational databases.',
      difficulty: 'Beginner',
      estimatedHours: 50,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '4',
    position: { x: 250, y: 200 },
    data: {
      label: 'Computer Networks',
      description: 'Explore networking concepts and protocols like TCP/IP.',
      difficulty: 'Intermediate',
      estimatedHours: 60,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
];

// Sample edges between the subjects
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#fff' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#fff' } },
  { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#fff' } },
];

// Define subroadmaps for different topics
const subRoadmaps = {
  '1': [
    {
      id: '1-1',
      position: { x: 150, y: 300 },
      data: {
        label: 'Arrays & Hashing',
        description: 'Learn basic data structures like arrays and hash tables.',
        difficulty: 'Beginner',
        estimatedHours: 20,
        prerequisites: []
      },
      style: { background: '#2446bf', color: '#fff', padding: 10 },
    },
    {
      id: '1-2',
      position: { x: 350, y: 300 },
      data: {
        label: 'Trees & Graphs',
        description: 'Explore tree and graph data structures and their algorithms.',
        difficulty: 'Intermediate',
        estimatedHours: 30,
        prerequisites: ['Arrays']
      },
      style: { background: '#2446bf', color: '#fff', padding: 10 },
    },
  ],
  '2': [
    {
      id: '2-1',
      position: { x: 150, y: 300 },
      data: {
        label: 'Process Management',
        description: 'Learn how operating systems manage processes and threads.',
        difficulty: 'Intermediate',
        estimatedHours: 20,
        prerequisites: []
      },
      style: { background: '#2446bf', color: '#fff', padding: 10 },
    },
    {
      id: '2-2',
      position: { x: 350, y: 300 },
      data: {
        label: 'Memory Management',
        description: 'Understand how memory is allocated and managed in an OS.',
        difficulty: 'Intermediate',
        estimatedHours: 30,
        prerequisites: []
      },
      style: { background: '#2446bf', color: '#fff', padding: 10 },
    },
  ],
};

const nodeTypes = {
  custom: CustomNode,
};

const CSRoadmap = () => {
  const [nodes, setNodes] = useState<Node<CustomNodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]); // Track expanded nodes

  const expandSubtree = (nodeId: string) => {
    if (expandedNodes.includes(nodeId)) {
      return; // If already expanded, do nothing
    }

    const newNodes = subRoadmaps[nodeId] || [];
    setNodes((prevNodes) => [...prevNodes, ...newNodes]);
    setExpandedNodes((prev) => [...prev, nodeId]);
  };

  return (
    <div className="h-screen w-full bg-gray-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        onNodeClick={(_, node) => expandSubtree(node.id)} // Expand on node click
        className="bg-gray-900"
      >
        <Background color="#fff" variant="dots" />
      </ReactFlow>
    </div>
  );
};

export default CSRoadmap;
