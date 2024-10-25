"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, BookOpen } from "lucide-react";

interface Topic {
  name: string;
  category: 'DSA' | 'CS';
  completed: boolean;
}

interface User {
  fullName: string;
  email: string;
  role: "teacher" | "student";
  ethereumAddress: string;
  topics: Topic[];
}

const ProfilePage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEthAddress, setShowEthAddress] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(
            `/api/users/profile?email=${session.user.email}`
          );
          if (response.ok) {
            const userData = await response.json();
            // console.log("Fetched User Data:", userData); // Log fetched user data for debugging
            setUser(userData);
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (status === "authenticated") {
      fetchUserData();
    } else if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [session, status, router]);

  if (status === "loading" || loading) {
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl bg-gray-800 border border-gray-700">
          <CardContent>
            <p className="text-center text-xl text-gray-200">User not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4 font-sans text-gray-200">
      <Card
        className="w-full max-w-4xl bg-gray-800 border border-gray-700 shadow-lg"
        style={{ backdropFilter: "blur(10px)", background: "rgba(255, 255, 255, 0.1)" }}
      >
        <CardHeader className="text-center">
          <Avatar className="h-24 w-24 mx-auto mb-4">
            <AvatarImage src={session?.user?.image || ""} alt={user.fullName} />
            <AvatarFallback className="bg-purple-500 text-white">
              {user.fullName[0]}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            {user.fullName}
          </h1>
          <p className="text-xl text-gray-400 capitalize">{user.role}</p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-2 text-purple-400">
                Personal Information
              </h2>
              <p>
                <strong className="text-gray-400">Full Name:</strong> {user.fullName}
              </p>
              <p>
                <strong className="text-gray-400">Email:</strong> {user.email}
              </p>
              <p>
                <strong className="text-gray-400">Role:</strong> {user.role}
              </p>
              <p>
                <strong className="text-gray-400">Eth Address:</strong>{" "}
                {showEthAddress ? user.ethereumAddress : "••••••••••••"}
              </p>
              <Button
                onClick={() => setShowEthAddress(!showEthAddress)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg mt-2"
              >
                {showEthAddress ? "Hide" : "Show"} Ethereum Address
              </Button>
            </div>
          </div>

          {/* Completed Topics */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-purple-400 flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Completed Topics
            </h2>

            {/* DSA Topics */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-purple-400">
                Data Structures & Algorithms
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {user.topics
                  ?.filter((topic) => topic.category === "DSA" && topic.completed)
                  .map((topic, index) => {
                    console.log("Rendering Completed DSA Topic:", topic); // Log topic details for debugging
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-2 bg-purple-900/20 p-2 rounded-lg"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-green-400">{topic.name}</span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* CS Topics */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-400">
                Computer Science Fundamentals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {user.topics
                  ?.filter((topic) => topic.category === "CS" && topic.completed)
                  .map((topic, index) => {
                    console.log("Rendering Completed CS Topic:", topic); // Log topic details for debugging
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-2 bg-blue-900/20 p-2 rounded-lg"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-green-400">{topic.name}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-around space-x-4">
          <Button
            onClick={() => router.push("/")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-purple-500/50"
          >
            Back to Home
          </Button>
          <Button
            onClick={() => router.push("/u/edit-profile")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-purple-500/50"
          >
            Edit Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfilePage;
