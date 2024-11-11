import { Step } from '../types';

export const generateQuickSortSteps = (array: number[]): Step[] => {
  const steps: Step[] = [];
  const arr = [...array];

  const partition = (low: number, high: number): number => {
    const pivot = arr[high];
    let i = low - 1;

    steps.push({
      description: `Choosing pivot element: ${pivot}`,
      array: [...arr],
      currentIndex: high,
      compareIndex: -1,
    });

    for (let j = low; j < high; j++) {
      steps.push({
        description: `Comparing element ${arr[j]} with pivot ${pivot}`,
        array: [...arr],
        currentIndex: j,
        compareIndex: high,
      });

      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        if (i !== j) {
          steps.push({
            description: `Swapping ${arr[i]} and ${arr[j]}`,
            array: [...arr],
            currentIndex: i,
            compareIndex: j,
          });
        }
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({
      description: `Placing pivot ${pivot} in its correct position`,
      array: [...arr],
      currentIndex: i + 1,
      compareIndex: high,
    });

    return i + 1;
  };

  const quickSort = (low: number, high: number) => {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    }
  };

  steps.push({
    description: 'Starting Quick Sort algorithm',
    array: [...arr],
    currentIndex: -1,
    compareIndex: -1,
  });

  quickSort(0, arr.length - 1);

  steps.push({
    description: 'Array is now sorted!',
    array: [...arr],
    currentIndex: -1,
    compareIndex: -1,
  });

  return steps;
};