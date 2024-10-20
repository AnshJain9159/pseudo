"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, ChevronRight, Code, Search, Brain, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const features = [
  {
    icon: <Code className="text-blue-400 w-10 h-10" />,
    title: "Algorithm Learning",
    description: "Master algorithms through Socratic questioning and step-by-step guidance.",
  },
  {
    icon: <Search className="text-green-400 w-10 h-10" />,
    title: "Interactive Visualizations",
    description: "Real-time visualizations tailored to your learning path.",
  },
  {
    icon: <BadgeCheck className="text-yellow-500 w-10 h-10" />,
    title: "Performance Tracking",
    description: "Monitor your progress with detailed insights into algorithm mastery.",
  },
  {
    icon: <ChevronRight className="text-purple-400 w-10 h-10" />,
    title: "AI-Powered Assistance",
    description: "Get personalized guidance through AI-driven analysis.",
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-800 text-gray-300 font-mono">
      <div className="container mx-auto px-6 py-20">
        {/* Main Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-white tracking-wider">About Socrates</h1>
          <p className="mt-4 text-lg text-gray-400">
            Your AI-powered companion to mastering algorithms and data structures through inquiry.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-900 hover:bg-gray-700 transition duration-300 border border-gray-700 p-4">
              <CardContent className="text-center">
                <div className="mb-4">{feature.icon}</div>
                <h6 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h6>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission and Approach Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-gray-900 border border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Brain className="w-6 h-6 mr-2 text-blue-400" />
              Our Mission
            </h2>
            <CardContent>
              <p className="text-gray-400">
                At Socrates, we’re changing how students learn algorithms through AI-driven Socratic teaching, ensuring deeper comprehension.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Code className="w-6 h-6 mr-2 text-green-400" />
              Our Approach
            </h2>
            <CardContent>
              <p className="text-gray-400">
                Socrates uses AI to guide students with questions, encouraging them to discover solutions and develop critical thinking.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose Us Section */}
        <h2 className="text-4xl font-extrabold text-center text-white mb-8">Why Choose Socrates?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gray-900 border border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2 text-blue-400" />
              Personalized Learning
            </h2>
            <CardContent>
              <p className="text-gray-400">
                Tailored lessons based on your learning pace, ensuring you stay on track.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Zap className="w-6 h-6 mr-2 text-yellow-500" />
              Scalable Excellence
            </h2>
            <CardContent>
              <p className="text-gray-400">
                Socrates makes high-quality, AI-driven learning available to everyone, anytime, anywhere.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Brain className="w-6 h-6 mr-2 text-purple-400" />
              Deep Understanding
            </h2>
            <CardContent>
              <p className="text-gray-400">
                We focus on building lasting comprehension through inquiry, guiding students to solutions on their own.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Tooltip delayDuration={200}>
            <TooltipTrigger>
              <a href="/socratesbot">
                <Button
                  variant={"default"}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-xl transition-all"
                >
                  Start Learning Now
                </Button>
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>Join Socrates and master algorithms today!</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
