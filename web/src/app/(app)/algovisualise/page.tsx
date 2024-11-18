/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Code2 } from 'lucide-react';
import { AlgorithmVisualizer } from '@/components/AlgorithmVisualizer';
import { AlgorithmControls } from '@/components/AlgorithmControls';
import { algorithms } from '@/algorithms/algorithms';
import { generateRandomArray } from '@/algorithms/types';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlgo, setSelectedAlgo] = useState<string | null>(null);
  const [config, setConfig] = useState({
    arraySize: 10,
    delay: 1000,
    graphNodes: 6,
    weighted: true,
    directed: false,
    treeNodes: 7,
    traversalType: 'inorder'
  });
  const [steps, setSteps] = useState<any[]>([]);

  const filteredAlgorithms = Object.entries(algorithms).filter(([name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (selectedAlgo) {
      const algorithm = algorithms[selectedAlgo];
      const algorithmConfig = {
        ...config,
        array: generateRandomArray(config.arraySize)
      };
      const newSteps = algorithm.generator(algorithmConfig);
      setSteps(newSteps);
    }
  }, [selectedAlgo, config]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-300">
      <div className="pt-16"> {/* Added padding to the top */}
        <main className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-12 py-8">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-3">
              <div className="bg-zinc-900 rounded-xl shadow-lg p-6 border border-gray-700">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-purple-500" />
                  Algorithms
                </h2>
                <div className="space-y-2">
                  {filteredAlgorithms.map(([name, algo]) => (
                    <button
                      key={name}
                      onClick={() => setSelectedAlgo(name)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedAlgo === name
                          ? 'bg-purple-600 text-white'
                          : 'hover:bg-zinc-800 text-gray-300'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-9">
              {selectedAlgo ? (
                <div className="space-y-6">
                  <div className="bg-zinc-900 rounded-xl shadow-lg p-6 border border-gray-700">
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedAlgo}</h2>
                    <p className="text-gray-400 mb-4">{algorithms[selectedAlgo].description}</p>
                    <div className="flex space-x-6">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Time Complexity</span>
                        <p className="text-purple-500 font-mono">{algorithms[selectedAlgo].timeComplexity}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Space Complexity</span>
                        <p className="text-purple-500 font-mono">{algorithms[selectedAlgo].spaceComplexity}</p>
                      </div>
                    </div>
                  </div>

                  <AlgorithmControls
                    type={algorithms[selectedAlgo].type}
                    config={config}
                    onConfigChange={setConfig}
                  />

                  <AlgorithmVisualizer
                    steps={steps}
                    delay={config.delay}
                  />
                </div>
              ) : (
                <div className="bg-zinc-900 rounded-xl shadow-lg p-12 text-center border border-gray-700">
                  <Code2 className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Select an Algorithm</h2>
                  <p className="text-gray-400">
                    Choose an algorithm from the sidebar to start visualizing!
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
