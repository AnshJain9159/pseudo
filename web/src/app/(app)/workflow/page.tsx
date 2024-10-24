import React from 'react';
import { Code, UserCircle, Network, BarChart2 } from "lucide-react";

const TechLogo = ({ name, size = "w-8 h-8" }) => (
    <img 
    src={`/api/logos/${name.toLowerCase()}`} 
    alt={`${name} logo`} 
    className={`${size} object-contain`}
  />
);

const Arrow = () => (
  <div className="h-16 w-px bg-gradient-to-b from-purple-500 to-pink-500 mx-auto relative">
    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 rotate-45 w-3 h-3 border-r-2 border-b-2 border-pink-500"></div>
  </div>
);

export default function WorkflowPage() {
  return (
    <div className="bg-gradient-to-b from-slate-950 to-slate-900 min-h-screen mx-auto p-12 space-y-12">
      <header className="text-center max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          Socrates Platform Workflow
        </h1>
        <p className="text-xl text-gray-400">
          A comprehensive overview of the Socrates learning platform&apos;s architecture and user journey
        </p>
      </header>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Authentication */}
        <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl shadow-xl">
          <div className="flex items-start gap-6">
            <UserCircle className="w-12 h-12 text-blue-400" />
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white mb-4">Authentication & Authorization</h2>
              <p className="text-gray-300 mb-6">
                Enterprise-grade security implementation utilizing blockchain technology and distributed database architecture.
              </p>
              <div className="flex gap-6 items-center">
                <div className="flex flex-col items-center">
                    <img 
                        src='https://www.svglogos.net/wp-content/uploads/mongodb.svg' 
                        alt={`logo`} 
                        className={`w-8 h-8 object-contain`}
                    />
                  <span className="text-sm text-gray-400 mt-2">MongoDB</span>
                </div>
                <div className="flex flex-col items-center">
                <img 
                        src='https://www.svglogos.net/wp-content/uploads/solidity.svg' 
                        alt={`logo`} 
                        className={`w-8 h-8 object-contain`}
                    />                  <span className="text-sm text-gray-400 mt-2">Solidity</span>
                </div>
                <div className="flex flex-col items-center">
                <img 
                        src='https://www.svglogos.net/wp-content/uploads/truffle.svg' 
                        alt={`logo`} 
                        className={`w-8 h-8 object-contain`}
                    />
                  <span className="text-sm text-gray-400 mt-2">Truffle</span>
                </div>
                <div className="flex flex-col items-center">
                  <img 
                        src='https://www.svglogos.net/wp-content/uploads/ganache.svg' 
                        alt={`logo`} 
                        className={`w-8 h-8 object-contain`}
                    />
                  <span className="text-sm text-gray-400 mt-2">Ganache</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Arrow />

        {/* Integrated Development Environment */}
        <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl shadow-xl">
          <div className="flex items-start gap-6">
            <Code className="w-12 h-12 text-green-400" />
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white mb-4">Intelligent Development Environment</h2>
              <p className="text-gray-300 mb-6">
                Advanced coding environment featuring real-time AI assistance, integrated drawing tools, and intelligent code suggestions.
              </p>
              <div className="flex gap-6 items-center">
                <div className="flex flex-col items-center">
                <img 
                        src='https://www.svglogos.net/wp-content/uploads/nextjs.svg' 
                        alt={`logo`} 
                        className={`w-8 h-8 object-contain`}
                    />                  <span className="text-sm text-gray-400 mt-2">Next.js</span>
                </div>
                <div className="flex flex-col items-center">
                <img 
                        src='https://www.svglogos.net/wp-content/uploads/meta-1.svg' 
                        alt={`logo`} 
                        className={`w-8 h-8 object-contain`}
                    />                  <span className="text-sm text-gray-400 mt-2">Llama</span>
                </div>
                <div className="flex flex-col items-center">
                <img 
                        src='/svgs/mongodb-svgrepo-com.svg' 
                        alt={`logo`} 
                        className={`w-8 h-8 object-contain`}
                    />                  <span className="text-sm text-gray-400 mt-2">Excalidraw</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Arrow />

        {/* Performance Analysis */}
        <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl shadow-xl">
          <div className="flex items-start gap-6">
            <BarChart2 className="w-12 h-12 text-orange-400" />
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white mb-4">Performance Analysis</h2>
              <p className="text-gray-300 mb-6">
                Sophisticated algorithmic analysis tools for evaluating code efficiency and computational complexity.
              </p>
              <div className="flex gap-6 items-center">
                <div className="flex flex-col items-center">
                  <TechLogo name="Analytics" />
                  <span className="text-sm text-gray-400 mt-2">Analytics Engine</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Arrow />

        {/* Community Hub */}
        <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl shadow-xl">
          <div className="flex items-start gap-6">
            <Network className="w-12 h-12 text-purple-400" />
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white mb-4">Community Hub & Analytics</h2>
              <p className="text-gray-300 mb-6">
                Comprehensive user profiles integrated with community features, progress tracking, and personalized learning analytics.
              </p>
              <div className="flex gap-6 items-center">
                <div className="flex flex-col items-center">
                  <TechLogo name="Dashboard" />
                  <span className="text-sm text-gray-400 mt-2">Analytics Dashboard</span>
                </div>
                <div className="flex flex-col items-center">
                  <TechLogo name="Community" />
                  <span className="text-sm text-gray-400 mt-2">Community Platform</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-12 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 rounded-2xl">
          <h2 className="text-3xl font-bold text-white">Begin Your Learning Journey</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Experience a new paradigm in coding education with Socrates' integrated learning environment and AI-powered assistance.
          </p>
        </section>
      </div>
    </div>
  );
}