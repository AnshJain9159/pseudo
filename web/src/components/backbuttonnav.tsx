"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SimpleNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const router = useRouter();

  // Handle scroll effect for the navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = () => {
    router.back();
  };

  return (
    <nav
      className={`fixed top-0 right-85 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-2 flex items-center">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="icon"
          className="text-cyan-200 hover:text-cyan-300"
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>
    </nav>
  );
};

export default SimpleNavbar;