export interface Step {
  description: string;
  array: number[];
  currentIndex: number;
  compareIndex: number;
  graphData?: {
    nodes: { id: string; visited?: boolean; distance?: number }[];
    edges: { source: string; target: string; weight?: number; active?: boolean }[];
  };
  treeData?: {
    nodes: { id: string; value: number; visited?: boolean }[];
    edges: { source: string; target: string }[];
  };
  activeNodeId?: string; // Add activeNodeId as an optional property
}


export interface Algorithm {
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  type: 'sorting' | 'searching' | 'graph' | 'tree';
  generator: (config: AlgorithmConfig) => Step[];
}

export interface AlgorithmConfig {
  traversalType: string;
  array?: number[];
  arraySize?: number;
  delay?: number;
  target?: number;
  graphNodes?: number;
  graphEdges?: number;
  treeNodes?: number;
  weighted?: boolean;
  directed?: boolean;
  source?: string;
  destination?: string;
}

export const generateRandomArray = (size: number, min = 1, max = 99): number[] => {
  return Array.from({ length: size }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
};