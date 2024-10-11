"use client"
// pages/index.js (or any other name)
// pages/index.js

import { Card, CardContent, Typography } from '@mui/material';
import "wired-elements";
import {Button} from "@/components/ui/button"
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800">
            Welcome to PSEUDO: The Future of Interactive Learning
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            PSEUDO is an AI-powered teaching assistant designed to help you master Data Structures & Algorithms through Socratic questioning. Learn at your pace with personalized guidance to deepen your understanding.
          </p>
          <div className="mt-8">
            <Button variant={'default'} className='bg-white'>
              Explore Features
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-12">
            Why PSEUDO?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="shadow-lg">
              <CardContent>
                <Typography variant="h5" component="div" className="font-bold text-gray-800">
                  Socratic Method Teaching
                </Typography>
                <Typography variant="body2" color="text.secondary" className="mt-2 font-semibold">
                  Our AI tutor asks the right questions to guide you through your problem-solving process, helping you develop a deep understanding of algorithms without giving you the answers.
                </Typography>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="shadow-lg">
              <CardContent>
                <Typography variant="h5" component="div" className="font-bold text-gray-800">
                  Personalized Feedback
                </Typography>
                <Typography variant="body2" color="text.secondary" className="mt-2 font-semibold">
                  Receive tailored feedback based on your responses and progress. The AI adapts to your learning speed and areas of difficulty, ensuring an optimized learning experience.
                </Typography>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="shadow-lg">
              <CardContent>
                <Typography variant="h5" component="div" className="font-bold text-gray-800">
                  Interactive Coding Environment
                </Typography>
                <Typography variant="body2" color="text.secondary" className="mt-2 font-semibold">
                  Implement, run, and test your code directly within PSEUDO. Our environment allows you to interactively learn, troubleshoot, and improve your understanding of algorithms.
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-16 bg-blue-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-12">
            How Does PSEUDO Work?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Step 1 */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">1. Start a Session</h3>
              <p className="mt-4 text-gray-600">
                Begin by selecting an algorithmic topic or challenge. Whether it&apos;s sorting algorithms or data structures, the AI is ready to guide you through it.
              </p>
            </div>

            {/* Step 2 */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">2. Answer AI-Prompted Questions</h3>
              <p className="mt-4 text-gray-600">
                The AI will ask probing questions to help you think critically about your solution. Instead of revealing the answer, it helps you discover it yourself.
              </p>
            </div>

            {/* Step 3 */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">3. Improve Your Code</h3>
              <p className="mt-4 text-gray-600">
                The AI provides hints and feedback based on your code. Analyze the performance, optimize the algorithm, and learn how to refactor your solution for better efficiency.
              </p>
            </div>

            {/* Step 4 */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">4. Track Your Progress</h3>
              <p className="mt-4 text-gray-600">
                Monitor your learning journey through detailed insights. Track completed challenges, review past sessions, and see how much you&apos;ve improved over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="cta" className="py-16 bg-white  text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-black">
            Ready to Master Data Structures and Algorithms?
          </h2>
          <p className="mt-4 text-lg ">
            Join PSEUDO today and experience AI-powered learning like never before. Let the Socratic method guide you to success.
          </p>
          <div className="mt-8">
            <a href="/sign-in">
            <Button variant={'default'} className='bg-blue-50'>
              Get Started Now
            </Button>
            </a>
            
          </div>
        </div>
      </section>
    </div>
  );
}
