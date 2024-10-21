import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Zap, Code } from 'lucide-react';
import Image from 'next/image';

interface Feature {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: Feature) {
  return (
    <Card className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-purple-500/50">
      <CardContent className="flex flex-col items-center p-6">
        {icon && React.createElement(icon, { className: "w-10 h-10 text-purple-400" })}
        <h3 className="text-xl font-semibold mt-4 mb-2 text-white">{title}</h3>
        <p className="text-gray-400 text-center text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  return (
    <div className="h-screen bg-gradient-to-b from-black to-gray-900 text-gray-300 overflow-hidden flex flex-col justify-center items-center p-8 font-sans">
      {/* Logo Section */}
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <Image 
            src="/logo.png" 
            alt="Socrates Logo" 
            width={80} 
            height={80} 
            className="rounded-full border-4 border-purple-500 p-2 animate-pulse" 
          />
        </div>
        
        {/* Title and Description */}
        <h1 className="text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 tracking-wide">
          Socrates
        </h1>
        <p className="text-lg text-gray-400 mb-10">
          Master Data Structures & Algorithms through AI-powered Socratic questioning.
        </p>
        
        {/* Start Learning Button */}
        <div className="flex justify-center">  {/* Ensure centering */}
          
          <a href="/main"><Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out shadow-lg hover:shadow-purple-500/50 flex items-center">
            Start Learning
            <ArrowRight className="w-5 h-5 ml-3 text-white" />
          </Button>
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
        <FeatureCard
          icon={Brain}
          title="Socratic Method"
          description="Guided learning through intelligent questioning"
        />
        <FeatureCard
          icon={Zap}
          title="Personalized"
          description="Adaptive feedback tailored to your progress"
        />
        <FeatureCard
          icon={Code}
          title="Interactive Coding"
          description="Practice and test your code in real-time"
        />
      </div>
    </div>
  );
}
