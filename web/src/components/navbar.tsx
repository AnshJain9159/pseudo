/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSession, signOut } from 'next-auth/react'; 
import { useRouter } from 'next/navigation';

// Import a cool font from Google Fonts
import '@fontsource/jetbrains-mono'; // Or any other font suitable to your theme

// Define navigation items with categories
const navItems = [
  { name: 'Socrator', href: '/main' },
  { name: 'Code Analyzer', href: '/analyzer' },
  {
    category: 'Features',
    items: [
      { name: "DSA's Roadmap", href: '/roadmap' },
      { name: "LLM's Visualization", href: '/visualizer' },

    ],
  },
  {
    category: 'More',
    items: [
      { name: 'User Dashboard', href: '/u/dashboard' },
      { name: 'About Us', href: '/aboutus' },
    ],
  },
  
];

const Navbar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const { loading } = useAuth(); 
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setTimeout(() => {
      router.replace(`/`);
      router.refresh();
    }, 1000);
  };

  const NavLink: React.FC<{ item: any; onClick?: () => void }> = ({ item, onClick }) => (
    <Link
      href={item.href}
      className="px-4 py-2 text-sm font-medium text-white hover:text-cyan-300 transition-colors duration-300"
      onClick={onClick}
    >
      {item.name}
    </Link>
  );

  const NavDropdown: React.FC<{ category: string; items: any[] }> = ({ category, items }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-4 py-2 text-sm font-medium text-white hover:text-cyan-300">
          {category} <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-800 border-gray-700">
        {items.map((item) => (
          <DropdownMenuItem key={item.name} className="hover:bg-gray-700">
            <NavLink item={item} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const AuthButton: React.FC<{ href: string; onClick?: () => void; children: React.ReactNode }> = ({ href, onClick, children }) => (
    <Link
      href={href}
      onClick={onClick}
      className="px-4 py-2 text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-300 rounded"
    >
      {children}
    </Link>
  );

  const isNavCategory = (item: any): item is { category: string; items: any[] } => {
    return 'category' in item && 'items' in item;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-white">
            Socrates
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item, index) => (
              isNavCategory(item) ? (
                <NavDropdown key={index} category={item.category} items={item.items} />
              ) : (
                <NavLink key={index} item={item} />
              )
            ))}
            {loading ? (
              <span>Loading...</span>
            ) : session ? (
              <>
                <AuthButton href="/u/profile">User Profile</AuthButton>
                <AuthButton href="#" onClick={handleLogout}>Logout</AuthButton>
              </>
            ) : (
              <>
                <AuthButton href="/sign-in">Login</AuthButton>
                <AuthButton href="/sign-up">Register</AuthButton>
              </>
            )}
          </div>
          
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="md:hidden text-cyan-200 hover:text-cyan-300"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={closeSidebar}>
          <div
            className="fixed right-0 top-0 h-full w-64 bg-gray-800 shadow-lg z-50 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-4">
              <Button onClick={closeSidebar} variant="ghost" size="icon">
                <X className="h-6 w-6 text-cyan-200" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-4 p-4">
              {navItems.map((item, index) => (
                isNavCategory(item) ? (
                  <div key={index}>
                    <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-2">{item.category}</h3>
                    {item.items.map((subItem) => (
                      <NavLink key={subItem.name} item={subItem} onClick={closeSidebar} />
                    ))}
                  </div>
                ) : (
                  <NavLink key={index} item={item} onClick={closeSidebar} />
                )
              ))}
              {loading ? (
                <span>Loading...</span>
              ) : session ? (
                <>
                  <AuthButton href="/profile">User Profile</AuthButton>
                  <AuthButton href="#" onClick={handleLogout}>Logout</AuthButton>
                </>
              ) : (
                <>
                  <AuthButton href="/sign-in">Login</AuthButton>
                  <AuthButton href="/sign-up">Register</AuthButton>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
