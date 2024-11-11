export const generateBubbleSortSteps = (array: number[]) => {
  const steps: {
    description: string;
    array: number[];
    currentIndex: number;
    compareIndex: number;
  }[] = [];
  const arr = [...array];

  steps.push({
    description: 'Starting bubble sort algorithm',
    array: [...arr],
    currentIndex: -1,
    compareIndex: -1,
  });

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      steps.push({
        description: `Comparing elements at positions ${j} and ${j + 1}`,
        array: [...arr],
        currentIndex: j,
        compareIndex: j + 1,
      });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({
          description: `Swapping ${arr[j]} and ${arr[j + 1]}`,
          array: [...arr],
          currentIndex: j + 1,
          compareIndex: j,
        });
      }
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