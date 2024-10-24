/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from 'react';
import ReactFlow, { Node, Edge, Controls, Background } from 'reactflow';
import '@xyflow/react/dist/style.css';
import { Info } from 'lucide-react';
import Link from 'next/link';
import {  ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface CustomNodeData {
  label: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  prerequisites: string[];
}

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
          {data.prerequisites.length > 0 && (
            <p>Prerequisites: {data.prerequisites.join(', ')}</p>
          )}
        </div>
      )}
    </div>
  );
};

const nodes: Node<CustomNodeData>[] = [
  {
    id: '1',
    position: { x: 250, y: 0 },
    data: {
      label: 'Arrays & Hashing',
      description: 'Learn about arrays and hashing data structures and their applications.',
      difficulty: 'Beginner',
      estimatedHours: 0,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '2',
    position: { x: 100, y: 100 },
    data: {
      label: 'Two Pointers',
      description: 'Understand the two pointers technique and its use cases.',
      difficulty: 'Beginner',
      estimatedHours: 0,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '3',
    position: { x: 400, y: 100 },
    data: {
      label: 'Stack',
      description: 'Learn about the stack data structure and its applications.',
      difficulty: 'Beginner',
      estimatedHours: 0,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '4',
    position: { x: 50, y: 200 },
    data: {
      label: 'Binary Search',
      description: 'Master the binary search algorithm and its variations.',
      difficulty: 'Beginner',
      estimatedHours: 0,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '5',
    position: { x: 250, y: 200 },
    data: {
      label: 'Sliding Window',
      description: 'Learn about the sliding window technique and its applications.',
      difficulty: 'Beginner',
      estimatedHours: 0,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '6',
    position: { x: 400, y: 200 },
    data: {
      label: 'Linked List',
      description: 'Understand linked list data structures and their applications.',
      difficulty: 'Beginner',
      estimatedHours: 0,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '7',
    position: { x: 250, y: 300 },
    data: {
      label: 'Trees',
      description: 'Learn about tree data structures and their traversal algorithms.',
      difficulty: 'Beginner',
      estimatedHours: 0,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '8',
    position: { x: 50, y: 400 },
    data: {
      label: 'Tries',
      description: 'Understand trie data structures and their applications.',
      difficulty: 'Beginner',
      estimatedHours: 0,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '9',
    position: { x: 400, y: 400 },
    data: {
      label: 'Backtracking',
      description: 'Learn about the backtracking algorithm and its applications.',
      difficulty: 'Advanced',
      estimatedHours: 0,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '10',
    position: { x: 50, y: 500 },
    data: {
      label: 'Heap / Priority Queue',
      description: 'Understand heap and priority queue data structures and their applications.',
      difficulty: 'Beginner',
      estimatedHours: 0,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '11',
    position: { x: 250, y: 600 },
    data: {
      label: 'Intervals',
      description: 'Learn about interval data structures and their applications.',
      difficulty: 'Beginner',
      estimatedHours: 0,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '12',
    position: { x: 400, y: 600 },
    data: {
      label: 'Greedy',
      description: 'Understand the greedy algorithm and its applications.',
      difficulty: 'Beginner',
      estimatedHours: 0,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '13',
    position: { x: 100, y: 700 },
    data: {
      label: 'Graphs',
      description: 'Learn about graph data structures and their traversal algorithms.',
      difficulty: 'Advanced',
      estimatedHours: 0,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '14',
    position: { x: 250, y: 700 },
    data: {
      label: 'Advanced Graphs',
      description: 'Explore advanced graph algorithms and data structures.',
      difficulty: 'Advanced',
      estimatedHours: 0,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '15',
    position: { x: 400, y: 700 },
    data: {
      label: 'DP (1D)',
      description: 'Learn about dynamic programming with 1D arrays.',
      difficulty: 'Beginner',
      estimatedHours: 0,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '16',
    position: { x: 250, y: 800 },
    data: {
      label: 'DP (2D)',
      description: 'Learn about dynamic programming with 2D arrays.',
      difficulty: 'Advanced',
      estimatedHours: 0,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '17',
    position: { x: 100, y: 900 },
    data: {
      label: 'Bit Manipulation',
      description: 'Understand bitwise operations and their applications.',
      difficulty: 'Advanced',
      estimatedHours: 0,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '18',
    position: { x: 400, y: 900 },
    data: {
      label: 'Math & Geometry',
      description: 'Learn about mathematical concepts and geometric algorithms.',
      difficulty: 'Beginner',
      estimatedHours: 0,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
];


// Define the edges connecting the nodes
const edges = [
  { id: 'e1-2', source: '1', target: '2', animated: true , style: { stroke: '#fff' }},
  { id: 'e1-3', source: '1', target: '3', animated: true , style: { stroke: '#fff' }},
  { id: 'e2-4', source: '2', target: '4', animated: true , style: { stroke: '#fff' }},
  { id: 'e2-5', source: '2', target: '5', animated: true , style: { stroke: '#fff' }},
  { id: 'e3-6', source: '3', target: '6', animated: true , style: { stroke: '#fff' }},
  { id: 'e5-7', source: '5', target: '7', animated: true , style: { stroke: '#fff' }},
  { id: 'e6-7', source: '6', target: '7', animated: true , style: { stroke: '#fff' }},
  { id: 'e7-8', source: '7', target: '8', animated: true , style: { stroke: '#fff' }},
  { id: 'e7-9', source: '7', target: '9', animated: true , style: { stroke: '#fff' }},
  { id: 'e8-10', source: '8', target: '10', animated: true , style: { stroke: '#fff' }},
  { id: 'e9-13', source: '9', target: '13', animated: true , style: { stroke: '#fff' }},
  { id: 'e10-11', source: '10', target: '11', animated: true , style: { stroke: '#fff' }},
  { id: 'e10-12', source: '10', target: '12', animated: true , style: { stroke: '#fff' }},
  { id: 'e13-14', source: '13', target: '14', animated: true , style: { stroke: '#fff' }},
  { id: 'e14-15', source: '14', target: '15', animated: true , style: { stroke: '#fff' }},
  { id: 'e15-16', source: '15', target: '16', animated: true , style: { stroke: '#fff' }},
  { id: 'e16-17', source: '16', target: '17', animated: true , style: { stroke: '#fff' }},
  { id: 'e17-18', source: '17', target: '18', animated: true, style: { stroke: '#fff' } },
];

const nodeTypes = {
  custom: CustomNode,
};

const DSARoadmap = () => {
  const [selectedNode, setSelectedNode] = useState<Node<CustomNodeData> | null>(null);

  return (
    <div className="h-screen w-full bg-gray-900 ">
      
      <div className="absolute top-4 left-4 z-10 flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-600" />
          <span className="text-white">Beginner</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-600" />
          <span className="text-white">Intermediate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-600" />
          <span className="text-white">Advanced</span>
        </div>
      </div>
      
      {selectedNode && (
        <div className="absolute top-4 right-4 z-10 bg-gray-800 p-4 rounded-lg text-white max-w-md">
          <h2 className="text-xl font-bold mb-2">{selectedNode.data.label}</h2>
          <p className="mb-2">{selectedNode.data.description}</p>
          <p className="mb-1">Difficulty: {selectedNode.data.difficulty}</p>
          <p className="mb-1">Estimated Time: {selectedNode.data.estimatedHours} hours</p>
            <div className="flex justify-between items-center">
            <p>Prerequisites: {selectedNode.data.prerequisites.join(', ') || 'None'}</p>
            <button 
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              onClick={() => setSelectedNode(null)}
            >
              <ArrowLeft size={16} />
            </button>
            </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        onNodeClick={(_, node) => setSelectedNode(node)}
        className="bg-gray-900"
      >
        
        <Background color="#fff" variant={"dots"} />
      </ReactFlow>
    </div>
  );
};

export default DSARoadmap;