/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

// Import a cool font from Google Fonts
import '@fontsource/jetbrains-mono'; // Or any other font suitable to your theme

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Socrator', href: '/main' },
  {
    category: 'Features',
    items: [
      { name: 'Code Analyzer', href: '/analyzer' },
      { name: 'PseudoBot', href: '/pseudobot' },
      { name: "DSA's Roadmap", href: '/roadmap' },
      { name: "What's Different?", href: '/visualizer' },
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

const SpecialNavbar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isFeaturesDropdownOpen, setIsFeaturesDropdownOpen] = useState<boolean>(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState<boolean>(false); // State for "More" dropdown
  const { data: session, status } = useSession();
  const router = useRouter();

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = (): void => {
    setIsSidebarOpen(false);
  };

  const toggleFeaturesDropdown = (): void => {
    setIsFeaturesDropdownOpen(!isFeaturesDropdownOpen);
  };

  const toggleMoreDropdown = (): void => {
    setIsMoreDropdownOpen(!isMoreDropdownOpen);
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black shadow-md transition-all duration-300">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo on the left side */}
        <Link href="/" className="font-bold text-xl text-white">
          Socrates
        </Link>

        {/* Hamburger Menu button (right side) */}
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          size="icon"
          className="text-cyan-200 hover:text-cyan-300"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar for navigation items and auth buttons */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeSidebar}
      >
        <div
          className={`fixed right-0 top-0 h-full w-64 bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          <div className="flex justify-end p-4">
            <Button onClick={closeSidebar} variant="ghost" size="icon">
              <X className="h-6 w-6 text-cyan-200" />
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-4 p-4">
            {navItems.map((item, index) => {
              // Check if the item is a category (like "Features" or "More")
              if (item.category) {
                return (
                  <div key={index}>
                    {/* Dropdown Toggle for Category */}
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => {
                        if (item.category === 'Features') toggleFeaturesDropdown();
                        if (item.category === 'More') toggleMoreDropdown();
                      }}
                    >
                      <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-2">
                        {item.category}
                      </h3>
                      {/* Chevron to show expand/collapse */}
                      {(item.category === 'Features' && (
                        <Button variant="ghost" size="icon">
                          {isFeaturesDropdownOpen ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      )) ||
                        (item.category === 'More' && (
                          <Button variant="ghost" size="icon">
                            {isMoreDropdownOpen ? (
                              <ChevronUp className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        ))}
                    </div>

                    {/* Dropdown Content for Features */}
                    {item.category === 'Features' && isFeaturesDropdownOpen && (
                      <div className="flex flex-col space-y-2 ml-4">
                        {item.items.map((subItem) => (
                          <NavLink key={subItem.name} item={subItem} onClick={closeSidebar} />
                        ))}
                      </div>
                    )}

                    {/* Dropdown Content for More */}
                    {item.category === 'More' && isMoreDropdownOpen && (
                      <div className="flex flex-col space-y-2 ml-4">
                        {item.items.map((subItem) => (
                          <NavLink key={subItem.name} item={subItem} onClick={closeSidebar} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              } else {
                return <NavLink key={index} item={item} onClick={closeSidebar} />;
              }
            })}

            {/* Authentication Links */}
            {status === 'loading' ? (
              <span>Loading...</span>
            ) : session ? (
              <>
                <NavLink item={{ name: 'User Profile', href: '/u/profile' }} onClick={closeSidebar} />
                <NavLink item={{ name: 'Logout', href: '#' }} onClick={handleLogout} />
              </>
            ) : (
              <>
                <NavLink item={{ name: 'Login', href: '/sign-in' }} onClick={closeSidebar} />
                <NavLink item={{ name: 'Register', href: '/sign-up' }} onClick={closeSidebar} />
              </>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default SpecialNavbar;
