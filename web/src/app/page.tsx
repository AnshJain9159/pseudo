/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Zap, Code } from 'lucide-react';
import { Code2, PenTool, Bot, Terminal, Play } from "lucide-react";
import { Permanent_Marker, Shadows_Into_Light } from 'next/font/google';

// Initialize the fonts
const permanentMarker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
});

const shadowsIntoLight = Shadows_Into_Light({
  weight: '400',
  subsets: ['latin'],
});

interface Feature {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: Feature) {
  return (
    <Card className="bg-black border border-zinc-800 hover:border-zinc-700 transition-all duration-300">
      <CardContent className="flex flex-col items-center p-6">
        {icon && React.createElement(icon, { className: "w-4 h-4 text-zinc-400" })}
        <h3 className="text-sm font-medium mt-4 mb-2 text-zinc-200">{title}</h3>
        <p className="text-zinc-400 text-center text-xs">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-zinc-400 flex flex-col items-center px-8 pt-24 pb-16 font-sans"> {/* Adjusted padding */}
      {/* Logo Section */}
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <h1 className={`${shadowsIntoLight.className} text-6xl text-zinc-200 tracking-wider`}>
            SOCRATES
          </h1>
        </div>
        
        {/* Title and Description */}
        <p className="text-lg text-gray-400 mb-8"> {/* Changed mb-12 to mb-8 */}
          Master Computer Science through AI-powered Socratic questioning.
        </p>
        
        {/* Start Learning Button */}
        <div className="flex justify-center mb-16"> {/* Added mb-16 */}
          <a href="/main">
            <Button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm px-8 rounded border border-zinc-800 transition duration-300 ease-in-out flex items-center">
              Start Learning
              <ArrowRight className="w-5 h-5 ml-3 text-white" />
            </Button>
          </a>
        </div>
      </div>

      {/* Features Section - removed mt-16 since we added mb-16 to button container */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
      {/* <h1 className='text-3xl font-semibold text-white px-4 py-4'>All at one place...</h1> */}
      <div className="flex-1 max-w-6xl mx-auto px-4 pb-4 mt-8">
        <div className="h-full rounded border border-zinc-800 overflow-hidden">
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
                  <span className="p-0.5 rounded hover:bg-blue-500/10 text-blue-400">
                    <Play className="w-4 h-4" />
                  </span>
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
                    I see you&apos;re implementing binary search. Now imagine what if...
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
