import React from 'react';
import { Copy } from 'lucide-react';

interface SummaryOutputProps {
  summary: string;
  onCopy: () => void;
}

export function SummaryOutput({ summary, onCopy }: SummaryOutputProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-600">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Summary</h2>
        <button
          onClick={onCopy}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Copy className="h-5 w-5" />
          Copy
        </button>
      </div>
      <p className="text-gray-700 leading-relaxed">{summary}</p>
    </div>
  );
}