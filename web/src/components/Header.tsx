import React from 'react';
import { FileText } from 'lucide-react';

export function Header() {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center mb-4">
        <FileText className="h-12 w-12 text-indigo-600" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        NLP Summary Generator
      </h1>
      <p className="text-lg text-gray-600">
        Transform your documents into intelligent summaries using NLP
      </p>
    </div>
  );
}