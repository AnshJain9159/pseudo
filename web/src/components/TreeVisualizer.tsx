import React from 'react';

interface TreeVisualizerProps {
  nodes: { id: string; value: number; visited?: boolean }[];
  edges: { source: string; target: string }[];
  activeNodeId?: string; // Add activeNodeId as prop
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ nodes, edges, activeNodeId }) => {
  const width = 600;
  const height = 400;
  const radius = 25;
  const levelHeight = 80;

  const nodePositions = new Map();
  nodes.forEach((node, index) => {
    const level = Math.floor(Math.log2(index + 1));
    const position = index - Math.pow(2, level) + 1;
    const levelWidth = Math.pow(2, level);
    const x = width * ((position + 0.5) / levelWidth);
    const y = level * levelHeight + 50;
    nodePositions.set(node.id, { x, y });
  });

  return (
    <svg width={width} height={height} className="mx-auto bg-zinc-900 rounded-lg shadow-lg border border-gray-700">
      {/* Draw edges */}
      {edges.map((edge, i) => {
        const start = nodePositions.get(edge.source);
        const end = nodePositions.get(edge.target);
        return (
          <line
            key={`edge-${i}`}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="#6B7280"
            strokeWidth={2}
          />
        );
      })}

      {/* Draw nodes */}
      {nodes.map((node) => {
        const pos = nodePositions.get(node.id);
        const isActive = node.id === activeNodeId; // Check if the node is active

        return (
          <g key={`node-${node.id}`}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={radius}
              fill={isActive ? '#E11D48' : node.visited ? '#7C3AED' : '#1F2937'} // Red for active, purple for visited
              stroke={isActive ? '#FF385C' : '#7C3AED'} // Pink stroke for active
              strokeWidth={2}
              className={isActive ? 'animate-blink' : ''} // Apply blink animation to active node
            />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dy=".3em"
              fill={node.visited || isActive ? '#FFFFFF' : '#7C3AED'} // White for visited or active
              className="font-medium"
            >
              {node.value}
            </text>
          </g>
        );
      })}

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </svg>
  );
};
