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
      "The algorithm has a high time complexity, which can lead to poor performance with large input sizes. Consider techniques like dynamic programming, greedy algorithms, or divide-and-conquer strategies to potentially lower the time complexity."
    );
  } else if (analysis.timeComplexity === 'O(n log n)') {
    feedback.push(
      "The algorithm has a time complexity of O(n log n), which is efficient for most cases. However, review if there are specific conditions or smaller cases where a linear or constant time solution could be applied."
    );
  } else if (analysis.timeComplexity === 'O(n)') {
    feedback.push(
      "The algorithm operates with linear time complexity, which is often acceptable. Still, assess if the problem's constraints allow for constant-time operations in some cases."
    );
  }

  // Space complexity feedback
  if (analysis.spaceComplexity !== 'O(1)') {
    feedback.push(
      "The algorithm uses additional space that scales with input size. Consider in-place algorithms or explore data structures like arrays or linked lists that can help maintain constant space usage."
    );
  }

  // Loop nesting feedback
  if (analysis.loopNestDepth > 2) {
    feedback.push(
      "The code contains deeply nested loops, which can significantly impact performance. Look for opportunities to refactor the code using data structures like hash maps or flatten the nested loops through smarter indexing."
    );
  } else if (analysis.loopNestDepth === 2) {
    feedback.push(
      "The code has two nested loops. Ensure that both loops are necessary, and explore flattening the nested loop or utilizing precomputed data structures for faster lookups."
    );
  }

  // Recursion feedback
  if (analysis.recursion) {
    feedback.push(
      "Recursion is used in the solution, which can lead to high memory consumption due to stack space usage. If recursion depth is significant, consider converting the recursive solution to an iterative one or using tail recursion if supported by the language."
    );
  }

  // Data structure feedback
  if (analysis.dataStructures.has('Array')) {
    feedback.push(
      "The solution uses arrays, which are effective for ordered collections. However, if you are frequently searching or updating elements, consider a hash map or set to achieve better performance."
    );
  }

  if (analysis.dataStructures.has('Object') && analysis.dataStructures.has('Array')) {
    feedback.push(
      "You're using both arrays and objects. Evaluate if both are necessary, or if a single data structure could suffice for better memory efficiency and cleaner logic."
    );
  }

  if (analysis.dataStructures.size === 0) {
    feedback.push(
      "No data structures were detected in the code. Consider if using arrays, hash maps, or other structures could simplify or speed up your solution by reducing the number of operations."
    );
  }

  // Prioritize and return the feedback
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
