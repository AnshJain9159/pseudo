"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Code, Users, Zap } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-8">About Pseudo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-6 h-6 mr-2 text-indigo-600" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                At Pseudo, we&apos;re revolutionizing the way students learn Data Structures and Algorithms. 
                Our AI-powered teaching assistant employs the Socratic method to guide learners through 
                complex concepts, fostering deep understanding and critical thinking skills.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="w-6 h-6 mr-2 text-indigo-600" />
                Our Approach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We leverage cutting-edge AI technology to create a personalized learning experience. 
                Our assistant asks probing questions, leading students to discover solutions on their own, 
                rather than simply providing answers.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-3xl font-semibold text-center text-indigo-800 mb-8">Why Choose Pseudo?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-6 h-6 mr-2 text-indigo-600" />
                Personalized Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Our AI adapts to each student&apos;s pace and learning style, providing a truly individualized 
                educational experience.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-6 h-6 mr-2 text-indigo-600" />
                Scalable Excellence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We overcome the limitations of traditional 1-on-1 tutoring by making high-quality, 
                Socratic-method teaching available to all students, anytime, anywhere.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-6 h-6 mr-2 text-indigo-600" />
                Deep Understanding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                By guiding students to discover solutions themselves, we foster a deeper understanding of 
                Data Structures and Algorithms, preparing them for real-world challenges.
              </p>
            </CardContent>
          </Card>
        </div>
        
        
      </div>
    </div>
  );
};

export default AboutUs;