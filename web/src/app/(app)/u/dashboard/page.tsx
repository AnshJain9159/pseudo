"use client"
import ProgressDashboard from 'components/ProgressDashboard';
// import PeerLearningNetwork from 'components/PeerLearningNetwork';
import { Bot, Code2, PenTool, Activity, Clock, ArrowUpRight, Brain } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black">

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="text-zinc-400 mt-1">Track your progress and recent activities</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Problems Solved</p>
                <p className="text-2xl font-semibold text-white mt-1">24</p>
              </div>
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <Code2 className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-blue-500">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              <span>12% more than last week</span>
            </div>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">AI Interactions</p>
                <p className="text-2xl font-semibold text-white mt-1">156</p>
              </div>
              <div className="bg-green-500/10 p-2 rounded-lg">
                <Bot className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-green-500">
              <Activity className="w-3 h-3 mr-1" />
              <span>Active today</span>
            </div>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Visualizations</p>
                <p className="text-2xl font-semibold text-white mt-1">12</p>
              </div>
              <div className="bg-purple-500/10 p-2 rounded-lg">
                <PenTool className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-purple-500">
              <Clock className="w-3 h-3 mr-1" />
              <span>Last activity 2h ago</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Section - Takes up 2 columns */}
          <div className="lg:col-span-2 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-white">Learning Progress</h2>
              <select className="bg-black border border-zinc-800 rounded-md px-3 py-1 text-sm text-zinc-400">
                <option>This Week</option>
                <option>This Month</option>
                <option>All Time</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Socratic Score Card */}
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-4 text-white">
                <div className="flex flex-col items-center">
                  <span className="text-sm mb-2">Socratic Score</span>
                  <Brain className="w-6 h-6 mb-2" />
                  <span className="text-3xl font-bold">85/100</span>
                  <span className="text-xs mt-1 text-white/80">Based on question quality</span>
                </div>
              </div>
            </div>

            {/* Topic Progress Tabs */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-zinc-800/50 rounded-lg p-1 mb-6">
                <button className="flex-1 px-4 py-2 text-sm font-medium rounded-md bg-black text-white">
                  Topic Progress
                </button>
                <button className="flex-1 px-4 py-2 text-sm font-medium rounded-md text-zinc-400 hover:text-white">
                  Learning Patterns
                </button>
                <button className="flex-1 px-4 py-2 text-sm font-medium rounded-md text-zinc-400 hover:text-white">
                  Recommendations
                </button>
              </div>

              {/* Topic Cards */}
              <div className="space-y-4">
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-purple-400">Sorting Algorithms</h3>
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-zinc-400">Questioning Skill: 85%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-green-400 mb-2">Strengths</h4>
                      <ul className="space-y-1">
                        <li className="flex items-center text-sm text-zinc-300">
                          <span className="text-green-400 mr-2">✓</span>
                          Time complexity analysis
                        </li>
                        <li className="flex items-center text-sm text-zinc-300">
                          <span className="text-green-400 mr-2">✓</span>
                          Implementation
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-yellow-400 mb-2">Areas for Improvement</h4>
                      <ul className="space-y-1">
                        <li className="flex items-center text-sm text-zinc-300">
                          <span className="text-red-400 mr-2">○</span>
                          Space complexity optimization
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-zinc-500 border-t border-zinc-700 pt-4">
                    <span>25 problems completed</span>
                    <span>75% mastery</span>
                  </div>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-purple-400">Binary Trees</h3>
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-zinc-400">Questioning Skill: 75%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-green-400 mb-2">Strengths</h4>
                      <ul className="space-y-1">
                        <li className="flex items-center text-sm text-zinc-300">
                          <span className="text-green-400 mr-2">✓</span>
                          Basic operations
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-yellow-400 mb-2">Areas for Improvement</h4>
                      <ul className="space-y-1">
                        <li className="flex items-center text-sm text-zinc-300">
                          <span className="text-red-400 mr-2">○</span>
                          Advanced traversals
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-zinc-500 border-t border-zinc-700 pt-4">
                    <span>18 problems completed</span>
                    <span>60% mastery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity - Takes up 1 column */}
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500/10 p-2 rounded-lg mt-1">
                  <Code2 className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Binary Search</p>
                  <p className="text-xs text-zinc-400 mt-1">Completed problem</p>
                  <p className="text-xs text-zinc-500 mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-green-500/10 p-2 rounded-lg mt-1">
                  <Bot className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">AI Session</p>
                  <p className="text-xs text-zinc-400 mt-1">Learning assistance</p>
                  <p className="text-xs text-zinc-500 mt-1">5 hours ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-purple-500/10 p-2 rounded-lg mt-1">
                  <PenTool className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Quick Sort</p>
                  <p className="text-xs text-zinc-400 mt-1">Algorithm visualization</p>
                  <p className="text-xs text-zinc-500 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
