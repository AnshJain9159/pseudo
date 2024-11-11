import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { GraphVisualizer } from './GraphVisualizer';
import { TreeVisualizer } from './TreeVisualizer';

interface Step {
  description: string;
  array: number[];
  currentIndex: number;
  compareIndex: number;
  graphData?: {
    nodes: { id: string; visited?: boolean; distance?: number }[];
    edges: { source: string; target: string; weight?: number; active?: boolean }[];
  };
  treeData?: {
    nodes: { id: string; value: number; visited?: boolean }[];
    edges: { source: string; target: string }[];
  };
  activeNodeId?: string; // Add activeNodeId to highlight the current node in TreeVisualizer
}

export const AlgorithmVisualizer = ({ steps, delay = 1000 }: { steps: Step[]; delay?: number }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1 < steps.length ? prev + 1 : prev));
      }, delay);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, delay]);

  // Reset current step when steps change
  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [steps]);

  // Guard against empty steps array
  if (!steps || steps.length === 0) {
    return (
      <div className="w-full max-w-4xl bg-zinc-900 rounded-xl shadow-lg p-6">
        <p className="text-gray-400 text-center">Select an algorithm to begin visualization</p>
      </div>
    );
  }

  const step = steps[currentStep];

  return (
    <div className="w-full max-w-4xl bg-zinc-900 rounded-xl shadow-lg p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-semibold text-white">
          Step {currentStep + 1}/{steps.length}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep(0)}
            className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
            disabled={currentStep === 0}
          >
            <SkipBack className={`w-5 h-5 ${currentStep === 0 ? 'text-gray-500' : 'text-purple-500'}`} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
            disabled={currentStep === steps.length - 1}
          >
            {isPlaying ? 
              <Pause className="w-5 h-5 text-purple-500" /> : 
              <Play className={`w-5 h-5 ${currentStep === steps.length - 1 ? 'text-gray-500' : 'text-purple-500'}`} />
            }
          </button>
          <button
            onClick={() => setCurrentStep(steps.length - 1)}
            className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
            disabled={currentStep === steps.length - 1}
          >
            <SkipForward className={`w-5 h-5 ${currentStep === steps.length - 1 ? 'text-gray-500' : 'text-purple-500'}`} />
          </button>
        </div>
      </div>

      <div className="mb-6">
        {step.array && step.array.length > 0 && (
          <div className="flex justify-center gap-2">
            {step.array.map((value, index) => (
              <div
                key={index}
                className={`w-12 h-12 flex items-center justify-center rounded-lg text-white font-bold transition-all duration-300 ${
                  index === step.currentIndex
                    ? 'bg-blue-500 transform scale-110'
                    : index === step.compareIndex
                    ? 'bg-green-500'
                    : 'bg-gray-700'
                }`}
                style={{
                  transform: `translateY(${index === step.currentIndex ? '-8px' : '0'})`,
                }}
              >
                {value}
              </div>
            ))}
          </div>
        )}

        {step.graphData && (
          <GraphVisualizer
            nodes={step.graphData.nodes}
            edges={step.graphData.edges}
          />
        )}

        {step.treeData && (
          <TreeVisualizer
            nodes={step.treeData.nodes}
            edges={step.treeData.edges}
            activeNodeId={step.activeNodeId} // Pass activeNodeId to TreeVisualizer
          />
        )}
      </div>

      <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
        <p className="text-gray-300">{step.description}</p>
      </div>
    </div>
  );
};
