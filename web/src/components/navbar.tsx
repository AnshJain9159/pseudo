/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from 'context/AuthContext';
import { useSession, signOut } from 'next-auth/react'; 
import { useRouter } from 'next/navigation';

// Import a cool font from Google Fonts
import '@fontsource/jetbrains-mono'; // Or any other font suitable to your theme

// Define navigation items with categories
const navItems = [
  { name: 'Socrator', href: '/main' },
  {
    category: 'Features',
    items: [
      { name: 'Code Analyser', href: '/analyzer' },
      { name: "Algorithm's Visualisation", href: '/algovisualise' },
      { name: "LLM's Visualisation", href: '/visualizer' },
      { name: "Computer Science Roadmap", href: '/roadmap' },
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
  const { loading } = useAuth(); 
  const { data: session, status } = useSession();
  const router = useRouter();

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

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
        <Button variant="ghost" className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
          {category} <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black border border-zinc-800 rounded-lg shadow-lg">
        {items.map((item) => (
          <DropdownMenuItem key={item.name} className="focus:bg-zinc-900 focus:text-white">
            <Link href={item.href} className="w-full px-4 py-2 text-sm text-zinc-300 hover:text-white">
              {item.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const AuthButton: React.FC<{ href: string; onClick?: () => void; children: React.ReactNode }> = ({ href, onClick, children }) => (
    <Link
      href={href}
      onClick={onClick}
      className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-colors duration-300 rounded-lg"
    >
      {children}
    </Link>
  );

  const isNavCategory = (item: any): item is { category: string; items: any[] } => {
    return 'category' in item && 'items' in item;
  };

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-black border-b border-zinc-800">
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
              <span className="text-zinc-500">Loading...</span>
            ) : session ? (
              <>
                <AuthButton href="/u/profile">Profile</AuthButton>
              </>
            ) : null}
          </div>
          
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="md:hidden text-zinc-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      {isSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out" 
            onClick={closeSidebar}
            aria-hidden="true"
          />
          <div
            className="fixed right-0 top-0 h-full w-[280px] bg-black border-l border-zinc-800 shadow-lg z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-4">
              <Button onClick={closeSidebar} variant="ghost" size="icon" className="text-zinc-300 hover:text-white">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-6 p-4">
              {navItems.map((item, index) => (
                isNavCategory(item) ? (
                  <div key={index} className="space-y-3">
                    <h3 className="font-semibold text-sm text-zinc-500 uppercase tracking-wider">{item.category}</h3>
                    <div className="flex flex-col space-y-2 pl-2">
                      {item.items.map((subItem) => (
                        <NavLink key={subItem.name} item={subItem} onClick={closeSidebar} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <NavLink key={index} item={item} onClick={closeSidebar} />
                )
              ))}
              {loading ? (
                <span className="text-zinc-500">Loading...</span>
              ) : session ? (
                <div className="pt-4 border-t border-zinc-800">
                  <AuthButton href="/u/profile" onClick={closeSidebar}>Profile</AuthButton>
                </div>
              ) : null}
            </nav>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
