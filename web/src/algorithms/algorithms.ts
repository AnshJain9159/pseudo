import { Algorithm } from './types';
import { generateBubbleSortSteps } from './sorting/bubbleSort';
import { generateQuickSortSteps } from './sorting/quickSort';
import { generateMergeSortSteps } from './sorting/mergeSort';
import { generateBinarySearchSteps } from './searching/binarySearch';
import { generateInsertionSortSteps } from './sorting/insertionSort';
import { generateDijkstraSteps } from './graph/dijkstra';
import { generateTreeTraversalSteps } from './tree/binaryTreeTraversal';
import { generateSelectionSortSteps } from './sorting/selectionSort';
import {generateLinearSearchSteps } from './searching/linearSearch'
export const algorithms: Record<string, Algorithm> = {
  
  'Insertion Sort': {
  description: 'A simple sorting algorithm that builds the sorted array one item at a time by repeatedly inserting the current element into its correct position.',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  type: 'sorting',
  generator: (config) => generateInsertionSortSteps(config.array || []),
  },
  
  'Bubble Sort': {
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    type: 'sorting',
    generator: (config) => generateBubbleSortSteps(config.array || []),
  },
  
  'Selection Sort': { 
    description: 'A simple sorting algorithm that repeatedly selects the smallest (or largest) element from the unsorted portion and swaps it with the first unsorted element.', 
    timeComplexity: 'O(n²)', 
    spaceComplexity: 'O(1)', 
    type: 'sorting', 
    generator: (config) => generateSelectionSortSteps(config.array || []), 
  } ,
  'Quick Sort': {
    description: 'An efficient, in-place sorting algorithm that uses a divide-and-conquer strategy to sort elements. It picks an element as a pivot and partitions the array around it.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    type: 'sorting',
    generator: (config) => generateQuickSortSteps(config.array || []),
  },
  'Merge Sort': {
    description: 'A divide-and-conquer sorting algorithm that divides the array into smaller subarrays, sorts them, and then merges them back together.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    type: 'sorting',
    generator: (config) => generateMergeSortSteps(config.array || []),
  },
  'Linear Search': {
  description: 'A simple search algorithm that checks each element in the array one by one until the target is found or the array ends.',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  type: 'searching',
  generator: (config) => generateLinearSearchSteps(config.array || [], config.target || 0),
},

  'Binary Search': {
    description: 'An efficient search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search space in half.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    type: 'searching',
    generator: (config) => generateBinarySearchSteps(config.array || [], config.target || 0),
  },
  'Dijkstra\'s Algorithm': {
    description: 'A graph search algorithm that finds the shortest path between nodes in a graph, which may represent, for example, road networks.',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    type: 'graph',
    generator: (config) => generateDijkstraSteps({
      nodes: config.graphNodes || 6,
      weighted: config.weighted || false,
      source: 'A'
    }),
  },
  'Binary Tree Traversal': {
    description: 'Different ways to visit all nodes in a binary tree: inorder (left-root-right), preorder (root-left-right), postorder (left-right-root), and level-order.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    type: 'tree',
    generator: (config) => generateTreeTraversalSteps({
      nodes: config.treeNodes || 7,
      traversalType: (config.traversalType as 'inorder' | 'preorder' | 'postorder' | 'levelorder') || 'inorder',
    }),
  }
};
