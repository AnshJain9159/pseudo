/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Zap, Code } from 'lucide-react';

import { Code2, PenTool, Bot, Terminal, Play } from "lucide-react";
import dynamic from 'next/dynamic';

const ExcalidrawWrapper = dynamic(
  async () => (await import('@/components/Canvas')).default,
  { ssr: false }

);
// Dynamically import Excalidraw to avoid SSR issues
interface Feature {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  image: string;
}

const FEATURE_CARDS: Feature[] = [
  {
    icon: Brain,
    title: "Socratic Method",
    description: "Guided learning through intelligent questioning and systematic discovery",
    image: "vector-art-of-agora-of-socratic-method-minimal-sty.jpg"
  },
  {
    icon: Zap,
    title: "Personalized Learning",
    description: "Adaptive feedback and learning paths tailored to your unique progress",
    image: "vector-art-of-personalized-learning-minimal-style-.jpg"
  },
  {
    icon: Code,
    title: "Interactive Coding",
    description: "Real-time code execution and testing in an immersive environment",
    image: "vector-art-of-interactive-coding-environment-style.jpg"
  }
];

function InteractiveFeatureCard({ icon, title, description, image }: Feature) {
  return (
    <div className="group relative h-[400px] rounded-3xl bg-black border border-zinc-800 overflow-hidden transition-all duration-500 hover:border-zinc-700 hover:scale-[1.02] hover:z-10">
      {/* Feature Image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient Overlay - Made stronger for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-80" />
      </div>
      
      {/* Content - Positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="flex items-center space-x-3 mb-3">
          {icon && React.createElement(icon, { className: "w-5 h-5 text-white" })}
          <h3 className="text-2xl font-medium text-white">{title}</h3>
        </div>
        <p className="text-sm text-zinc-300">{description}</p>
      </div>
    </div>
  );
}

function GravityField({ mousePosition }: { mousePosition: { x: number, y: number } }) {
  return (
    <div className="absolute inset-0">
      {/* Base Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(64, 64, 64) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(64, 64, 64) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Mouse Follow Effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.03), transparent)`,
          transition: 'all 0.15s ease-out',
        }}
      />
    </div>
  );
}

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  return (
    <main className="min-h-screen bg-black text-white" onMouseMove={handleMouseMove}>
      <div className="relative min-h-screen flex flex-col items-center">
        {/* Single Background Grid */}
        <GravityField mousePosition={mousePosition} />

        {/* Content */}
        <div className="relative w-full max-w-6xl mx-auto px-8 py-16">
          {/* Hero Section */}
          <div className="min-h-screen flex flex-col justify-center items-center">
            <div className="relative max-w-6xl mx-auto w-full">
              {/* Top Content */}
              <div className="text-center mb-16">
                <div className="flex justify-center py-12">
                  <img
                    src="/SOCRATES.svg"
                    alt="Socrates Logo"
                    className="h-16"
                  />
                </div>
                
                <p className="text-xl text-zinc-400 font-light tracking-wide max-w-2xl mx-auto mb-8">
                  Master Computer Science through AI-powered Socratic questioning.
                </p>
                
                <div className="flex justify-center"> 
                  <a href="/main">
                    <Button className="bg-white  text-black hover:bg-zinc-200 font-medium px-8 py-6 rounded-xl transition duration-300 flex items-center text-sm">
                      Start Learning
                      <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </a>
                </div>
              </div>

              {/* Preview Component */}
              <div className="relative w-full transform hover:scale-[1.02] transition-transform duration-500">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-700 to-zinc-700 rounded-xl blur opacity-20"></div>
                <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-black">
                  {/* Window Controls */}
                  <div className="flex items-center space-x-2 px-4 py-3 border-b border-zinc-800">
                    <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                    <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                    <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-px bg-zinc-800">
                    {/* Code Editor Side */}
                    <div className="bg-black p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Code className="w-4 h-4 text-zinc-400" />
                          <span className="text-sm font-medium text-zinc-300">Code Editor</span>
                        </div>
                      </div>
                      <pre className="font-mono text-sm text-zinc-300 bg-zinc-900/50 p-4 rounded-lg">
                        <code>{`def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1`}</code>
                      </pre>
                    </div>

                    {/* Right Side Split View */}
                    <div className="bg-black flex flex-col">
                      {/* Canvas Section */}
                      <div className="border-b border-zinc-800">
                        <div className="flex items-center space-x-3 px-6 py-3 border-b border-zinc-800">
                          <PenTool className="w-4 h-4 text-zinc-400" />
                          <span className="text-sm font-medium text-zinc-300">Visual Canvas</span>
                        </div>
                        <div className="h-[200px] w-full bg-zinc-900/50 p-4">
                          {/* Visual representation of a binary search tree */}
                          <div className="h-full w-full flex items-center justify-center">
                            <div className="relative">
                              {/* Simple visual representation */}
                              <svg width="200" height="120" viewBox="0 0 200 120" className="text-zinc-600">
                                <line x1="100" y1="20" x2="50" y2="60" stroke="currentColor" />
                                <line x1="100" y1="20" x2="150" y2="60" stroke="currentColor" />
                                <circle cx="100" cy="20" r="15" fill="currentColor" opacity="0.2" />
                                <circle cx="50" cy="60" r="15" fill="currentColor" opacity="0.2" />
                                <circle cx="150" cy="60" r="15" fill="currentColor" opacity="0.2" />
                                <text x="95" y="25" fill="white" fontSize="12">8</text>
                                <text x="45" y="65" fill="white" fontSize="12">4</text>
                                <text x="145" y="65" fill="white" fontSize="12">12</text>
                              </svg>
                              {/* Animated cursor dot */}
                              <div className="absolute top-0 right-0 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Chat Section */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 px-6 py-3 border-b border-zinc-800">
                          <Bot className="w-4 h-4 text-zinc-400" />
                          <span className="text-sm font-medium text-zinc-300">AI Assistant</span>
                        </div>
                        <div className="p-6">
                          <p className="text-sm text-zinc-400">
                            Let&apos;s explore how binary search works. What happens if we search for a number that&apos;s not in the array?
                          </p>
                          <div className="flex items-center space-x-2 mt-4 text-zinc-500">
                            <Terminal className="w-4 h-4" />
                            <span className="animate-pulse">_</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className={`
            fixed bottom-8 left-1/2 -translate-x-1/2 
            flex flex-col items-center text-zinc-500 
            transition-all duration-500 ease-in-out
            ${isAtTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
          `}
        >
          <span className="text-xs mb-2">Scroll to explore features</span>
          <ArrowRight className="w-4 h-4 rotate-90" />
        </div>
      </div>

      {/* Features Section - Updated padding and max-width */}
      <div className="py-10 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 [&:has(>*:hover)>*:not(:hover)]:opacity-50 [&:has(>*:hover)>*:not(:hover)]:blur-sm [&:has(>*:hover)>*:not(:hover)]:scale-95">
            {FEATURE_CARDS.map((card, index) => (
              <InteractiveFeatureCard
                key={index}
                icon={card.icon}
                title={card.title}
                description={card.description}
                image={card.image}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
