import React from 'react';
import MatrixAnimation from './MatrixAnimation';

interface StepVisualizerProps {
  step: number;
}

const StepVisualizer: React.FC<StepVisualizerProps> = ({ step }) => {
  // Declare the original parameters at the top of the function
  const originalParams = 10 * 10; // For 10x10 matrix

  // Define time estimates for training on 1 billion parameters
  const traditionalTrainingTime = "13 hours";
  const loraTrainingTime = "4.3 hours";

  const renderVisualization = () => {
    switch (step) {
      case 0: // Pre-trained LLM - Larger Matrix
        return (
          <div className="flex flex-col items-center gap-4">
            <MatrixAnimation 
              rows={10} 
              cols={10} 
              isActive={true} 
            />
            <div className="text-center text-sm text-white">
              <p>Original Model</p>
              <p className="text-xs mt-1">Large Parameter Space</p>
              <p className="text-xs mt-1">{`Parameters: ${originalParams}`}</p>
            </div>
          </div>
        );

      case 1: // Quantization
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <MatrixAnimation rows={10} cols={10} />
              <div className="flex flex-col items-center">
                <span className="text-2xl text-blue-500">→</span>
                <span className="text-sm text-gray-500">Quantize</span>
              </div>
              <MatrixAnimation 
                rows={10} 
                cols={10} 
                highlight 
                isActive={true}
              />
            </div>
            <p className="text-sm text-white">4-bit Precision Conversion</p>
            <p className="text-xs text-gray-400">{`Parameters remain the same: ${originalParams}`}</p>
            <p className="text-xs text-gray-400">Memory usage reduced due to quantization</p>
          </div>
        );

      case 2: // Low-Rank Adaptation - Smaller matrices to show decomposition
        const reducedParams1 = 10 * 3; // Decomposed matrix 1
        const reducedParams2 = 3 * 10; // Decomposed matrix 2
        const totalReducedParams = reducedParams1 + reducedParams2;

        return (
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <MatrixAnimation rows={10} cols={10} />
              <span className="text-2xl">≈</span>
              <MatrixAnimation 
                rows={10} 
                cols={3} 
                highlight 
                isActive={true}
              />
              <span className="text-xl">×</span>
              <MatrixAnimation 
                rows={3} 
                cols={10} 
                highlight 
                isActive={true}
              />
            </div>
            <p className="text-sm text-white">Low-Rank Decomposition</p>
            <p className="text-xs text-gray-400">{`Original Parameters: ${originalParams}`}</p>
            <p className="text-xs text-gray-400">{`Reduced Parameters: ${totalReducedParams}`}</p>
            <p className="text-xs text-gray-400">{`Parameter reduction: ~${Math.round((totalReducedParams / originalParams) * 100)}% of original`}</p>
            <p className="text-xs text-gray-400">{`Training Time (Traditional): ${traditionalTrainingTime}`}</p>
            <p className="text-xs text-gray-400">{`Training Time (LoRA): ${loraTrainingTime}`}</p>
          </div>
        );

      case 3: // Fine-tuned Model
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <MatrixAnimation 
                rows={10} 
                cols={10} 
                highlight 
                isActive={true} 
              />
              <div className="flex flex-col items-center">
                <span className="text-2xl text-green-500">✓</span>
                <span className="text-sm text-white">Optimized</span>
              </div>
            </div>
            <p className="text-sm text-white">Task-Specific Model</p>
            <p className="text-xs text-gray-400">{`Optimized Parameters: ${originalParams}`}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-transparent rounded-2xl shadow-xl p-8 transition-all duration-500">
      {renderVisualization()}
    </div>
  );
};

export default StepVisualizer;
