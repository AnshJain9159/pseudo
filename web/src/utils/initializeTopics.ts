// utils/initializeTopics.ts
import { Topic } from '@/models/User';

export const getInitialTopics = (): Topic[] => {
  return [
    // DSA Topics
    { name: 'Arrays & Hashing', category: 'DSA', completed: false },
    { name: 'Two Pointers', category: 'DSA', completed: false },
    { name: 'Sliding Window', category: 'DSA', completed: false },
    { name: 'Stack', category: 'DSA', completed: false },
    { name: 'Queue', category: 'DSA', completed: false },
    { name: 'Linked List', category: 'DSA', completed: false },
    { name: 'Trees', category: 'DSA', completed: false },
    { name: 'Graphs', category: 'DSA', completed: false },
    { name: 'Heaps', category: 'DSA', completed: false },
    { name: 'Tries', category: 'DSA', completed: false },
    { name: 'Dynamic Programming', category: 'DSA', completed: false },
    { name: 'Greedy Algorithms', category: 'DSA', completed: false },
    { name: 'Backtracking', category: 'DSA', completed: false },
    // CS Topics
    { name: 'Operating Systems', category: 'CS', completed: false },
    { name: 'Computer Networks', category: 'CS', completed: false },
    { name: 'Databases', category: 'CS', completed: false },
    { name: 'Software Engineering', category: 'CS', completed: false },
    { name: 'Discrete Mathematics', category: 'CS', completed: false },
    { name: 'Algorithms', category: 'CS', completed: false },
    { name: 'Data Structures', category: 'CS', completed: false },
    { name: 'Theory of Computation', category: 'CS', completed: false },
    { name: 'Artificial Intelligence', category: 'CS', completed: false },
    { name: 'Machine Learning', category: 'CS', completed: false },
    { name: 'Human-Computer Interaction', category: 'CS', completed: false },
    { name: 'Cryptography', category: 'CS', completed: false },
  ];
};
