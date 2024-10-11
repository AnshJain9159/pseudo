"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Zap, Code, BarChart } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto text-center px-4">
          <div className="flex justify-center mb-8">
            <Image src="/logo.png" alt="PSEUDO Logo" width={100} height={100} />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Welcome to PSEUDO: The Future of Interactive Learning
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            PSEUDO is an AI-powered teaching assistant designed to help you master Data Structures & Algorithms through Socratic questioning. Learn at your pace with personalized guidance to deepen your understanding.
          </p>
          <div className="mt-8">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
              Explore Features
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-12">
            Why PSEUDO?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-6 h-6 mr-2 text-indigo-600" />
                  Socratic Method Teaching
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our AI tutor asks the right questions to guide you through your problem-solving process, helping you develop a deep understanding of algorithms without giving you the answers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-indigo-600" />
                  Personalized Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receive tailored feedback based on your responses and progress. The AI adapts to your learning speed and areas of difficulty, ensuring an optimized learning experience.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="w-6 h-6 mr-2 text-indigo-600" />
                  Interactive Coding Environment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Implement, run, and test your code directly within PSEUDO. Our environment allows you to interactively learn, troubleshoot, and improve your understanding of algorithms.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-12">
            How Does PSEUDO Work?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-6 h-6 mr-2 text-indigo-600" />
                  1. Start a Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Begin by selecting an algorithmic topic or challenge. Whether it&apos;s sorting algorithms or data structures, the AI is ready to guide you through it.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-indigo-600" />
                  2. Answer AI-Prompted Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  The AI will ask probing questions to help you think critically about your solution. Instead of revealing the answer, it helps you discover it yourself.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="w-6 h-6 mr-2 text-indigo-600" />
                  3. Improve Your Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  The AI provides hints and feedback based on your code. Analyze the performance, optimize the algorithm, and learn how to refactor your solution for better efficiency.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="w-6 h-6 mr-2 text-indigo-600" />
                  4. Track Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Monitor your learning journey through detailed insights. Track completed challenges, review past sessions, and see how much you&apos;ve improved over time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="cta" className="py-16 bg-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-black mb-4">
            Ready to Master Data Structures and Algorithms?
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Join PSEUDO today and experience AI-powered learning like never before. Let the Socratic method guide you to success.
          </p>
          <div className="mt-8">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
              Start Learning Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}