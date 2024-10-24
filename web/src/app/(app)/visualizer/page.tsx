"use client";
import React, { useState } from 'react';
import { Brain, Cpu, Database, Layers, LightbulbIcon, Grid, Scale, Zap } from 'lucide-react';
import ProcessStep from '@/components/ProcessStep';
import StepVisualizer from '@/components/StepVisualizer';

function App() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Pre-trained LLM",
      description: "Start with a large language model pre-trained on vast amounts of data",
      icon: <Brain className="w-6 h-6" />
    },
    {
      title: "Quantization (QLoRA)",
      description: "Reduce model precision while maintaining performance",
      icon: <Scale className="w-6 h-6" />
    },
    {
      title: "Low-Rank Adaptation",
      description: "Train small rank decomposition matrices instead of full weights",
      icon: <Grid className="w-6 h-6" />
    },
    {
      title: "Fine-tuned Model",
      description: "Resulting model adapted to specific tasks with minimal parameters",
      icon: <LightbulbIcon className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            LoRA & QLoRA Visualization
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Understanding Low-Rank Adaptation and Quantized Fine-tuning for Large Language Models
          </p>
        </header>

        {/* Interactive Process Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <ProcessStep
              key={index}
              {...step}
              isActive={activeStep === index}
              onClick={() => setActiveStep(index)}
              className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-purple-500/50"
            />
          ))}
        </div>

        {/* Dynamic Visualization */}
        <div className="mb-16">
          <StepVisualizer step={activeStep} />
        </div>

        {/* Technical Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">QLoRA Benefits</h3>
            </div>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <Zap className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                <span>4-bit quantization reduces memory usage by up to 75%</span>
              </li>
              <li className="flex items-start gap-2">
                <Database className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <span>Enables fine-tuning on consumer GPUs</span>
              </li>
              <li className="flex items-start gap-2">
                <Layers className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                <span>Maintains model quality through double quantization</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Grid className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">LoRA Architecture</h3>
            </div>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <Layers className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                <span>Trains rank decomposition matrices instead of full weights</span>
              </li>
              <li className="flex items-start gap-2">
                <Scale className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <span>Typically uses rank 8-32 for optimal balance</span>
              </li>
              <li className="flex items-start gap-2">
                <LightbulbIcon className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                <span>Enables efficient task-specific adaptations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
