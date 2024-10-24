import React, { useState, useEffect } from 'react';

interface MatrixAnimationProps {
  rows: number;
  cols: number;
  highlight?: boolean;
  isActive?: boolean;
}

const MatrixAnimation: React.FC<MatrixAnimationProps> = ({ rows, cols, highlight, isActive }) => {
  const [values, setValues] = useState<number[][]>([]);
  
  useEffect(() => {
    const newValues = Array(rows).fill(0).map(() => 
      Array(cols).fill(0).map(() => parseFloat((Math.random()).toFixed(1)))
    );
    setValues(newValues);
  }, [rows, cols, isActive]);

  const baseClasses = "grid transition-all duration-500";
  const highlightClasses = highlight 
    ? "bg-blue-100 border-blue-400 shadow-lg" 
    : "bg-gray-50 border-gray-200";
  const activeClasses = isActive 
    ? "scale-105 shadow-xl" 
    : "scale-100";

  return (
    <div className={`
      ${baseClasses} 
      ${highlightClasses} 
      ${activeClasses}
      border rounded-lg p-1
      grid-cols-${cols}
    `}>
      {values.flat().map((value, i) => (
        <div
          key={i}
          className={`
            aspect-square border border-opacity-20 
            rounded-sm flex items-center justify-center 
            text-xs font-mono transition-all duration-300
            ${isActive ? 'text-blue-600 font-bold' : 'text-gray-600'}
          `}
        >
          {value}
        </div>
      ))}
    </div>
  );
};

export default MatrixAnimation;