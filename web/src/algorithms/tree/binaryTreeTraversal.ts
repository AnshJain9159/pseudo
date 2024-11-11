import { Step } from '../types';

export const generateTreeTraversalSteps = (config: {
  nodes: number;
  traversalType: 'inorder' | 'preorder' | 'postorder' | 'levelorder';
}): Step[] => {
  const steps: Step[] = [];
  const { nodes, traversalType } = config;

  // Generate a balanced binary tree
  const treeNodes = Array.from({ length: nodes }, (_, i) => ({
    id: String(i),
    value: Math.floor(Math.random() * 100),
    visited: false
  }));

  const treeEdges: { source: string; target: string }[] = [];
  for (let i = 0; i < nodes; i++) {
    const leftChild = 2 * i + 1;
    const rightChild = 2 * i + 2;
    if (leftChild < nodes) {
      treeEdges.push({ source: String(i), target: String(leftChild) });
    }
    if (rightChild < nodes) {
      treeEdges.push({ source: String(i), target: String(rightChild) });
    }
  }

  // Initial step
  steps.push({
    description: `Starting ${traversalType} traversal`,
    array: [],
    currentIndex: -1,
    compareIndex: -1,
    treeData: {
      nodes: treeNodes,
      edges: treeEdges
    },
    activeNodeId: undefined // No active node at the start
  });

  // Visit function to mark a node as visited and add to steps with activeNodeId
  const visit = (nodeId: string) => {
    const node = treeNodes.find(n => n.id === nodeId);
    if (node) {
      node.visited = true;
      steps.push({
        description: `Visiting node ${node.value}`,
        array: [],
        currentIndex: -1,
        compareIndex: -1,
        treeData: {
          nodes: [...treeNodes], // Spread to copy current tree state
          edges: treeEdges
        },
        activeNodeId: nodeId // Set active node here
      });
    }
  };

  // Recursive traversal function
  const traverse = (nodeId: string) => {
    if (parseInt(nodeId) >= nodes) return;

    if (traversalType === 'preorder') {
      visit(nodeId);
      traverse(String(2 * parseInt(nodeId) + 1));
      traverse(String(2 * parseInt(nodeId) + 2));
    } else if (traversalType === 'inorder') {
      traverse(String(2 * parseInt(nodeId) + 1));
      visit(nodeId);
      traverse(String(2 * parseInt(nodeId) + 2));
    } else if (traversalType === 'postorder') {
      traverse(String(2 * parseInt(nodeId) + 1));
      traverse(String(2 * parseInt(nodeId) + 2));
      visit(nodeId);
    }
  };

  // Level order traversal
  if (traversalType === 'levelorder') {
    const queue = ['0'];
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      if (parseInt(nodeId) < nodes) {
        visit(nodeId);
        queue.push(String(2 * parseInt(nodeId) + 1));
        queue.push(String(2 * parseInt(nodeId) + 2));
      }
    }
  } else {
    traverse('0');
  }

  return steps;
};
