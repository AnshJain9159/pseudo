/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, Brain, ArrowRight } from 'lucide-react';

const PeerLearningNetwork = () => {
  const [currentTopic, setCurrentTopic] = useState('Sorting Algorithms');
  
  // Sample peer data - in real app, this would come from your backend
  const peers = [
    {
      id: 1,
      name: 'Alex Chen',
      topic: 'Sorting Algorithms',
      progress: 75,
      status: 'online',
      strengths: ['Quick Sort', 'Merge Sort']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      topic: 'Sorting Algorithms',
      progress: 85,
      status: 'online',
      strengths: ['Heap Sort', 'Bubble Sort']
    }
  ];

  // Sample discussion prompts
  const socraticPrompts = [
    "What's the main difference between this algorithm and the one we discussed earlier?",
    "How would this approach perform with a very large dataset?",
    "Can you identify any potential edge cases?",
    "What's the time complexity of this solution?"
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Peer Learning Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Current Topic: {currentTopic}</h3>
            <div className="flex gap-2 flex-wrap">
              {['Quick Sort', 'Merge Sort', 'Heap Sort'].map(topic => (
                <Badge key={topic} variant="secondary" className="cursor-pointer">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium mb-4">Available Peers</h4>
              {peers.map(peer => (
                <div key={peer.id} className="mb-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">{peer.name}</h5>
                      <p className="text-sm text-muted-foreground">
                        Progress: {peer.progress}%
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm">Strengths:</p>
                    <div className="flex gap-2 mt-1">
                      {peer.strengths.map(strength => (
                        <Badge key={strength} variant="outline">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Socratic Discussion Guide</h4>
              <div className="space-y-4">
                {socraticPrompts.map((prompt, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <Brain className="h-5 w-5 mt-1 text-muted-foreground" />
                      <p>{prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-medium mb-4">Start a Discussion</h4>
            <div className="flex gap-2">
              <Input placeholder="Type your question or discussion topic..." className="flex-1" />
              <Button>
                <MessageSquare className="h-4 w-4 mr-2" />
                Start Discussion
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PeerLearningNetwork;