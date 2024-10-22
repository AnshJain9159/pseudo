/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Brain, Book, GitBranch, Network, AlertCircle, 
  TrendingUp, MessageSquare, Check, X 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Types for our data structures
interface TopicProgress {
  topic: string;
  progress: number;
  strengths: string[];
  weaknesses: string[];
  questioningSkill: number;
  completedProblems: number;
}

interface LearningActivity {
  id: string;
  type: 'problem' | 'discussion' | 'review';
  topic: string;
  title: string;
  status: 'completed' | 'in_progress' | 'need_review';
  score?: number;
  questionQuality?: number;
  timestamp: string;
}

const ProgressDashboard = () => {
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [learningPath, setLearningPath] = useState<string[]>([]);
  const [activities, setActivities] = useState<LearningActivity[]>([]);

  // Simulated API calls - in real app, these would be actual API endpoints
  useEffect(() => {
    const fetchData = async () => {
      // Fetch learning activities
      const response = await fetch('/api/learning-activities');
      const data = await response.json();
      setActivities(data);
    };

    fetchData();
  }, []);

  const topicProgress: TopicProgress[] = [
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
    },
    // Add more topics...
  ];

  const learningPatterns = [
    { date: '2024-01', problemsSolved: 15, questionsAsked: 45, conceptsMastered: 3 },
    { date: '2024-02', problemsSolved: 22, questionsAsked: 58, conceptsMastered: 5 },
    { date: '2024-03', problemsSolved: 28, questionsAsked: 72, conceptsMastered: 7 },
    { date: '2024-04', problemsSolved: 35, questionsAsked: 89, conceptsMastered: 9 }
  ];

  const renderSocraticProgress = (topic: TopicProgress) => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{topic.topic}</h3>
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span>Questioning Skill: {topic.questioningSkill}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Strengths</h4>
            <div className="space-y-1">
              {topic.strengths.map((strength, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{strength}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Areas for Improvement</h4>
            <div className="space-y-1">
              {topic.weaknesses.map((weakness, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span>{weakness}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Progress value={topic.progress} className="h-2 mb-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{topic.completedProblems} problems completed</span>
          <span>{topic.progress}% mastery</span>
        </div>
      </CardContent>
    </Card>
  );

  const renderLearningPatternChart = () => (
    <Card>
      <CardContent className="pt-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={learningPatterns}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="problemsSolved" name="Problems Solved" stroke="#8884d8" />
              <Line type="monotone" dataKey="questionsAsked" name="Questions Asked" stroke="#82ca9d" />
              <Line type="monotone" dataKey="conceptsMastered" name="Concepts Mastered" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const renderRecommendations = () => (
    <Card>
      <CardHeader>
        <CardTitle>Learning Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Next Best Step</AlertTitle>
          <AlertDescription>
            Based on your questioning patterns, try exploring more edge cases in sorting algorithms.
            Consider asking: &quot;What happens when the input array is already sorted?&quot;
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <h4 className="font-medium">Suggested Questions to Ask:</h4>
          <div className="space-y-2">
            {[
              "How would this algorithm perform with duplicate elements?",
              "Can we optimize the space complexity further?",
              "What's the trade-off between time and space here?"
            ].map((question, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 border rounded-lg">
                <MessageSquare className="h-4 w-4" />
                <span>{question}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Socratic Score</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85/100</div>
            <p className="text-xs text-muted-foreground">Based on question quality</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground">Daily learning maintained</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Questions Asked</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">264</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Peer Interactions</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Active discussions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="progress" className="w-full">
        <TabsList>
          <TabsTrigger value="progress">Topic Progress</TabsTrigger>
          <TabsTrigger value="patterns">Learning Patterns</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="progress">
          <div className="space-y-6">
            {topicProgress.map((topic, idx) => (
              <div key={idx}>{renderSocraticProgress(topic)}</div>
            ))}
          </div>
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