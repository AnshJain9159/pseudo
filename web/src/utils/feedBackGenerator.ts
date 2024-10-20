interface Analysis {
  timeComplexity: string;
  spaceComplexity: string;
  loopNestDepth: number;
  recursion: boolean;
  dataStructures: Set<string>;
}

export function generateFeedback(analysis: Analysis): string[] {
  const feedback: string[] = [];

  // Time complexity feedback
  if (['O(n^2)', 'O(2^n)', 'O(n!)'].includes(analysis.timeComplexity)) {
    feedback.push(
      "The algorithm has a high time complexity. Consider reducing nested loops or exploring iterative alternatives to recursion."
    );
  } else if (analysis.timeComplexity === 'O(n log n)') {
    feedback.push(
      "The algorithm has a time complexity of O(n log n). While efficient, consider if there's room for further optimization."
    );
  }

  // Space complexity feedback
  if (analysis.spaceComplexity !== 'O(1)') {
    feedback.push(
      "The algorithm uses additional space that scales with input size. Can it be improved to use constant space instead?"
    );
  }

  // Loop nesting feedback
  if (analysis.loopNestDepth > 2) {
    feedback.push(
      "The code contains deeply nested loops, which can significantly impact performance on large inputs. Refactoring or optimizing the loop structure could help."
    );
  }

  // Recursion feedback
  if (analysis.recursion) {
    feedback.push(
      "Recursion is used in the solution. While sometimes necessary, recursion can lead to high memory usage. Consider iterative alternatives if possible."
    );
  }

  // Data structure feedback
  if (analysis.dataStructures.has('Array')) {
    feedback.push(
      "The solution uses arrays. In some cases, using a hash map (object) might offer faster lookups or easier management of data."
    );
  }

  if (analysis.dataStructures.has('Object') && analysis.dataStructures.has('Array')) {
    feedback.push(
      "You're using both arrays and objects. Evaluate if both are necessary, or if a single data structure could suffice for a cleaner solution."
    );
  }

  if (analysis.dataStructures.size === 0) {
    feedback.push(
      "No data structures were detected in the code. Consider if using arrays, objects, or other structures could simplify or speed up your solution."
    );
  }

  return prioritizeFeedback(feedback);
}

// Helper function to prioritize feedback
function prioritizeFeedback(feedback: string[]): string[] {
  // Example prioritization: sort feedback based on issue severity
  const priority = [
    "The algorithm has a high time complexity.",
    "The algorithm uses additional space that scales with input size.",
    "The code contains deeply nested loops.",
    "Recursion is used in the solution.",
  ];

  return feedback.sort((a, b) => {
    const priorityA = priority.findIndex(p => a.startsWith(p));
    const priorityB = priority.findIndex(p => b.startsWith(p));

    return (priorityA === -1 ? Infinity : priorityA) - (priorityB === -1 ? Infinity : priorityB);
  });
}
  