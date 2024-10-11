"use client";
import { LinkedIn, GitHub, Twitter } from '@mui/icons-material';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:space-y-0 space-y-8">
          {/* Left section - Company Info */}
          <div className="text-center lg:text-left space-y-2">
            <h4 className="text-lg font-semibold text-white">Pseudo</h4>
            <p className="text-sm text-gray-400 max-w-xs">
              AI-powered learning platform to master Data Structures and Algorithms through the Socratic method.
            </p>
            <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Pseudo. All rights reserved.</p>
          </div>

          {/* Middle section - Navigation Links */}
          <div className="text-center lg:text-left space-y-2">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <div className="space-y-1">
              <a href="/features" className="block hover:text-white text-sm">Features</a>
              <a href="/aboutus" className="block hover:text-white text-sm">About</a>
              <a href="#contact" className="block hover:text-white text-sm">Contact</a>
              <a href="#privacy" className="block hover:text-white text-sm">Privacy Policy</a>
            </div>
          </div>

          {/* Right section - Social media */}
          <div className="flex justify-center lg:justify-start space-x-6">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <LinkedIn className="text-2xl" />
            </a>
            <a href="https://github.com/AnshJain9159/pseudo.git" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <GitHub className="text-2xl" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <Twitter className="text-2xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
