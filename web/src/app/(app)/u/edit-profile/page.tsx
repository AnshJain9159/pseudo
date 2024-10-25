"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitialTopics } from '@/utils/initializeTopics';
import { CheckCircle2 } from 'lucide-react';

interface Topic {
  name: string;
  category: 'DSA' | 'CS';
  completed: boolean;
  progress: number;
}

interface User {
  fullName: string;
  email: string;
  role: 'teacher' | 'student';
  ethereumAddress: string;
  topics: Topic[];
}

const EditProfilePage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState({
    fullName: '',
    topics: getInitialTopics(), // Initialize with default topics
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(
            `/api/users/profile?email=${session.user.email}`
          );
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            // Merge existing user topics with initial topics
            const mergedTopics = getInitialTopics().map(initialTopic => {
              const existingTopic = userData.topics?.find(
                (t: Topic) => t.name === initialTopic.name
              );
              return existingTopic || initialTopic;
            });
            setFormValues({
              fullName: userData.fullName,
              topics: mergedTopics,
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (status === 'authenticated') {
      fetchUserData();
    } else if (status === 'unauthenticated') {
      router.push('/sign-in');
    }
  }, [session, status, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleTopicChange = (index: number, completed: boolean) => {
    const updatedTopics = [...formValues.topics];
    updatedTopics[index].completed = completed;
    setFormValues({ ...formValues, topics: updatedTopics });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/users/edit-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session?.user?.email,
          fullName: formValues.fullName,
          topics: formValues.topics,
        }),
      });

      if (response.ok) {
        router.push('/u/profile');
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render loading state
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl bg-gray-800 border border-gray-700">
          <CardHeader>
            <Skeleton className="h-12 w-3/4 mx-auto bg-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full bg-gray-600" />
              <Skeleton className="h-4 w-full bg-gray-600" />
              <Skeleton className="h-4 w-2/3 bg-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group topics by category
  const dsaTopics = formValues.topics.filter(topic => topic.category === 'DSA');
  const csTopics = formValues.topics.filter(topic => topic.category === 'CS');

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4 font-sans text-gray-200">
      <Card className="w-full max-w-4xl bg-gray-800 border border-gray-700 shadow-lg">
        <CardHeader className="text-center">
          <Avatar className="h-24 w-24 mx-auto mb-4">
            <AvatarImage src={session?.user?.image || ''} alt={user?.fullName} />
            <AvatarFallback className="bg-purple-500 text-white">
              {user?.fullName?.[0]}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            Edit Profile
          </h1>
          <p className="text-xl text-gray-400 capitalize">{user?.role}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName" className="text-gray-400">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formValues.fullName}
                  onChange={handleInputChange}
                  className="mt-1 bg-gray-700 border border-gray-600 text-gray-200"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-400">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="mt-1 bg-gray-700 border border-gray-600 text-gray-200"
                />
              </div>
            </div>

            {/* Topics Section */}
            <div className="space-y-6">
              {/* DSA Topics */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-purple-400">
                  Data Structures & Algorithms
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dsaTopics.map((topic, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 p-2 rounded-lg transition-all ${
                        topic.completed ? 'bg-green-900/20' : 'hover:bg-gray-700/30'
                      }`}
                    >
                      <Checkbox
                        checked={topic.completed}
                        onCheckedChange={(checked) =>
                          handleTopicChange(
                            formValues.topics.findIndex((t) => t.name === topic.name),
                            checked as boolean
                          )
                        }
                        className={`${
                          topic.completed ? 'bg-green-500 border-green-500' : ''
                        }`}
                      />
                      <Label
                        className={`flex items-center space-x-2 text-gray-300 ${
                          topic.completed ? 'line-through text-green-500' : ''
                        }`}
                      >
                        {topic.name}
                        {topic.completed && (
                          <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* CS Topics */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-blue-400">
                  Computer Science Fundamentals
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {csTopics.map((topic, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 p-2 rounded-lg transition-all ${
                        topic.completed ? 'bg-green-900/20' : 'hover:bg-gray-700/30'
                      }`}
                    >
                      <Checkbox
                        checked={topic.completed}
                        onCheckedChange={(checked) =>
                          handleTopicChange(
                            formValues.topics.findIndex((t) => t.name === topic.name),
                            checked as boolean
                          )
                        }
                        className={`${
                          topic.completed ? 'bg-green-500 border-green-500' : ''
                        }`}
                      />
                      <Label
                        className={`flex items-center space-x-2 text-gray-300 ${
                          topic.completed ? 'line-through text-green-500' : ''
                        }`}
                      >
                        {topic.name}
                        {topic.completed && (
                          <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-center space-x-4 mt-6">
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-purple-500/50"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                onClick={() => router.push('/u/profile')}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg"
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfilePage;