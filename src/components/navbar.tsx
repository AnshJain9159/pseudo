"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // agar scroll hogya y axis pr 
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = (): void => {
    setIsSidebarOpen(false);
  };

  const getLinkHref = (item: string): string => {
    return item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white text-blue-800 shadow-md' : 'bg-transparent text-black'
    }`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl transition-colors duration-300">
          Pseudo
        </Link>
        <div className="hidden md:flex space-x-1">
          {['Home', 'Features', 'About Us', 'IDE'].map((item) => (
            <Link 
              key={item} 
              href={getLinkHref(item)} 
              className="px-3 py-2 rounded-md text-md font-medium hover:bg-blue-700 hover:text-white transition-colors duration-300"
            >
              {item}
            </Link>
          ))}
        </div>
        <Button 
          onClick={toggleSidebar} 
          className="md:hidden focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md p-2"
          aria-label="Toggle menu"
        >
          <svg className={`h-6 w-6 ${isScrolled ? 'text-blue-800' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isSidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </Button>
        
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeSidebar}>
          <div 
            className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform translate-x-0 transition-transform duration-300 ease-in-out z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-4">
              <Button onClick={closeSidebar} className="focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md p-2">
                <svg className="h-6 w-6 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
            <nav className="flex flex-col space-y-4 p-4">
              {['Home', 'Features', 'About Us', 'IDE'].map((item) => (
                <Link 
                  key={item}
                  href={getLinkHref(item)}
                  className="text-blue-800 hover:bg-blue-100 px-3 py-2 rounded-md transition-colors duration-300" 
                  onClick={closeSidebar}
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;