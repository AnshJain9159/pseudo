import React from 'react';
import { Linkedin, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left section - Company name and copyright */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-white">Socrates</h4>
            <p className="text-xs text-gray-600 mt-1">&copy; {new Date().getFullYear()} All rights reserved.</p>
          </div>
          
          {/* Middle section - Horizontal Quick Links */}
          <div className="flex space-x-6">
            <a href="/main" className="hover:text-white text-sm">Socrator</a>
            <a href="/visualizer" className="hover:text-white text-sm">Visualizer</a>
            <a href="/aboutus" className="hover:text-white text-sm">About Us</a>
          </div>
          
          {/* Right section - Social media */}
          <div className="flex space-x-6">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://github.com/AnshJain9159/pseudo.git" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}