import { Step } from '../types';

export const generateLinearSearchSteps = (array: number[], target: number): Step[] => {
  const steps: Step[] = [];
  const arr = [...array];

  steps.push({
    description: `Starting Linear Search for target value: ${target}`,
    array: arr,
    currentIndex: -1,
    compareIndex: -1,
  });

  for (let i = 0; i < arr.length; i++) {
    steps.push({
      description: `Checking element at index ${i}: ${arr[i]}`,
      array: arr,
      currentIndex: i,
      compareIndex: -1,
    });

    if (arr[i] === target) {
      steps.push({
        description: `Found target ${target} at index ${i}!`,
        array: arr,
        currentIndex: i,
        compareIndex: -1,
      });
      return steps;
    }
  }

  steps.push({
    description: `Target ${target} not found in the array`,
    array: arr,
    currentIndex: -1,
    compareIndex: -1,
  });

  return steps;
};
