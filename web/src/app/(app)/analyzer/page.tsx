"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from 'components/ui/card';
import { Button } from 'components/ui/button';
import { Textarea } from 'components/ui/textarea';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Analysis {
  timeComplexity: string;
  spaceComplexity: string;
  loopNestDepth: number;
  recursion: boolean;
  dataStructures: Set<string>;
}

const ComplexityAnalyzer: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [feedback, setFeedback] = useState<string[]>([]);

  const analyzeCode = async () => {
    try {
      const response = await fetch('/api/analyse-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: 'javascript' }),
      });
      const data = await response.json();
      setAnalysis(data.analysis);
      setFeedback(data.feedback);
    } catch (error) {
      console.error("Error analyzing code:", error);
    }
  };

  const complexityData = [
    { n: 1, O1: 1, Ologn: 0, On: 1, Onlogn: 0, On2: 1, O2n: 2 },
    { n: 2, O1: 1, Ologn: 1, On: 2, Onlogn: 2, On2: 4, O2n: 4 },
    { n: 4, O1: 1, Ologn: 2, On: 4, Onlogn: 8, On2: 16, O2n: 16 },
    { n: 8, O1: 1, Ologn: 3, On: 8, Onlogn: 24, On2: 64, O2n: 256 },
    { n: 16, O1: 1, Ologn: 4, On: 16, Onlogn: 64, On2: 256, O2n: 65536 },
  ];

  const complexityColors = {
    'O(1)': '#8884d8',
    'O(log n)': '#82ca9d',
    'O(n)': '#ffc658',
    'O(n log n)': '#ff7300',
    'O(n^2)': '#ff0000',
    'O(2^n)': '#00C49F'
  };

  const getComplexityKey = (complexity: string): string => {
    const map: { [key: string]: string } = {
      'O(1)': 'O1',
      'O(log n)': 'Ologn',
      'O(n)': 'On',
      'O(n log n)': 'Onlogn',
      'O(n^2)': 'On2',
      'O(2^n)': 'O2n'
    };
    return map[complexity] || 'On';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-6 py-12 font-sans">
      <Card className="w-full max-w-4xl border border-zinc-800 bg-black shadow-lg text-zinc-100">
        <CardHeader className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Code Analyzer</h1>
          <p className="text-zinc-400 text-lg">Analyze your code's algorithmic complexity</p>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="space-y-4">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your JavaScript code here..."
              className="h-64 bg-zinc-900 text-zinc-100 border border-zinc-800 focus:ring-2 focus:ring-zinc-700 transition duration-200 resize-none font-mono"
            />
            <div className="flex justify-center">
              <Button
                onClick={analyzeCode}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium px-8 py-2 rounded-lg transition-all duration-200"
              >
                Analyze Complexity
              </Button>
            </div>
          </div>

          {analysis && (
            <div className="space-y-6 border-t border-zinc-800 pt-6">
              <div>
                <h3 className="text-xl font-medium text-zinc-100 mb-4">Analysis Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-zinc-400">Time Complexity: <span className="text-zinc-100">{analysis.timeComplexity}</span></p>
                    <p className="text-zinc-400">Space Complexity: <span className="text-zinc-100">{analysis.spaceComplexity}</span></p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-zinc-400">Loop Nesting Depth: <span className="text-zinc-100">{analysis.loopNestDepth}</span></p>
                    <p className="text-zinc-400">Recursion: <span className="text-zinc-100">{analysis.recursion ? 'Yes' : 'No'}</span></p>
                  </div>
                </div>
                <p className="text-zinc-400 mt-4">Data Structures: <span className="text-zinc-100">{Array.from(analysis.dataStructures).join(', ') || 'None'}</span></p>
              </div>

              {feedback.length > 0 && (
                <div>
                  <h3 className="text-xl font-medium text-zinc-100 mb-4">Feedback</h3>
                  <ul className="space-y-2 text-zinc-400">
                    {feedback.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-xl font-medium text-zinc-100 mb-4">Complexity Visualization</h3>
                <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={complexityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="n" stroke="#71717a" />
                      <YAxis stroke="#71717a" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#18181b',
                          border: '1px solid #27272a',
                          borderRadius: '0.5rem'
                        }} 
                        labelStyle={{ color: '#71717a' }}
                      />
                      <Legend />
                      {Object.entries(complexityColors).map(([complexity, color]) => (
                        <Line 
                          key={complexity}
                          type="monotone" 
                          dataKey={getComplexityKey(complexity)} 
                          stroke={color}
                          strokeWidth={complexity === analysis.timeComplexity ? 3 : 1}
                          dot={complexity === analysis.timeComplexity}
                          name={complexity}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplexityAnalyzer;