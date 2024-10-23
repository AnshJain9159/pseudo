
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Brain, TrendingUp, MessageSquare, Network, AlertCircle, 
  Check, X 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProgressDashboard = () => {
  const [selectedTopic, setSelectedTopic] = useState('all');

  const topicProgress = [
    {
      topic: 'Sorting Algorithms',
      progress: 75,
      strengths: ['Time complexity analysis', 'Implementation'],
      weaknesses: ['Space complexity optimization'],
      questioningSkill: 85,
      completedProblems: 25
    },
    {
      topic: 'Binary Trees',
      progress: 60,
      strengths: ['Tree traversal', 'Basic operations'],
      weaknesses: ['Balancing algorithms'],
      questioningSkill: 70,
      completedProblems: 18
    }
  ];

  const learningPatterns = [
    { date: '2024-01', problemsSolved: 15, questionsAsked: 45, conceptsMastered: 3 },
    { date: '2024-02', problemsSolved: 22, questionsAsked: 58, conceptsMastered: 5 },
    { date: '2024-03', problemsSolved: 28, questionsAsked: 72, conceptsMastered: 7 },
    { date: '2024-04', problemsSolved: 35, questionsAsked: 89, conceptsMastered: 9 }
  ];

  const renderSocraticProgress = (topic) => (
    <Card className="bg-[#222] shadow-lg border border-gray-700 rounded-lg mb-4">
      <CardContent className="pt-6 text-[#fff]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-purple-400">{topic.topic}</h3>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-green-400 animate-pulse" />
            <span className="font-mono">Questioning Skill: {topic.questioningSkill}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-semibold text-pink-400 mb-2">Strengths</h4>
            <div className="space-y-1">
              {topic.strengths.map((strength, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500 animate-bounce" />
                  <span>{strength}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-yellow-400 mb-2">Areas for Improvement</h4>
            <div className="space-y-1">
              {topic.weaknesses.map((weakness, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500 animate-spin" />
                  <span>{weakness}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Progress value={topic.progress} className="h-2 rounded bg-gray-800" />
        <div className="flex justify-between text-xs mt-2 text-gray-400">
          <span>{topic.completedProblems} problems completed</span>
          <span>{topic.progress}% mastery</span>
        </div>
      </CardContent>
    </Card>
  );

  const renderLearningPatternChart = () => (
    <Card className="bg-[#1b1b1b] shadow-md border border-gray-600 rounded-lg">
      <CardContent className="pt-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={learningPatterns}>
              <CartesianGrid strokeDasharray="3 3" stroke="#888" />
              <XAxis dataKey="date" tick={{ fill: "#ccc" }} />
              <YAxis tick={{ fill: "#ccc" }} />
              <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#666' }} />
              <Line type="monotone" dataKey="problemsSolved" stroke="#8884d8" />
              <Line type="monotone" dataKey="questionsAsked" stroke="#82ca9d" />
              <Line type="monotone" dataKey="conceptsMastered" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const renderRecommendations = () => (
    <Card className="bg-[#1f1f1f] shadow-lg border border-gray-700 rounded-lg">
      <CardHeader className="text-purple-400">
        <CardTitle className="text-lg font-bold">Learning Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="bg-[#2b2b2b] text-gray-300 mb-4 border-l-4 border-purple-500">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <AlertTitle className="font-bold">Next Best Step</AlertTitle>
          <AlertDescription>
            Based on your questioning patterns, try exploring more edge cases in sorting algorithms. 
            Consider asking: <span className="italic text-purple-300">What happens when the input array is already sorted?</span>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Example Stat Cards */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-bold text-white">Socratic Score</CardTitle>
            <Brain className="h-5 w-5 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-white">85/100</div>
            <p className="text-xs text-gray-300">Based on question quality</p>
          </CardContent>
        </Card>

        {/* More Stat Cards ... */}
      </div>

      {/* Tabbed content */}
      <Tabs defaultValue="progress">
        <TabsList className="bg-[#333] text-gray-200">
          <TabsTrigger value="progress" className="hover:bg-purple-500 active:bg-purple-700">Topic Progress</TabsTrigger>
          <TabsTrigger value="patterns" className="hover:bg-purple-500 active:bg-purple-700">Learning Patterns</TabsTrigger>
          <TabsTrigger value="recommendations" className="hover:bg-purple-500 active:bg-purple-700">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="progress">
          {topicProgress.map(renderSocraticProgress)}
        </TabsContent>

        <TabsContent value="patterns">
          {renderLearningPatternChart()}
        </TabsContent>

        <TabsContent value="recommendations">
          {renderRecommendations()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressDashboard;
