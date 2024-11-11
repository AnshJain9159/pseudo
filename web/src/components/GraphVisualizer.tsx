import React from 'react';

interface GraphVisualizerProps {
  nodes: { id: string; visited?: boolean; distance?: number }[];
  edges: { source: string; target: string; weight?: number; active?: boolean }[];
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ nodes, edges }) => {
  const width = 600;
  const height = 400;
  const radius = 25;

  // Calculate node positions in a circle
  const centerX = width / 2;
  const centerY = height / 2;
  const nodePositions = new Map();

  nodes.forEach((node, i) => {
    const angle = (i * 2 * Math.PI) / nodes.length;
    const x = centerX + Math.cos(angle) * (width * 0.35);
    const y = centerY + Math.sin(angle) * (height * 0.35);
    nodePositions.set(node.id, { x, y });
  });

  return (
    <svg width={width} height={height} className="mx-auto bg-zinc-900 rounded-lg shadow-lg border border-gray-700">
      {/* Draw edges */}
      {edges.map((edge, i) => {
        const start = nodePositions.get(edge.source);
        const end = nodePositions.get(edge.target);
        
        return (
          <g key={`edge-${i}`}>
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={edge.active ? '#7C3AED' : '#6B7280'} // Purple for active edges, gray for inactive
              strokeWidth={2}
              markerEnd="url(#arrowhead)"
            />
            {edge.weight && (
              <text
                x={(start.x + end.x) / 2}
                y={(start.y + end.y) / 2}
                dy={-5}
                textAnchor="middle"
                fill="#9CA3AF" // Muted gray for edge weights
                className="text-sm"
              >
                {edge.weight}
              </text>
            )}
          </g>
        );
      })}

      {/* Draw nodes */}
      {nodes.map((node) => {
        const pos = nodePositions.get(node.id);
        return (
          <g key={`node-${node.id}`}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={radius}
              fill={node.visited ? '#7C3AED' : '#1F2937'} // Purple for visited nodes, dark gray for unvisited
              stroke="#7C3AED" // Purple stroke for nodes
              strokeWidth={2}
              className="transition-colors duration-300"
            />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dy=".3em"
              fill={node.visited ? '#FFFFFF' : '#7C3AED'} // White for visited node text, purple for unvisited
              className="font-medium"
            >
              {node.id}
            </text>
            {node.distance !== undefined && node.distance !== Infinity && (
              <text
                x={pos.x}
                y={pos.y + radius + 20}
                textAnchor="middle"
                fill="#9CA3AF" // Muted gray for distance text
                className="text-sm"
              >
                {node.distance}
              </text>
            )}
          </g>
        );
      })}

      {/* Arrow marker definition */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#6B7280" // Gray arrowhead for directed edges
          />
        </marker>
      </defs>
    </svg>
  );
};
