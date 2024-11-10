import React from 'react';
import { Wand2, RotateCcw } from 'lucide-react';

interface ActionButtonsProps {
  onGenerate: () => void;
  onReset: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export function ActionButtons({ onGenerate, onReset, disabled, isLoading }: ActionButtonsProps) {
  return (
    <div className="flex justify-center gap-4">
      <button
        onClick={onGenerate}
        disabled={disabled}
        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Wand2 className="h-5 w-5" />
        {isLoading ? 'Processing...' : 'Generate Summary'}
      </button>
      <button
        onClick={onReset}
        disabled={isLoading}
        className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RotateCcw className="h-5 w-5" />
        Reset
      </button>
    </div>
  );
}