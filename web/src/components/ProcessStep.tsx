import React from 'react';

interface ProcessStepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ 
  title, 
  description, 
  icon, 
  isActive,
  onClick,
  className = ''
}) => {
  return (
    <div 
      className={`
        p-6 rounded-xl border transition-all duration-200 cursor-pointer
        ${isActive ? 'border-zinc-700' : 'border-zinc-800'}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`
          transition-colors duration-200
          ${isActive ? 'text-zinc-100' : 'text-zinc-400'}
        `}>
          {icon}
        </div>
        <h3 className={`
          text-xl font-medium transition-colors duration-200
          ${isActive ? 'text-zinc-100' : 'text-zinc-300'}
        `}>
          {title}
        </h3>
      </div>
      <p className="text-zinc-400">{description}</p>
    </div>
  );
};

export default ProcessStep;
