import React from 'react';
import MatrixAnimation from './MatrixAnimation';

interface StepVisualizerProps {
  step: number;
}

const StepVisualizer: React.FC<StepVisualizerProps> = ({ step }) => {
  const renderVisualization = () => {
    switch(step) {
      case 0: // Pre-trained LLM
        return (
          <div className="flex items-center justify-center gap-4">
            <MatrixAnimation 
              rows={6} 
              cols={6} 
              isActive={true} 
            />
            <div className="text-center text-sm text-white">
              <p>Original Model</p>
              <p className="text-xs mt-1">Large Parameter Space</p>
            </div>
          </div>
        );
      
      case 1: // Quantization
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <MatrixAnimation rows={6} cols={6} />
              <div className="flex flex-col items-center">
                <span className="text-2xl text-blue-500">→</span>
                <span className="text-sm text-gray-500">Quantize</span>
              </div>
              <MatrixAnimation 
                rows={6} 
                cols={6} 
                highlight 
                isActive={true}
              />
            </div>
            <p className="text-sm text-white">4-bit Precision Conversion</p>
          </div>
        );
      
      case 2: // Low-Rank Adaptation
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <MatrixAnimation rows={6} cols={6} />
              <span className="text-2xl">≈</span>
              <MatrixAnimation 
                rows={6} 
                cols={2} 
                highlight 
                isActive={true}
              />
              <span className="text-xl">×</span>
              <MatrixAnimation 
                rows={2} 
                cols={6} 
                highlight 
                isActive={true}
              />
            </div>
            <p className="text-sm text-white">Low-Rank Decomposition</p>
          </div>
        );
      
      case 3: // Fine-tuned Model
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <MatrixAnimation 
                rows={6} 
                cols={6} 
                highlight 
                isActive={true}
              />
              <div className="flex flex-col items-center">
                <span className="text-2xl text-green-500">✓</span>
                <span className="text-sm text-white">Optimized</span>
              </div>
            </div>
            <p className="text-sm text-white">Task-Specific Model</p>
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