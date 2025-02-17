/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from 'react';
import ReactFlow, { Node, Edge, Controls, Background } from 'reactflow';
import '@xyflow/react/dist/style.css';
import { Info } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from 'components/ui/button';

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
      return 'border-zinc-700 bg-black';
    case 'Intermediate':
      return 'border-zinc-600 bg-black';
    case 'Advanced':
      return 'border-zinc-500 bg-black';
    default:
      return 'border-zinc-800 bg-black';
  }
};

const CustomNode = ({ data }: { data: CustomNodeData }) => {
  const [showInfo, setShowInfo] = useState(false);
  
  return (
    <div 
      className={`
        rounded-lg p-4 border transition-all duration-200
        ${getDifficultyColor(data.difficulty)}
      `}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-lg text-zinc-100">{data.label}</h3>
        <button 
          className="p-1 hover:bg-zinc-800 rounded-lg transition-colors"
          onClick={() => setShowInfo(!showInfo)}
        >
          <Info size={16} className="text-zinc-400" />
        </button>
      </div>
      {showInfo && (
        <div className="mt-2 text-sm bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
          <p className="mb-1 text-zinc-300">{data.description}</p>
          <p className="mb-1 text-zinc-400">Difficulty: {data.difficulty}</p>
          {data.prerequisites.length > 0 && (
            <p className="text-zinc-400">Prerequisites: {data.prerequisites.join(', ')}</p>
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
      label: 'Programming Fundamentals',
      description: 'Learn basic programming concepts, variables, control structures, and functions.',
      difficulty: 'Beginner',
      estimatedHours: 40,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '2',
    position: { x: 100, y: 100 },
    data: {
      label: 'Data Structures',
      description: 'Study fundamental data structures like arrays, linked lists, trees, and graphs.',
      difficulty: 'Beginner',
      estimatedHours: 60,
      prerequisites: ['Programming Fundamentals']
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '3',
    position: { x: 400, y: 100 },
    data: {
      label: 'Algorithms',
      description: 'Learn algorithm design, analysis, and common algorithmic patterns.',
      difficulty: 'Intermediate',
      estimatedHours: 60,
      prerequisites: ['Data Structures']
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '4',
    position: { x: 50, y: 200 },
    data: {
      label: 'Computer Architecture',
      description: 'Understand computer organization, assembly, and hardware concepts.',
      difficulty: 'Intermediate',
      estimatedHours: 50,
      prerequisites: ['Programming Fundamentals']
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '5',
    position: { x: 250, y: 200 },
    data: {
      label: 'Operating Systems',
      description: 'Learn about OS concepts, processes, threading, and memory management.',
      difficulty: 'Advanced',
      estimatedHours: 60,
      prerequisites: ['Computer Architecture']
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '6',
    position: { x: 400, y: 200 },
    data: {
      label: 'Database Systems',
      description: 'Study database design, SQL, and database management systems.',
      difficulty: 'Intermediate',
      estimatedHours: 40,
      prerequisites: ['Data Structures']
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '7',
    position: { x: 250, y: 300 },
    data: {
      label: 'Computer Networks',
      description: 'Learn networking protocols, architecture, and web technologies.',
      difficulty: 'Intermediate',
      estimatedHours: 50,
      prerequisites: ['Operating Systems']
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '8',
    position: { x: 50, y: 400 },
    data: {
      label: 'Software Engineering',
      description: 'Study software development methodologies, testing, and project management.',
      difficulty: 'Intermediate',
      estimatedHours: 45,
      prerequisites: ['Programming Fundamentals']
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '9',
    position: { x: 400, y: 400 },
    data: {
      label: 'Web Development',
      description: 'Learn frontend and backend development, frameworks, and APIs.',
      difficulty: 'Intermediate',
      estimatedHours: 70,
      prerequisites: ['Programming Fundamentals']
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '10',
    position: { x: 50, y: 500 },
    data: {
      label: 'Artificial Intelligence',
      description: 'Study AI concepts, machine learning, and neural networks.',
      difficulty: 'Advanced',
      estimatedHours: 80,
      prerequisites: ['Algorithms', 'Mathematics']
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '11',
    position: { x: 250, y: 500 },
    data: {
      label: 'Mathematics',
      description: 'Learn discrete math, linear algebra, and probability theory.',
      difficulty: 'Intermediate',
      estimatedHours: 60,
      prerequisites: []
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '12',
    position: { x: 400, y: 500 },
    data: {
      label: 'Cybersecurity',
      description: 'Study security principles, cryptography, and network security.',
      difficulty: 'Advanced',
      estimatedHours: 60,
      prerequisites: ['Computer Networks']
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '13',
    position: { x: 100, y: 600 },
    data: {
      label: 'Cloud Computing',
      description: 'Learn cloud services, deployment, and distributed systems.',
      difficulty: 'Advanced',
      estimatedHours: 50,
      prerequisites: ['Computer Networks', 'Database Systems']
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '14',
    position: { x: 250, y: 600 },
    data: {
      label: 'Mobile Development',
      description: 'Study mobile app development for iOS and Android.',
      difficulty: 'Intermediate',
      estimatedHours: 60,
      prerequisites: ['Programming Fundamentals']
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  },
  {
    id: '15',
    position: { x: 400, y: 600 },
    data: {
      label: 'DevOps',
      description: 'Learn continuous integration, deployment, and infrastructure automation.',
      difficulty: 'Advanced',
      estimatedHours: 55,
      prerequisites: ['Software Engineering', 'Cloud Computing']
    },
    style: { background: '#2446bf', color: '#fff', padding: 10 },
  }
];

// Update edges to match the exact flow in the image
const edges = [
  // Programming Fundamentals connections
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#fff' }}, // to Data Structures
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#fff' }}, // to Algorithms
  { id: 'e1-4', source: '1', target: '4', animated: true, style: { stroke: '#fff' }}, // to Computer Architecture
  { id: 'e1-5', source: '1', target: '5', animated: true, style: { stroke: '#fff' }}, // to Operating Systems

  // Data Structures connections
  { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#fff' }}, // to Computer Architecture
  { id: 'e2-5', source: '2', target: '5', animated: true, style: { stroke: '#fff' }}, // to Operating Systems
  { id: 'e2-6', source: '2', target: '6', animated: true, style: { stroke: '#fff' }}, // to Database Systems

  // Algorithms connections
  { id: 'e3-6', source: '3', target: '6', animated: true, style: { stroke: '#fff' }}, // to Database Systems

  // Operating Systems to Networks
  { id: 'e5-7', source: '5', target: '7', animated: true, style: { stroke: '#fff' }},

  // Computer Networks connections
  { id: 'e7-8', source: '7', target: '8', animated: true, style: { stroke: '#fff' }}, // to Software Engineering
  { id: 'e7-9', source: '7', target: '9', animated: true, style: { stroke: '#fff' }}, // to Web Development

  // Database Systems connections
  { id: 'e6-7', source: '6', target: '7', animated: true, style: { stroke: '#fff' }}, // to Computer Networks
  { id: 'e6-9', source: '6', target: '9', animated: true, style: { stroke: '#fff' }}, // to Web Development

  // Software Engineering connections
  { id: 'e8-10', source: '8', target: '10', animated: true, style: { stroke: '#fff' }}, // to AI

  // Mathematics connections
  { id: 'e11-10', source: '11', target: '10', animated: true, style: { stroke: '#fff' }}, // to AI
  { id: 'e11-13', source: '11', target: '13', animated: true, style: { stroke: '#fff' }}, // to Cloud Computing
  { id: 'e11-15', source: '11', target: '15', animated: true, style: { stroke: '#fff' }}, // to DevOps

  // Cybersecurity connections
  { id: 'e12-15', source: '12', target: '15', animated: true, style: { stroke: '#fff' }}, // to DevOps

  // Cloud Computing to Mobile Development
  { id: 'e13-14', source: '13', target: '14', animated: true, style: { stroke: '#fff' }}
];

const nodeTypes = {
  custom: CustomNode,
};

const CSRoadmap = () => {
  const [selectedNode, setSelectedNode] = useState<Node<CustomNodeData> | null>(null);

  return (
    <div className="h-screen w-full bg-black">
      {selectedNode && (
        <div className="absolute top-4 right-4 z-10 bg-black p-6 rounded-lg text-zinc-100 max-w-md border border-zinc-800">
          <h2 className="text-xl font-medium mb-4">{selectedNode.data.label}</h2>
          <p className="mb-4 text-zinc-400">{selectedNode.data.description}</p>
          <p className="mb-2 text-zinc-400">Difficulty: {selectedNode.data.difficulty}</p>
          <div className="flex justify-between items-center">
            <p className="text-zinc-400">Prerequisites: {selectedNode.data.prerequisites.join(', ') || 'None'}</p>
            <button 
              className="p-2 hover:bg-zinc-900 rounded-lg transition-colors"
              onClick={() => setSelectedNode(null)}
            >
              <ArrowLeft size={16} className="text-zinc-400" />
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
        className="bg-black"
      >
        <Background gap={12} color="#27272a" />
        <div className="absolute top-4 left-20 z-10 flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-lg border border-zinc-700" />
            <span className="text-zinc-400">Beginner</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-lg border border-zinc-600" />
            <span className="text-zinc-400">Intermediate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-lg border border-zinc-500" />
            <span className="text-zinc-400">Advanced</span>
          </div>
        </div>
      </ReactFlow>
    </div>
  );
};

export default CSRoadmap;