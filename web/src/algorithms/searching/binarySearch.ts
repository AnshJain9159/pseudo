  import { Step } from '../types';

  export const generateBinarySearchSteps = (array: number[], target: number): Step[] => {
    const steps: Step[] = [];
    const arr = [...array].sort((a, b) => a - b); // Binary search requires sorted array
    let left = 0;
    let right = arr.length - 1;

    steps.push({
      description: `Starting Binary Search for target value: ${target}`,
      array: arr,
      currentIndex: -1,
      compareIndex: -1,
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push({
        description: `Checking middle element at index ${mid}: ${arr[mid]}`,
        array: arr,
        currentIndex: mid,
        compareIndex: -1,
      });

      if (arr[mid] === target) {
        steps.push({
          description: `Found target ${target} at index ${mid}!`,
          array: arr,
          currentIndex: mid,
          compareIndex: -1,
        });
        return steps;
      }

      if (arr[mid] < target) {
        steps.push({
          description: `${arr[mid]} is less than ${target}, searching right half`,
          array: arr,
          currentIndex: mid,
          compareIndex: right,
        });
        left = mid + 1;
      } else {
        steps.push({
          description: `${arr[mid]} is greater than ${target}, searching left half`,
          array: arr,
          currentIndex: mid,
          compareIndex: left,
        });
        right = mid - 1;
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