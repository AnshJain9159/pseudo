import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Zap, Code } from 'lucide-react';
import {
  Code2,
  PenTool,
  Bot,
  Terminal,
  Play,
} from "lucide-react";
interface Feature {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: Feature) {
  return (
    <Card className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-purple-500/50">
      <CardContent className="flex flex-col items-center p-6">
        {icon && React.createElement(icon, { className: "w-10 h-10 text-purple-400" })}
        <h3 className="text-xl font-semibold mt-4 mb-2 text-white">{title}</h3>
        <p className="text-gray-400 text-center text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  return (
    <div className="h-screen bg-gradient-to-b from-black to-gray-900 text-gray-300 overflow-hidden flex flex-col justify-center items-center space-y-6 p-8 font-sans">
      {/* Logo Section */}
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center py-6">
                  <img
                    src="/Socrates Logo.svg"
                    alt="Socrates Logo"
                    className="h-full"
                  />
        </div>
        
        {/* Title and Description */}
        
        <p className="text-lg text-gray-400 mb-10">
          Master Data Structures & Algorithms through AI-powered Socratic questioning.
        </p>
        
        {/* Start Learning Button */}
        <div className="flex justify-center">  {/* Ensure centering */}
          
          <a href="/main"><Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out shadow-lg hover:shadow-purple-500/50 flex items-center">
            Start Learning
            <ArrowRight className="w-5 h-5 ml-3 text-white" />
          </Button>
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
        <FeatureCard
          icon={Brain}
          title="Socratic Method"
          description="Guided learning through intelligent questioning"
        />
        <FeatureCard
          icon={Zap}
          title="Personalized"
          description="Adaptive feedback tailored to your progress"
        />
        <FeatureCard
          icon={Code}
          title="Interactive Coding"
          description="Practice and test your code in real-time"
        />
      </div>

      <div className="flex-1 max-w-6xl mx-auto px-4 pb-4">
          <div className="h-full rounded-xl overflow-hidden border border-zinc-800/50">
            <div className="flex items-center space-x-2 px-3 py-2 bg-zinc-900/80 border-b border-zinc-800/50">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
            </div>
            <div className="grid grid-cols-2 gap-px bg-zinc-800/50 h-[calc(100%-2.5rem)]">
              {/* Code Cells */}
              <div className="bg-zinc-900/50 p-4 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Code2 className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium">Code Cell</span>
                  </div>
                  <div className="flex space-x-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      In [1]:
                    </span>
                    <button className="p-0.5 rounded hover:bg-blue-500/10 text-blue-400">
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <pre className="font-mono text-sm text-zinc-300 bg-zinc-950 p-3 rounded-lg flex-1">
                  <code>{`def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1`}</code>
                </pre>
              </div>

              {/* Canvas & Chat */}
              <div className="bg-zinc-900/50 flex flex-col">
                {/* Canvas */}
                <div className="border-b border-zinc-800/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <PenTool className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium">Visual Canvas</span>
                    </div>
                    <button className="p-0.5 rounded hover:bg-blue-500/10 text-blue-400">
                      <PenTool className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="h-24 bg-zinc-950 rounded-lg flex items-center justify-center border border-zinc-800/50">
                    <span className="text-sm text-zinc-500">
                      Interactive visualization area
                    </span>
                  </div>
                </div>

                {/* Chat */}
                <div className="flex-1 p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Bot className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium">AI Assistant</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <p className="text-zinc-400">
                      I see you're implementing binary search. Let me help
                      explain the algorithm step by step...
                    </p>
                    <div className="flex items-center space-x-2 text-blue-400">
                      <Terminal className="w-4 h-4" />
                      <span>_</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
