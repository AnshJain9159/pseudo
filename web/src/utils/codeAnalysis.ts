/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import * as acorn from 'acorn';
import * as walk from 'acorn-walk';

interface Complexity {
  timeComplexity: string;
  spaceComplexity: string;
  loopNestDepth: number;
  recursion: boolean;
  dataStructures: Set<string>;
}

export async function parseCode(code: string, language: string): Promise<acorn.Node> {
  if (language !== 'javascript') {
    throw new Error('Only JavaScript is supported at the moment');
  }
  return acorn.parse(code, { ecmaVersion: 2020 }) as acorn.Node;
}

export async function analyzeComplexity(ast: acorn.Node): Promise<Complexity> {
  const complexity: Complexity = {
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    loopNestDepth: 0,
    recursion: false,
    dataStructures: new Set(),
  };
  
  walk.recursive(ast, complexity, {
    ForStatement(node, state, c) {
      // Check for linear or nested loops
      const init = (node as any).init;
      const update = (node as any).update;
      if (init && update && isLinearLoop(init, update)) {
        state.timeComplexity = mergeComplexities(state.timeComplexity, 'O(n)');
      } else {
        state.timeComplexity = mergeComplexities(state.timeComplexity, 'O(n log n)');
      }
      state.loopNestDepth++;
      c((node as any).body, state);
      state.loopNestDepth--;
    },
    WhileStatement(node, state, c) {
      // Assume `while` loops are at least linear unless further analysis is added
      state.timeComplexity = mergeComplexities(state.timeComplexity, 'O(n)');
      state.loopNestDepth++;
      c((node as any).body, state);
      state.loopNestDepth--;
    },
    DoWhileStatement(node, state, c) {
      // Assume `do while` loops are at least linear unless further analysis is added
      state.timeComplexity = mergeComplexities(state.timeComplexity, 'O(n)');
      state.loopNestDepth++;
      c((node as any).body, state);
      state.loopNestDepth--;
    },
    FunctionDeclaration(node, state, c) {
      // Check for recursion by seeing if the function calls itself
      const functionName = (node as any).id?.name;
      if (
        functionName &&
        (node as any).body.body.some(
          (n: acorn.Node) =>
            n.type === 'ReturnStatement' &&
            (n as any).argument?.type === 'CallExpression' &&
            (n as any).argument.callee.name === functionName
        )
      ) {
        state.recursion = true;
        state.timeComplexity = mergeComplexities(state.timeComplexity, 'O(2^n)'); // Assume exponential for basic recursion
      }
      c((node as any).body, state);
    },
    ArrayExpression(node, state) {
      state.dataStructures.add('Array');
      state.spaceComplexity = mergeComplexities(state.spaceComplexity, 'O(n)');
    },
    ObjectExpression(node, state) {
      state.dataStructures.add('Object');
      state.spaceComplexity = mergeComplexities(state.spaceComplexity, 'O(n)');
    },
  });
  return complexity;
}

// Utility function to determine if a loop is likely linear
function isLinearLoop(init: any, update: any): boolean {
  // Check if the loop variable is being incremented or decremented by a constant value
  if (
    init.type === 'VariableDeclaration' &&
    update.type === 'UpdateExpression' &&
    (update.operator === '++' || update.operator === '--')
  ) {
    return true;
  }
  return false;
}

// Improved function to merge complexities correctly
function mergeComplexities(current: string, newComplexity: string): string {
  const order = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)', 'O(2^n)', 'O(n!)'];
  const currentIndex = order.indexOf(current);
  const newIndex = order.indexOf(newComplexity);
  return currentIndex < newIndex ? newComplexity : current;
}
