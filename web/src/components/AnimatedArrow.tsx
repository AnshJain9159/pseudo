import React from 'react';
import { ArrowRight } from 'lucide-react';

const AnimatedArrow: React.FC = () => (
  <div className="flex items-center justify-center w-16">
    <ArrowRight className="w-8 h-8 text-blue-500 animate-pulse" />
  </div>
);