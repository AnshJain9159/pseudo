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
import { useSession, signOut } from 'next-auth/react'; // Add this import

  // Define types for navigation items
  type NavItem = {
    name: string;
    href: string;
  };

  type NavCategory = {
    category: string;
    items: NavItem[];
  };

  type NavItemOrCategory = NavItem | NavCategory;

  // Define navigation items with categories
  const navItems: NavItemOrCategory[] = [
    
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'PseudoBot', href: '/pseudobot' },
    { name: 'About Us', href: '/aboutus' },
  ];

  const Navbar: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const {loading } = useAuth(); // Use the Auth context
    const { data: session, status } = useSession(); // Add this line
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

    const handleLogout = async () => {
      await signOut({ redirect: false }); // Use NextAuth's signOut function
      // You can add additional logic here if needed
    };

   
    const NavLink: React.FC<{ item: NavItem; onClick?: () => void }> = ({ item, onClick }) => (
      <Link
        href={item.href}
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-300"
        onClick={onClick}
      >
        {item.name}
      </Link>
    );
  

    const NavDropdown: React.FC<{ category: string; items: NavItem[] }> = ({ category, items }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600">
            {category} <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {items.map((item) => (
            <DropdownMenuItem key={item.name}>
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
        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
      >
        {children}
      </Link>
    );

    const isNavCategory = (item: NavItemOrCategory): item is NavCategory => {
      return 'category' in item && 'items' in item;
    };

    return (
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-indigo-800">
            Pseudo
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
                <AuthButton href="/profile">
                  User Profile
                </AuthButton>
                <AuthButton href="#" onClick={handleLogout}>
                  Logout
                </AuthButton>
              </>
            ) : (
              <>
                <AuthButton href="/sign-in">
                  Login
                </AuthButton>
                <AuthButton href="/sign-up">
                  Register
                </AuthButton>
              </>
            )}
          </div>
          
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="md:hidden text-indigo-600 hover:text-indigo-800"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={closeSidebar}>
            <div
              className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg z-50 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end p-4">
                <Button onClick={closeSidebar} variant="ghost" size="icon">
                  <X className="h-6 w-6" />
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
                <AuthButton href="/profile">
                  User Profile
                </AuthButton>
                <AuthButton href="#" onClick={handleLogout}>
                  Logout
                </AuthButton>
              </>
            ) : (
              <>
                <AuthButton href="/sign-in">
                  Login
                </AuthButton>
                <AuthButton href="/sign-up">
                  Register
                </AuthButton>
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