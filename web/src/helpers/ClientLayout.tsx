'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SpecialNavbar from '@/components/mainPageNavbar'// Import the special navbar

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Conditions to hide the default Navbar and Footer
  const hideNavbarAndFooter = ['/sign-in', '/sign-up'].includes(pathname);
  
  // Check if it's the /main page to show SpecialNavbar
  const isMainPage = pathname === '/main';

  return (
    <>
      {/* Show SpecialNavbar on /main, otherwise show the default Navbar */}
      {!hideNavbarAndFooter && (isMainPage ? <SpecialNavbar /> : <Navbar />)}
      {children}
      {!hideNavbarAndFooter && <Footer />}
    </>
  );
}
