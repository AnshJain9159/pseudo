import { Step } from '../types';

export const generateInsertionSortSteps = (array: number[]): Step[] => {
  const steps: Step[] = [];
  const arr = [...array];

  steps.push({
    description: 'Starting Insertion Sort algorithm',
    array: [...arr],
    currentIndex: -1,
    compareIndex: -1,
  });

  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;

    steps.push({
      description: `Considering element ${key} at index ${i}`,
      array: [...arr],
      currentIndex: i,
      compareIndex: j,
    });

    while (j >= 0 && arr[j] > key) {
      steps.push({
        description: `Comparing ${key} with ${arr[j]}`,
        array: [...arr],
        currentIndex: j + 1,
        compareIndex: j,
      });

      arr[j + 1] = arr[j]; // Shift element to the right
      j--;

      steps.push({
        description: `Shifting ${arr[j + 1]} to the right`,
        array: [...arr],
        currentIndex: j + 1,
        compareIndex: -1,
      });
    }

    arr[j + 1] = key;

    steps.push({
      description: `Inserting ${key} at position ${j + 1}`,
      array: [...arr],
      currentIndex: j + 1,
      compareIndex: -1,
    });
  }

  steps.push({
    description: 'Array is now sorted!',
    array: [...arr],
    currentIndex: -1,
    compareIndex: -1,
  });

  return steps;
};
