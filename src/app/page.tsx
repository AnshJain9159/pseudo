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
    <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
      <CardContent className="flex flex-col items-center p-4">
        {icon && React.createElement(icon)}
        <h3 className="text-lg font-semibold mt-3 mb-2 text-white">{title}</h3>
        <p className="text-gray-400 text-center text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  return (
    <div className="h-screen bg-black text-gray-300 overflow-hidden flex flex-col justify-center items-center p-8 font-sans">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <Image src="/logo.png" alt="Socrates Logo" width={80} height={80} className="rounded-full border border-gray-700 p-1" />
        </div>
        <h1 className="text-5xl font-bold mb-6 text-white">
          Socrates
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          Master Data Structures & Algorithms through AI-powered Socratic questioning.
        </p>
        <Button className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded transition duration-300 ease-in-out">
          Start Learning
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-6 mt-12">
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
