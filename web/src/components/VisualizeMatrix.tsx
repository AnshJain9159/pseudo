import React from 'react';
import { Grid, ArrowRight, Layers, Cpu } from 'lucide-react';

interface MatrixProps {
  size: 'sm' | 'lg';
  highlight?: boolean;
  label?: string;
}

const VisualizeMatrix: React.FC<MatrixProps> = ({ size, highlight, label }) => {
  const baseClasses = "grid transition-all duration-300 relative";
  const sizeClasses = size === 'sm' ? "w-16 h-16 grid-cols-3" : "w-24 h-24 grid-cols-4";
  const highlightClasses = highlight ? "bg-blue-100 border-blue-400" : "bg-gray-50 border-gray-200";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${baseClasses} ${sizeClasses} ${highlightClasses} border rounded-lg p-1`}>
        {Array.from({ length: size === 'sm' ? 9 : 16 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square border border-opacity-20 rounded-sm flex items-center justify-center text-xs font-mono"
          >
            {Math.random().toFixed(1)}
          </div>
        ))}
      </div>
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </div>
  );
};

export default VisualizeMatrix;