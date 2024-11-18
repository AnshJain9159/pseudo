import { Step } from '../types';

export const generateSelectionSortSteps = (array: number[]): Step[] => {
  const steps: Step[] = [];
  const arr = [...array];

  steps.push({
    description: 'Starting Selection Sort algorithm',
    array: [...arr],
    currentIndex: -1,
    compareIndex: -1,
  });

  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;

    steps.push({
      description: `Assuming element ${arr[i]} at index ${i} is the smallest`,
      array: [...arr],
      currentIndex: i,
      compareIndex: -1,
    });

    for (let j = i + 1; j < arr.length; j++) {
      steps.push({
        description: `Comparing ${arr[j]} with current minimum ${arr[minIndex]}`,
        array: [...arr],
        currentIndex: i,
        compareIndex: j,
      });

      if (arr[j] < arr[minIndex]) {
        minIndex = j;

        steps.push({
          description: `Found a new minimum: ${arr[minIndex]} at index ${minIndex}`,
          array: [...arr],
          currentIndex: i,
          compareIndex: minIndex,
        });
      }
    }

    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];

      steps.push({
        description: `Swapped ${arr[i]} and ${arr[minIndex]}`,
        array: [...arr],
        currentIndex: i,
        compareIndex: minIndex,
      });
    }
  }

  steps.push({
    description: 'Array is now sorted!',
    array: [...arr],
    currentIndex: -1,
    compareIndex: -1,
  });

  return steps;
};
