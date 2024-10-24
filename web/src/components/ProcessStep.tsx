import React from 'react';

interface ProcessStepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ 
  title, 
  description, 
  icon, 
  isActive,
  onClick 
}) => {
  return (
    <div 
      className={` 
        bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl p-6 border 
        transition-all duration-300 cursor-pointer transform
        ${isActive ? 'ring-2 ring-purple-500 shadow-purple-500/50 scale-105' : 'hover:shadow-purple-500/50 hover:border-purple-500'}
      `}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`
          transition-colors duration-300
          ${isActive ? 'text-purple-400' : 'text-gray-500'}
        `}>
          {icon}
        </div>
        <h3 className={`
          text-xl font-semibold transition-colors duration-300
          ${isActive ? 'text-purple-300' : 'text-white'}
        `}>
          {title}
        </h3>
      </div>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default ProcessStep;
