import { Step } from '../types';

export const generateMergeSortSteps = (array: number[]): Step[] => {
  const steps: Step[] = [];
  const arr = [...array];

  const merge = (left: number, mid: number, right: number) => {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    steps.push({
      description: `Merging subarrays: [${leftArr.join(', ')}] and [${rightArr.join(', ')}]`,
      array: [...arr],
      currentIndex: left,
      compareIndex: mid + 1,
    });

    while (i < leftArr.length && j < rightArr.length) {
      steps.push({
        description: `Comparing ${leftArr[i]} and ${rightArr[j]}`,
        array: [...arr],
        currentIndex: left + i,
        compareIndex: mid + 1 + j,
      });

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      k++;

      steps.push({
        description: 'Merging elements',
        array: [...arr],
        currentIndex: k - 1,
        compareIndex: -1,
      });
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      steps.push({
        description: `Adding remaining element ${leftArr[i]} from left subarray`,
        array: [...arr],
        currentIndex: k,
        compareIndex: -1,
      });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      steps.push({
        description: `Adding remaining element ${rightArr[j]} from right subarray`,
        array: [...arr],
        currentIndex: k,
        compareIndex: -1,
      });
      j++;
      k++;
    }
  };

  const mergeSort = (left: number, right: number) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      steps.push({
        description: `Dividing array into two subarrays at index ${mid}`,
        array: [...arr],
        currentIndex: mid,
        compareIndex: -1,
      });
      mergeSort(left, mid);
      mergeSort(mid + 1, right);
      merge(left, mid, right);
    }
  };

  steps.push({
    description: 'Starting Merge Sort algorithm',
    array: [...arr],
    currentIndex: -1,
    compareIndex: -1,
  });

  mergeSort(0, arr.length - 1);

  steps.push({
    description: 'Array is now sorted!',
    array: [...arr],
    currentIndex: -1,
    compareIndex: -1,
  });

  return steps;
};