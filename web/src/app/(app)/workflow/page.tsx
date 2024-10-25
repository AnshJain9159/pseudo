import React from 'react';
import { Code, UserCircle, Network, BarChart2 } from "lucide-react";



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
        <section className="bg-gradient-to-b from-slate-800 to-slate-700 p-8 rounded-2xl shadow-xl">
          <div className="flex items-start gap-6">
            <UserCircle className="w-12 h-12 text-blue-400" />
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white mb-4">Authentication & Authorization</h2>
              <p className="text-gray-200 mb-6">
                Enterprise-grade security implementation utilizing blockchain technology and distributed database architecture.
              </p>
              <div className="flex gap-6 items-center">
                <div className="flex flex-col items-center">
                  <img 
                    src='https://www.svglogos.net/wp-content/uploads/mongodb.svg' 
                    alt={`logo`} 
                    className={`w-8 h-8 object-contain`}
                  />
                  <span className="text-sm text-gray-300 mt-2">MongoDB</span>
                </div>
                <div className="flex flex-col items-center">
                  <img 
                    src='https://www.svglogos.net/wp-content/uploads/solidity.svg' 
                    alt={`logo`} 
                    className={`w-8 h-8 object-contain`}
                  />
                  <span className="text-sm text-gray-300 mt-2">Solidity</span>
                </div>
                <div className="flex flex-col items-center">
                  <img 
                    src='https://www.svglogos.net/wp-content/uploads/truffle.svg' 
                    alt={`logo`} 
                    className={`w-8 h-8 object-contain`}
                  />
                  <span className="text-sm text-gray-300 mt-2">Truffle</span>
                </div>
                <div className="flex flex-col items-center">
                  <img 
                    src='https://www.svglogos.net/wp-content/uploads/ganache.svg' 
                    alt={`logo`} 
                    className={`w-8 h-8 object-contain`}
                  />
                  <span className="text-sm text-gray-300 mt-2">Ganache</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Arrow />

        {/* Integrated Development Environment */}
        <section className="bg-gradient-to-b from-slate-800 to-slate-700 p-8 rounded-2xl shadow-xl">
          <div className="flex items-start gap-6">
            <Code className="w-12 h-12 text-green-400" />
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white mb-4">Intelligent Development Environment</h2>
              <p className="text-gray-200 mb-6">
                Advanced learning environment featuring real-time AI assistance, integrated drawing tools, and code tools.
              </p>
              <div className="flex gap-6 items-center">
                <div className="flex flex-col items-center">
                  <img 
                    src='https://www.svglogos.net/wp-content/uploads/nextjs.svg' 
                    alt={`logo`} 
                    className={`w-8 h-8 object-contain`}
                  />
                  <span className="text-sm text-gray-300 mt-2">Next.js</span>
                </div>
                <div className="flex flex-col items-center">
                  <img 
                    src='https://www.svglogos.net/wp-content/uploads/meta-1.svg' 
                    alt={`logo`} 
                    className={`w-8 h-8 object-contain`}
                  />
                  <span className="text-sm text-gray-300 mt-2">Llama</span>
                </div>
                <div className="flex flex-col items-center">
                  <img 
                    src='/Excalidraw.svg' 
                    alt={`logo`} 
                    className={`w-8 h-8 object-contain`}
                  />
                  <span className="text-sm text-gray-300 mt-2">Excalidraw</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Arrow />

        {/* Performance Analysis */}
        <section className="bg-gradient-to-b from-slate-800 to-slate-700 p-8 rounded-2xl shadow-xl">
          <div className="flex items-start gap-6">
            <BarChart2 className="w-12 h-12 text-orange-400" />
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white mb-4">Performance Analysis</h2>
              <p className="text-gray-200 mb-6">
                Sophisticated algorithmic analysis tools for evaluating code efficiency and computational complexity.
              </p>
              <div className="flex gap-6 items-center">
                <div className="flex flex-col items-center">
                  <img 
                    src='/analytics-chart-earning-svgrepo-com.svg' 
                    alt={`logo`} 
                    className={`w-8 h-8 object-contain`}
                  />
                  <span className="text-sm text-gray-300 mt-2">Analytics Engine</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Arrow />

        {/* Community Hub */}
        <section className="bg-gradient-to-b from-slate-800 to-slate-700 p-8 rounded-2xl shadow-xl">
          <div className="flex items-start gap-6">
            <Network className="w-12 h-12 text-purple-400" />
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white mb-4">Community Hub & Analytics</h2>
              <p className="text-gray-200 mb-6">
                Comprehensive user profiles integrated with community features, progress tracking, and personalized learning analytics.
              </p>
              <div className="flex gap-6 items-center">
                <div className="flex flex-col items-center">
                <img 
                    src='/Dashboard.svg' 
                    alt={`logo`} 
                    className={`w-8 h-8 object-contain`}
                  />
                  <span className="text-sm text-gray-300 mt-2">Analytics Dashboard</span>
                </div>
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M3 3a2 2 0 1 1 4 0a2 2 0 0 1-4 0m6.779 1.584l.042.032a2 2 0 1 0-.042-.032M6.268 6A2 2 0 1 1 9.73 7.998A2 2 0 0 1 6.268 6M2.5 6h2.67a3.01 3.01 0 0 0 .594 3H5.5a2.5 2.5 0 0 0-2.355 1.658a3.7 3.7 0 0 1-.933-.543C1.46 9.51 1 8.616 1 7.5A1.5 1.5 0 0 1 2.5 6m8 3c1.085 0 2.009.691 2.355 1.658c.331-.102.641-.246.933-.543c.752-.605 1.212-1.5 1.212-2.615A1.5 1.5 0 0 0 12.5 6h-2.67a3.01 3.01 0 0 1-.594 3h1.264a2.5 2.5 0 0 1 2.355 1.658a3.7 3.7 0 0 0 .933-.543C14.54 9.51 15 8.616 15 7.5A1.5 1.5 0 0 0 13.5 6h-2.67a3.01 3.01 0 0 1-.594 3h1.264Z"/></svg>
                  <span className="text-sm text-gray-300 mt-2">User Profiles</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
