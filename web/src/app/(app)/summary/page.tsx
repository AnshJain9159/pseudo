"use client"
import React, { useState } from 'react';
import { Header } from 'components/Header';

import { TextInput } from 'components/TextInput';
import { ActionButtons } from 'components/ActionButtons';
import { SummaryOutput } from 'components/SummaryOutput';
import { summarizeText } from 'utils/nlp';
import { LoadingSpinner } from 'components/LoadingSpinner';

export default function App() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateSummary = async () => {
    setIsLoading(true);
    try {
      const generatedSummary = await summarizeText(text);
      setSummary(generatedSummary);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const reset = () => {
    setText('');
    setSummary('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Header />
        
        <div className="space-y-6">
          <TextInput value={text} onChange={setText} />
          <ActionButtons 
            onGenerate={generateSummary}
            onReset={reset}
            disabled={!text || isLoading}
            isLoading={isLoading}
          />
          {isLoading && <LoadingSpinner />}
          {summary && <SummaryOutput summary={summary} onCopy={copyToClipboard} />}
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Using TensorFlow.js for ML-powered text summarization</p>
        </footer>
      </div>
    </div>
  );
}