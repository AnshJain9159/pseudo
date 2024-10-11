"use client";

import React from "react";
import { Container, Grid, Card, CardContent, Typography } from "@mui/material";
import { BadgeCheck, ChevronRight, Code, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
  
const features = [
  {
    icon: <Code className="text-indigo-600 w-10 h-10" />,
    title: "Algorithm Learning",
    description: "Understand sorting algorithms like Bubble, Merge, and Quick Sort through step-by-step Socratic method questioning.",
  },
  {
    icon: <Search className="text-green-600 w-10 h-10" />,
    title: "Interactive Visualizations",
    description: "Experience dynamic visualizations that adapt to your learning path, helping to visualize sorting operations in real-time.",
  },
  {
    icon: <BadgeCheck className="text-yellow-500 w-10 h-10" />,
    title: "Performance Tracking",
    description: "Track your progress with detailed insights into your learning performance and completion rate of different algorithm exercises.",
  },
  {
    icon: <ChevronRight className="text-blue-500 w-10 h-10" />,
    title: "AI-Powered Assistance",
    description: "Get personalized feedback and guidance based on your learning patterns, driven by AI-powered analysis.",
  },
];

const FeaturesPage = () => {
  return (
    <Container maxWidth="lg" className="py-20 min-h-screen">
      <div className="text-center mb-12">
        <h4 className="text-4xl font-bold text-gray-900">Powerful Features of Algorithm Tutor</h4>
        
        <p className="mt-4 text-lg text-gray-500">
          Algorithm Tutor provides an intuitive and personalized learning experience that helps students master sorting algorithms with ease.
        </p>
      </div>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="flex flex-col items-center p-6">
                <div className="mb-4">{feature.icon}</div>
                <Typography variant="h6" className="text-lg font-semibold text-gray-800">
                  {feature.title}
                </Typography>
                <Typography className="mt-2 text-gray-600 text-center">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        
        <Tooltip delayDuration={200}>
         <TooltipTrigger>
            <a href="/pseudobot">
                <Button
                variant={"default"}
                className="text-white bg-indigo-600 hover:bg-indigo-700 font-semibold text-lg py-3 px-6 rounded-lg shadow-md"
                >
                Start Learning Now
            </Button>
          </a> 
         </TooltipTrigger>
         <TooltipContent>
                <p>Get started with Algorithm Tutor today!</p>
            </TooltipContent>
          
        </Tooltip>
      </div>
    </Container>
  );
};

export default FeaturesPage;
