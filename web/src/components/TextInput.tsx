import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextInput({ value, onChange }: TextInputProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Your Text
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        placeholder="Paste your text here..."
      />
    </div>
  );
}