import { Step } from '../types';

export const generateDijkstraSteps = (config: {
  nodes: number;
  weighted: boolean;
  source: string;
}): Step[] => {
  const steps: Step[] = [];
  const { nodes, weighted, source } = config;

  // Generate random graph
  const graphNodes = Array.from({ length: nodes }, (_, i) => ({
    id: String.fromCharCode(65 + i),
    distance: i === 0 ? 0 : Infinity,
    visited: false
  }));

  const graphEdges: { source: string; target: string; weight: number; }[] = [];
  for (let i = 0; i < nodes; i++) {
    for (let j = i + 1; j < nodes; j++) {
      if (Math.random() < 0.4) { // 40% chance of edge existing
        graphEdges.push({
          source: graphNodes[i].id,
          target: graphNodes[j].id,
          weight: weighted ? Math.floor(Math.random() * 10) + 1 : 1
        });
      }
    }
  }

  steps.push({
    description: 'Starting Dijkstra\'s Algorithm',
    array: [],
    currentIndex: -1,
    compareIndex: -1,
    graphData: {
      nodes: graphNodes,
      edges: graphEdges
    }
  });

  // Implement Dijkstra's algorithm with step generation
  const distances = new Map();
  graphNodes.forEach(node => distances.set(node.id, Infinity));
  distances.set(source, 0);

  const unvisited = new Set(graphNodes.map(n => n.id));

  while (unvisited.size > 0) {
    let current = Array.from(unvisited).reduce((a, b) => 
      distances.get(a) < distances.get(b) ? a : b
    );

    unvisited.delete(current);

    const currentNode = graphNodes.find(n => n.id === current);
    if (currentNode) currentNode.visited = true;

    const edges = graphEdges.filter(e => e.source === current || e.target === current);
    
    edges.forEach(edge => {
      const neighbor = edge.source === current ? edge.target : edge.source;
      if (unvisited.has(neighbor)) {
        const newDist = distances.get(current) + edge.weight;
        if (newDist < distances.get(neighbor)) {
          distances.set(neighbor, newDist);
          const neighborNode = graphNodes.find(n => n.id === neighbor);
          if (neighborNode) neighborNode.distance = newDist;
        }

        steps.push({
          description: `Checking distance to node ${neighbor} through node ${current}`,
          array: [],
          currentIndex: -1,
          compareIndex: -1,
          graphData: {
            nodes: [...graphNodes],
            edges: graphEdges.map(e => ({
              ...e,
              active: e === edge
            }))
          }
        });
      }
    });
  }

  return steps;
};