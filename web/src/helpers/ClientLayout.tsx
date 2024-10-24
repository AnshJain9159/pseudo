'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SpecialNavbar from '@/components/mainPageNavbar'// Import the special navbar

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Conditions to hide the default Navbar and Footer
  const hideNav = ['/sign-in', '/sign-up',"/roadmap"].includes(pathname);
  const hideFoot = ['/sign-in', '/sign-up',"/roadmap"].includes(pathname);
  
  // Check if it's the /main page to show SpecialNavbar
  const isMainPage = pathname === '/main';

  return (
    <>
      {/* Show SpecialNavbar on /main, otherwise show the default Navbar */}
      {!hideNav && (isMainPage ? <SpecialNavbar /> : <Navbar />)}
      {children}
      {!hideFoot && <Footer />}
    </>
  );
}
