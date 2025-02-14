/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from 'components/ui/card';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Badge } from 'components/ui/badge';
import { Users, MessageSquare, Brain, Trash2 } from 'lucide-react';

interface Discussion {
  _id: string;
  topic: string;
  content: string;
  author: {
      _id: string;
      fullName: string;
  };
  responses?: any[];
}

const PeerLearningNetwork = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [newDiscussion, setNewDiscussion] = useState({ topic: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      setUserId(data?.user?._id.toString());
    };

    fetchUser();
  }, []);

  const createDiscussion = async (data: { topic: string; content: string }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const newDiscussion = await response.json();
      setDiscussions([newDiscussion, ...discussions]);
      setNewDiscussion({ topic: '', content: '' });
    } catch (error) {
      console.error('Failed to create discussion', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscussions = async (query = '', page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(query && { search: query }),
        page: page.toString(),
      });
      const response = await fetch(`/api/discussions?${params}`);
      const data = await response.json();
      setDiscussions(data.discussions);
    } catch (error) {
      console.error('Failed to fetch discussions', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDiscussions(searchTerm);
  };

  const addResponse = async (discussionId: string, content: string) => {
    try {
      const response = await fetch(`/api/discussions/${discussionId}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const newResponse = await response.json();
      setDiscussions(
        discussions.map((d) =>
          d._id === discussionId
            ? { ...d, responses: (d.responses || []).concat(newResponse) }
            : d
        )
      );

    } catch (error) {
      console.error('Failed to add response', error);
    }
  };

  const deleteDiscussion = async (discussionId: string) => {
    try {
      const response = await fetch(`/api/discussions/${discussionId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      
      if (response.ok) {
        setDiscussions(discussions.filter((d) => d._id !== discussionId));
      } else {
        console.error('Failed to delete discussion');
      }
    } catch (error) {
      console.error('Error deleting discussion:', error);
    }
  };

  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDiscussion.topic && newDiscussion.content) {
      createDiscussion(newDiscussion);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <Card className="border border-[#2e2f33] text-[#c7c7c7] shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#e2e8f0]">
            <Users className="h-6 w-6 text-[#6b7280]" />
            <span className="text-xl font-semibold tracking-wide">Peer Learning Network</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-[#c7c7c7]">Find Discussions</h3>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <Input
                placeholder="Search discussions..."
                value={searchTerm}
                onChange={handleSearch}
                className="flex-1 bg-[#1a1b1e] text-[#c7c7c7] border-[#4a5568]"
              />
              <Button type="submit" className="bg-[#2b6cb0] text-white hover:bg-[#1e4a73]">
                Search
              </Button>
            </form>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium mb-4 text-[#e2e8f0]">Discussions</h4>
              {discussions.map((discussion) => (
                <div
                  key={discussion._id} /* Unique key for each discussion */
                  className="mb-4 p-3 border border-[#3b3e46] bg-[#232529] rounded-xl shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <Brain className="h-5 w-5 mt-1 text-[#6b7280]" />
                      <div>
                        <h5 className="font-medium text-md text-[#c7c7c7]">{discussion.topic}</h5>
                        <p className="text-sm text-[#9ca3af]">{discussion.content}</p>
                        <p className="text-sm text-[#9ca3af]">By: {discussion.author?.fullName || 'Unknown Author'}</p>
                      </div>
                    </div>
                    {userId === discussion.author?._id.toString() && (
                      <Button
                        variant="default"
                        size="sm"
                        className="border-[#f87171] rounded-xl text-[#f87171] hover:bg-[#b91c1c]"
                        onClick={() => deleteDiscussion(discussion._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-[#e2e8f0]">Socratic Discussion Guide</h4>
              <div className="space-y-4">
                {["What's the main difference between this algorithm and the one we discussed earlier?", 'How would this approach perform with a very large dataset?', 'Can you identify any potential edge cases?', "What's the time complexity of this solution?"].map((prompt, index) => (
                  <div
                    key={index} /* Unique key for each prompt */
                    className="p-3 border border-[#3b3e46] bg-[#232529] rounded-xl shadow-md hover:shadow-lg"
                  >
                    <div className="flex items-start gap-3">
                      <Brain className="h-5 w-5 mt-1 text-[#6b7280]" />
                      <p className="text-[#c7c7c7]">{prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-medium mb-4 text-[#e2e8f0]">Start a Discussion</h4>
            <form onSubmit={handleCreateDiscussion} className="flex gap-2">
              <Input
                placeholder="Topic"
                value={newDiscussion.topic}
                onChange={(e) => setNewDiscussion({ ...newDiscussion, topic: e.target.value })}
                className="flex-1 bg-[#1a1b1e] text-[#c7c7c7] border-[#4a5568]"
              />
              <Input
                placeholder="Content"
                value={newDiscussion.content}
                onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                className="flex-1 bg-[#1a1b1e] text-[#c7c7c7] border-[#4a5568]"
              />
              <Button type="submit" className="bg-[#2b6cb0] text-white hover:bg-[#1e4a73]" disabled={loading}>
                <MessageSquare className="h-4 w-4 mr-2" />
                {loading ? 'Posting...' : 'Start Discussion'}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PeerLearningNetwork;
